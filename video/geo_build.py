"""Geo-lever video builder for mh painting (Millwater, Rodney; generalised from video/dulux/build_video.py).

Usage (run from video/, Python 3 + Pillow + numpy + ffmpeg on PATH):
    python geo_build.py <folder> still               # one PNG per shot into <folder>/out/stills/
    python geo_build.py <folder> wide tall [--music F]

<folder> holds config.json (cuts, title, shots), words.json (Scribe timings) and vo_raw.mp3
(ElevenLabs, Torey). Every photo is a real mh painting job from public/projects/: no stock, no AI.
Labels never show a "before" that wasn't photographed.
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
HERE = os.path.abspath(sys.argv[1])
CFG = json.load(open(os.path.join(HERE, "config.json")))
SLUG = CFG["slug"]
# Photos come from public/projects/ unless the config names a private "src_dir" (relative to the
# folder, gitignored): e.g. a client upload that must not ship with the site. A shot path ending
# in .mp4 is a real clip (played from its start, cover-cropped); "A.jpg|B.jpg" is a before/after wipe.
PROJ = os.path.join(HERE, CFG["src_dir"]) if CFG.get("src_dir") else os.path.join(ROOT, "public", "projects")
OUT = os.path.join(HERE, "out")
FPS = 30

LEAD, GAP, END = 1.5, 1.2, 7.0
_c = CFG["cuts"]
PARAS = [(_c[i], _c[i + 1]) for i in range(len(_c) - 1)]
VO_LEN = _c[-1]
WORDS = json.load(open(os.path.join(HERE, "words.json")))


def para_out_start(k):
    t = LEAD
    for i in range(k):
        t += (PARAS[i][1] - PARAS[i][0]) + GAP
    return t


def src_to_out(t):
    for k, (a, b) in enumerate(PARAS):
        if t < b or k == len(PARAS) - 1:
            return para_out_start(k) + (t - a)
    return t


NP = len(PARAS)
TOTAL = para_out_start(NP - 1) + (PARAS[-1][1] - PARAS[-1][0]) + END
END_START = para_out_start(NP - 1)


def _shot_start(spec, after):
    if spec == "P0":
        return 0.0
    if spec.startswith("P"):
        return para_out_start(int(spec[1:]))
    word = spec[2:]
    for w in WORDS:
        if w[0].strip(".,?") == word and src_to_out(w[1]) > after + 0.5:
            return src_to_out(w[1]) - 0.15
    raise SystemExit(f"word {word} not found")


SHOTS = []
_prev = -1.0
for s in CFG["shots"]:
    st = _shot_start(s[0], _prev)
    SHOTS.append((st, *s[1:]))
    _prev = st
XFADE = 0.5

TITLE = tuple(CFG["title"])
TITLE_TALL = tuple(CFG["title_tall"])
END_ROWS = CFG["end_rows"]
CAPTION_FIX = [("Duelux", "Dulux"), ("fifteen thousand dollars", "$15,000"), ("M H Painting", "mh painting"), ("Hibiscus coast", "Hibiscus Coast")]

FONT_CANDIDATES_BOLD = [
    "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
FONT_CANDIDATES_REG = [
    "C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


def font(size, bold=True):
    for p in (FONT_CANDIDATES_BOLD if bold else FONT_CANDIDATES_REG):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


# --- captions -----------------------------------------------------------------
def build_captions():
    words = WORDS
    chunks, cur = [], []
    for w in words:
        cur.append(w)
        txt = w[0]
        weak = txt.lower() in ("of", "the", "a", "an", "to", "and", "at", "by", "in", "for", "is")
        if (txt.endswith((".", "?", ":", ",")) and len(cur) >= 3) or txt.endswith((".", "?")) \
                or (len(cur) >= 11 and not weak):
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    caps = []
    for c in chunks:
        text = " ".join(w[0] for w in c)
        for a, b in CAPTION_FIX:
            text = text.replace(a, b)
        text = text.replace("Dulux®®", "Dulux®")
        caps.append([src_to_out(c[0][1]), src_to_out(c[-1][2]) + 0.15, text.rstrip(",")])
    for i in range(len(caps) - 1):
        caps[i][1] = min(caps[i][1], caps[i + 1][0] - 0.02)
    return [tuple(c) for c in caps]


CAPS = build_captions()


def srt_time(t):
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


def write_srt():
    with open(os.path.join(OUT, f"{SLUG}.srt"), "w", encoding="utf-8") as f:
        for i, (a, b, t) in enumerate(CAPS, 1):
            f.write(f"{i}\n{srt_time(a)} --> {srt_time(b)}\n{t}\n\n")


# --- image helpers --------------------------------------------------------------
_cache = {}


def load_cover(path, w, h):
    key = (path, w, h)
    if key not in _cache:
        im = Image.open(os.path.join(PROJ, path)).convert("RGB")
        s = max(w * 1.12 / im.width, h * 1.12 / im.height)
        _cache[key] = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    return _cache[key]


def ken_burns(path, fx, fy, z, w, h):
    im = load_cover(path, w, h)
    vw, vh = w * 1.12 / z, h * 1.12 / z
    vw, vh = min(vw, im.width), min(vh, im.height)
    cx = min(max(fx * im.width, vw / 2), im.width - vw / 2)
    cy = min(max(fy * im.height, vh / 2), im.height - vh / 2)
    box = (cx - vw / 2, cy - vh / 2, cx + vw / 2, cy + vh / 2)
    return im.resize((w, h), Image.BILINEAR, box=box)


_clips = {}


def clip_frame(path, t, w, h, dur):
    """Frame of a real clip at t seconds from its start (held on the last frame), cover-cropped.
    Decodes only the shot's length, and keeps one clip in memory at a time."""
    key = (path, w, h)
    if key not in _clips:
        _clips.clear()
        cw, ch = int(w * 1.0) // 2 * 2, int(h * 1.0) // 2 * 2
        vf = f"scale={cw}:{ch}:force_original_aspect_ratio=increase,crop={cw}:{ch},fps={FPS}"
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-t", f"{dur + XFADE + 0.2:.2f}", "-i", os.path.join(PROJ, path), "-an", "-vf", vf,
                              "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
        n = len(raw) // (cw * ch * 3)
        _clips[key] = (np.frombuffer(raw, np.uint8)[: n * cw * ch * 3].reshape(n, ch, cw, 3), cw, ch)
    arr, cw, ch = _clips[key]
    k = min(int(max(t, 0) * FPS), len(arr) - 1)
    im = Image.fromarray(arr[k])
    return im if (cw, ch) == (w, h) else im.resize((w, h), Image.BILINEAR)


def wipe_progress(t, st, en):
    a, b = st + (en - st) * 0.30, st + (en - st) * 0.62
    p = min(max((t - a) / max(b - a, 0.01), 0), 1)
    return p * p * (3 - 2 * p)


def shot_frame(i, t, w, h):
    st, path, fx, fy, z0, z1, _ = SHOTS[i]
    en = SHOTS[i + 1][0] if i + 1 < len(SHOTS) else TOTAL
    if path.endswith(".mp4"):
        return clip_frame(path, t - st, w, h, en - st)
    p = min(max((t - st) / max(en - st, 0.01), 0), 1)
    p = p * p * (3 - 2 * p)
    z = z0 + (z1 - z0) * p
    if "|" in path:
        a, b = path.split("|")
        before, after = ken_burns(a, fx, fy, z, w, h), ken_burns(b, fx, fy, z, w, h)
        x = int(w * wipe_progress(t, st, en))
        if x > 0:
            before.paste(after.crop((0, 0, x, h)), (0, 0))
            if x < w:
                ImageDraw.Draw(before).rectangle((x - 3, 0, x + 3, h), fill=(255, 255, 255))
        return before
    return ken_burns(path, fx, fy, z, w, h)


def background(t, w, h):
    idx = max(i for i, s in enumerate(SHOTS) if s[0] <= t + 1e-6)
    frame = shot_frame(idx, t, w, h)
    if idx > 0 and t - SHOTS[idx][0] < XFADE:
        prev = shot_frame(idx - 1, t, w, h)
        frame = Image.blend(prev, frame, (t - SHOTS[idx][0]) / XFADE)
    return frame, idx


_logo = None


def logo_img(height):
    global _logo
    if _logo is None or _logo.height != height:
        lg = Image.open(os.path.join(ROOT, "public", "logo.png")).convert("RGBA")
        bb = lg.getbbox()
        lg = lg.crop(bb)
        white = Image.new("RGBA", lg.size, (255, 255, 255, 255))
        white.putalpha(lg.getchannel("A"))
        lg = white
        _logo = lg.resize((int(lg.width * height / lg.height), height), Image.LANCZOS)
    return _logo


def text_center(d, cx, y, text, f, fill=(255, 255, 255, 255)):
    tw = d.textlength(text, font=f)
    d.text((cx - tw / 2, y), text, font=f, fill=fill)


def fit_font(d, text, size, maxw, bold=True):
    f = font(size, bold)
    while d.textlength(text, font=f) > maxw and size > 18:
        size -= 2
        f = font(size, bold)
    return f


def wrap_lines(d, text, f, maxw):
    if d.textlength(text, font=f) <= maxw:
        return [text]
    if " · " in text:
        return [x.strip() for x in text.split(" · ")]
    words = text.split()
    best = None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        m = max(d.textlength(a, font=f), d.textlength(b, font=f))
        if best is None or m < best[0]:
            best = (m, [a, b])
    return best[1]


def boxed(d, lines, f, cx, y_top, fill, alpha, pad):
    lh = int(f.size * 1.25)
    tw = max(d.textlength(l, font=f) for l in lines)
    d.rounded_rectangle((cx - tw / 2 - pad, y_top - pad * 0.6, cx + tw / 2 + pad, y_top + lh * len(lines) - (lh - f.size) + pad * 0.9),
                        radius=int(pad * 0.6), fill=fill[:3] + (int(fill[3] * alpha),))
    for k, l in enumerate(lines):
        text_center(d, cx, y_top + k * lh, l, f, (255, 255, 255, int(255 * alpha)))
    return lh * len(lines)


def overlay(frame, t, idx, w, h, tall):
    base = frame.convert("RGBA")
    ov = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(ov)
    s = w / 1920 if not tall else w / 1080
    in_end = t >= END_START

    # end-card veil
    if in_end:
        a = min((t - END_START) / 0.8, 1) * 0.6
        ov.paste((0, 0, 0, int(255 * a)), (0, 0, w, h))

    # title scrim + title (first shot)
    if t < para_out_start(1) - 0.2:
        a = min(t / 0.6, 1, (para_out_start(1) - 0.2 - t) / 0.4)
        lines = TITLE_TALL if tall else TITLE
        f = font(int((96 if not tall else 92) * s))
        lh = int(f.size * 1.15)
        y0 = int(h * (0.36 if tall else 0.30)) - lh * len(lines) // 2
        d.rectangle((0, y0 - int(40 * s), w, y0 + lh * len(lines) + int(40 * s)), fill=(0, 0, 0, int(120 * a)))
        for k, ln in enumerate(lines):
            text_center(d, w / 2, y0 + k * lh, ln, f, (255, 255, 255, int(255 * a)))

    # before/after chips on a wipe shot
    if "|" in SHOTS[idx][1] and not in_end:
        st = SHOTS[idx][0]
        en = SHOTS[idx + 1][0] if idx + 1 < len(SHOTS) else TOTAL
        x = w * wipe_progress(t, st, en)
        f = font(int(40 * s))
        yb = h - int((200 if not tall else 640) * s)
        for txt, cx, show in (("Before", w * 0.82, x < w * 0.70), ("After", w * 0.18, x > w * 0.30)):
            if show:
                tw = d.textlength(txt, font=f)
                d.rounded_rectangle((cx - tw / 2 - 20 * s, yb - 10 * s, cx + tw / 2 + 20 * s, yb + f.size + 14 * s),
                                    radius=int(14 * s), fill=(0, 0, 0, 170))
                text_center(d, cx, yb, txt, f)

    # key-point label
    label = SHOTS[idx][6]
    if label and not in_end:
        st = SHOTS[idx][0]
        en = SHOTS[idx + 1][0] if idx + 1 < len(SHOTS) else TOTAL
        a = min((t - st - 0.3) / 0.4, 1, (en - t - 0.1) / 0.3)
        if a > 0:
            maxw = w - int(240 * s) if not tall else w - int(120 * s)
            f = font(int((46 if not tall else 52) * s))
            lines = wrap_lines(d, label, f, maxw)
            y = int(h * (0.16 if not tall else 0.18))
            boxed(d, lines, f, w / 2, y, (20, 60, 50, 205), a, int(22 * s))

    # logo on dark tab (until end card)
    if not in_end or t < END_START + 0.6:
        lg = logo_img(int(70 * s))
        pad = int(18 * s)
        x0, y0 = int(40 * s), int(40 * s)
        d.rounded_rectangle((x0, y0, x0 + lg.width + 2 * pad, y0 + lg.height + 2 * pad),
                            radius=int(16 * s), fill=(0, 0, 0, 150))
        ov.alpha_composite(lg, (x0 + pad, y0 + pad))

    # end card
    if in_end:
        a = min((t - END_START - 0.3) / 0.8, 1)
        if a > 0:
            lg = logo_img(int(170 * s))
            if lg.width > w * 0.8:
                lg = lg.resize((int(w * 0.8), int(lg.height * w * 0.8 / lg.width)), Image.LANCZOS)
            lgA = lg.copy()
            lgA.putalpha(lg.getchannel("A").point(lambda v: int(v * a)))
            cy = int(h * (0.30 if not tall else 0.33))
            ov.alpha_composite(lgA, (int((w - lg.width) / 2), cy - lg.height))
            fs = [font(int(46 * s), False), font(int(60 * s)), font(int(54 * s))]
            y = cy + int(40 * s)
            for row, f in zip(END_ROWS, fs):
                text_center(d, w / 2, y, row, f, (255, 255, 255, int(255 * a)))
                y += int(f.size * 1.45)
            dl = Image.open(os.path.join(ROOT, "public", "dulux-accredited.png")).convert("RGBA")
            dw = int(420 * s)
            dl = dl.resize((dw, int(dl.height * dw / dl.width)), Image.LANCZOS)
            dl.putalpha(dl.getchannel("A").point(lambda v: int(v * a)))
            ov.alpha_composite(dl, (int((w - dw) / 2), y + int(20 * s)))

    # captions
    for a0, b0, text in CAPS:
        if a0 < para_out_start(1) - 0.5:
            continue  # the title card already shows the opening question
        if a0 <= t <= b0:
            maxw = w - 240 if not tall else w - 140
            f = font(int((52 if not tall else 60) * s))
            lines = wrap_lines(d, text, f, maxw)
            lh = int(f.size * 1.25)
            yb = h - int(110 * s) if not tall else h - 420
            boxed(d, lines, f, w / 2, yb - lh * len(lines), (0, 0, 0, 165), 1, 18)
            break

    base.alpha_composite(ov)
    return base.convert("RGB")


def render_frame(t, w, h, tall):
    frame, idx = background(t, w, h)
    return overlay(frame, t, idx, w, h, tall)


# --- audio ----------------------------------------------------------------------
# Optional music bed (pass --music <file>). The track itself is never committed: it comes from
# the private Eko Music Library and may only ship inside the finished video.
# Default: the Eko-owned bed from the public eko-asset-library (licence-clean, Freddie 15 Nov 2026:
# always include library music). Clone it next to this repo or pass --music <file>.
_LIB = os.path.join(ROOT, "..", "faberning", "eko-asset-library", "audio", "eko-calm-pulse-bed-96bpm-61s_2026-11-13.mp3")
MUSIC = sys.argv[sys.argv.index("--music") + 1] if "--music" in sys.argv else (_LIB if os.path.exists(_LIB) else None)
MUSIC_DB = -18  # bed level before ducking; the VO sidechain pulls it down a further ~8 dB


def build_audio():
    vo = os.path.join(HERE, "vo_raw.mp3")
    out = os.path.join(OUT, "vo_mix.wav")
    parts, labels = [], []
    for k, (a, b) in enumerate(PARAS):
        pad_ms = int((LEAD if k == 0 else GAP) * 1000)
        parts.append(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,adelay={pad_ms}|{pad_ms}[p{k}]")
        labels.append(f"[p{k}]")
    fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(PARAS)}:v=0:a=1[c];" \
        f"[c]apad=whole_dur={TOTAL:.3f},loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000," \
        "aformat=channel_layouts=stereo"
    inputs = ["-i", vo]
    if MUSIC:
        inputs += ["-stream_loop", "-1", "-i", MUSIC]
        fc += "[v];[v]asplit[v1][v2];" \
            f"[1:a]atrim=0:{TOTAL:.3f},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo," \
            f"volume={MUSIC_DB}dB,afade=t=in:d=1.5,afade=t=out:st={TOTAL - 3:.3f}:d=3[m];" \
            "[m][v2]sidechaincompress=threshold=0.02:ratio=6:attack=30:release=500[md];" \
            "[v1][md]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.84[o]"
    else:
        fc += "[o]"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc,
                    "-map", "[o]", "-t", f"{TOTAL:.3f}", "-ar", "48000", "-ac", "2", out], check=True)
    return out


def render(kind):
    w, h, tall = (1920, 1080, False) if kind == "wide" else (1080, 1920, True)
    # --until S renders only the first S seconds (a test cut; full renders stay on the render box)
    until = float(sys.argv[sys.argv.index("--until") + 1]) if "--until" in sys.argv else TOTAL
    n = int(min(until, TOTAL) * FPS)
    audio = build_audio()
    dst = os.path.join(OUT, f"{SLUG}_{kind}.mp4")
    p = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                          "-s", f"{w}x{h}", "-r", str(FPS), "-i", "-", "-i", audio,
                          "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
                          "-c:a", "aac", "-b:a", "192k", "-t", f"{n / FPS:.3f}", "-movflags", "+faststart", dst],
                         stdin=subprocess.PIPE)
    for i in range(n):
        p.stdin.write(np.asarray(render_frame(i / FPS, w, h, tall)).tobytes())
        if i % 150 == 0:
            print(f"{kind}: {i}/{n}", flush=True)
    p.stdin.close()
    p.wait()
    render_frame(END_START + 3.0, w, h, tall).save(os.path.join(OUT, f"poster_{kind}.jpg"), quality=90)
    print("wrote", dst)


def stills():
    d = os.path.join(OUT, "stills")
    os.makedirs(d, exist_ok=True)
    for i, s in enumerate(SHOTS):
        en = SHOTS[i + 1][0] if i + 1 < len(SHOTS) else TOTAL
        t = s[0] + min(1.6, (en - s[0]) / 2) if i > 0 else 1.2
        for kind, (w, h, tall) in (("wide", (1920, 1080, False)), ("tall", (1080, 1920, True))):
            render_frame(t, w, h, tall).save(os.path.join(d, f"{i + 1:02d}_{kind}.jpg"), quality=85)
    print(f"total {TOTAL:.2f}s, {len(SHOTS)} shots, stills in {d}")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    args = sys.argv[2:] or ["still"]
    if "still" in args:
        stills()
    write_srt()
    for k in ("wide", "tall"):
        if k in args:
            render(k)
