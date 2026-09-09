#!/usr/bin/env python3
"""
Generates the temporary art-direction imagery in public/img.

These are not grey placeholder boxes. Each one is a composed abstract image in
the Noriva palette, built the way defocused architectural photography behaves:
soft light pools, directional falloff, a faint structural grid, film grain and a
vignette. They exist so the site reads as finished before real photography is
uploaded through Admin, and every reference is a database field, so replacing
them is a CMS action, not a code change.

Deterministic: a given name always renders the same image.

    python3 scripts/generate_imagery.py
"""
from __future__ import annotations

import json
import os
import sys
import zlib
import numpy as np
from PIL import Image, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "img")

# Palette, mirrored from tailwind.config.ts.
INK_950 = (0x06, 0x0A, 0x16)
INK_900 = (0x0B, 0x12, 0x25)
INK_800 = (0x11, 0x1C, 0x3A)
INK_700 = (0x16, 0x21, 0x3C)
INK_500 = (0x37, 0x44, 0x65)
BRAND = (0xF5, 0x10, 0x6E)
BRAND_400 = (0xFC, 0x4B, 0x92)
BONE = (0xF7, 0xF5, 0xF2)
WARM = (0xE8, 0xC9, 0xA8)

# Each ramp is (stop, rgb). Position 0 is shadow, 1 is highlight.
RAMPS = {
    # Deep navy holding almost the whole range, lifting only at the very top
    # into a muted plum. Restraint is the point: the accent is a hint of light,
    # never the subject.
    "signature": [(0.0, (0x05, 0x08, 0x12)), (0.50, INK_900), (0.80, (0x2E, 0x1B, 0x33)), (0.94, (0x6B, 0x2A, 0x50)), (1.0, (0xA8, 0x5E, 0x84))],
    # Cool architectural daylight — the most neutral of the set.
    "cool": [(0.0, (0x05, 0x08, 0x12)), (0.48, INK_800), (0.80, INK_500), (1.0, (0xAF, 0xBC, 0xD2))],
    # Warm interior light for hospitality-leaning frames.
    "warm": [(0.0, (0x07, 0x08, 0x10)), (0.48, (0x22, 0x1D, 0x24)), (0.82, (0x6E, 0x4C, 0x40)), (1.0, (0xC8, 0xA8, 0x84))],
    # Light frames that sit on the bone sections.
    "bone": [(0.0, (0x9E, 0x97, 0x8D)), (0.40, (0xCB, 0xC4, 0xBA)), (0.78, (0xEE, 0xEA, 0xE4)), (1.0, BONE)],
    # The one genuinely accented ramp, still well short of full brand chroma.
    "brand": [(0.0, (0x05, 0x08, 0x12)), (0.46, (0x1C, 0x14, 0x2A)), (0.80, (0x63, 0x1C, 0x4C)), (1.0, (0xC0, 0x5A, 0x8B))],
}


def ramp_lut(name: str) -> np.ndarray:
    """256-entry RGB lookup table interpolated from a ramp definition."""
    stops = RAMPS[name]
    xs = np.array([s[0] for s in stops])
    lut = np.zeros((256, 3))
    t = np.linspace(0, 1, 256)
    for ch in range(3):
        ys = np.array([s[1][ch] for s in stops], dtype=float)
        lut[:, ch] = np.interp(t, xs, ys)
    return lut


def smooth_field(rs: np.random.Generator, h: int, w: int, cells: int) -> np.ndarray:
    """Low-frequency noise upscaled with bicubic smoothing — organic light pools."""
    small = rs.random((cells, max(2, int(cells * w / h))))
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    a = np.asarray(img, dtype=float) / 255.0
    return (a - a.min()) / max(1e-6, np.ptp(a))


def radial(h: int, w: int, cx: float, cy: float, radius: float, softness: float = 1.0) -> np.ndarray:
    """A soft circular light source with smooth falloff."""
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - cx * w) / (radius * w)) ** 2 + ((yy - cy * h) / (radius * w)) ** 2)
    return np.clip(1.0 - d, 0.0, 1.0) ** (2.0 * softness)


def streaks(rs: np.random.Generator, h: int, w: int, count: int, angle: float) -> np.ndarray:
    """Blurred directional bands — the 'light through structure' cue."""
    band = np.zeros((h, w))
    for _ in range(count):
        pos = rs.random()
        width = 0.012 + rs.random() * 0.075
        strength = 0.30 + rs.random() * 0.70
        yy, xx = np.mgrid[0:h, 0:w]
        coord = (xx / w) * np.cos(angle) + (yy / h) * np.sin(angle)
        band += strength * np.exp(-(((coord - pos) / width) ** 2))
    if band.max() > 0:
        band /= band.max()
    return band


def stable_seed(name: str) -> int:
    """Process-independent seed.

    `hash()` on a str is randomised per interpreter run unless PYTHONHASHSEED
    is pinned, so it cannot back a deterministic renderer. CRC32 over the
    encoded name is stable everywhere.
    """
    return zlib.crc32(name.encode("utf-8"))


def render(name: str, w: int, h: int, ramp: str = "signature", angle_deg: float | None = None,
           role: str = "backdrop", fmt: str = "JPEG") -> str:
    rs = np.random.default_rng(stable_seed(name))

    # Work at reduced scale, then upsample: cheaper and inherently soft.
    sw, sh = max(160, w // 4), max(160, h // 4)

    # Base luminance: two octaves of smooth noise.
    lum = 0.70 * smooth_field(rs, sh, sw, 3) + 0.30 * smooth_field(rs, sh, sw, 7)

    # A dominant light source gives every frame a clear direction.
    cx, cy = 0.18 + rs.random() * 0.64, 0.12 + rs.random() * 0.6
    lum += 0.62 * radial(sh, sw, cx, cy, 0.42 + rs.random() * 0.4)

    # A secondary, dimmer pool adds depth.
    lum += 0.26 * radial(sh, sw, rs.random(), rs.random(), 0.3 + rs.random() * 0.3)

    # Structural streaks, softly blended so they read as architecture, not bars.
    ang = np.deg2rad(angle_deg if angle_deg is not None else rs.choice([0, 90, 90, 12, 168]))
    lum += (0.16 + rs.random() * 0.22) * streaks(rs, sh, sw, rs.integers(3, 8), ang)

    lum = (lum - lum.min()) / max(1e-6, np.ptp(lum))

    # Gentle S-curve for photographic contrast.
    lum = np.clip(lum, 0, 1)
    lum = lum * lum * (3 - 2 * lum)
    # Backdrops carry headline text, so they stay weighted to shadow. Content
    # images are the subject rather than a substrate and need real exposure,
    # otherwise they read as empty boxes against the light sections.
    if role == "content":
        lum = lum ** 0.92
        lum = 0.16 + 0.84 * lum
    else:
        lum = lum ** 1.65
        lum = 0.03 + 0.90 * lum

    # Upscale smoothly to full size before colouring.
    lum_img = Image.fromarray((lum * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    lum_img = lum_img.filter(ImageFilter.GaussianBlur(radius=max(1.0, w / 420)))
    lum_full = np.asarray(lum_img, dtype=float) / 255.0

    rgb = ramp_lut(ramp)[(lum_full * 255).astype(np.uint8)]

    # Vignette.
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    vig = np.clip(1.0 - 0.30 * np.clip(d - 0.55, 0, None) / 0.75, 0, 1)
    if ramp == "bone":
        vig = np.clip(1.0 - 0.12 * np.clip(d - 0.6, 0, None) / 0.7, 0, 1)
    rgb *= vig[..., None]

    # Film grain, finer in the highlights — this is what kills the vector look.
    grain = rs.normal(0, 1, (h, w))
    grain = np.asarray(
        Image.fromarray(((grain - grain.min()) / np.ptp(grain) * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(0.6)
        ),
        dtype=float,
    )
    grain = (grain - grain.mean()) / max(1e-6, grain.std())
    rgb += grain[..., None] * (5.0 if ramp != "bone" else 3.2)

    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")
    if fmt == "WEBP":
        path = os.path.join(OUT, f"{name}.webp")
        out.save(path, "WEBP", quality=76, method=6)
    else:
        path = os.path.join(OUT, f"{name}.jpg")
        out.save(path, "JPEG", quality=88, optimize=True, progressive=True, subsampling=0)
    return path


SPECS: list[tuple[str, int, int, str]] = [
    ("hero", 2400, 1350, "signature"),
    ("about", 1800, 1200, "cool"),
    ("cta", 2000, 1000, "brand"),
    ("service-brand", 1400, 1050, "signature"),
    ("service-digital", 1400, 1050, "cool"),
    ("service-content", 1400, 1050, "warm"),
    ("service-growth", 1400, 1050, "brand"),
    ("service-experience", 1400, 1050, "cool"),
]

_work_ramps = ["signature", "warm", "cool", "brand", "cool", "warm"]
for i in range(6):
    portrait = i % 2 == 1
    SPECS.append((f"work-{i + 1}", 1400 if portrait else 1800, 1750 if portrait else 1150, _work_ramps[i]))

for i in range(12):
    SPECS.append((f"gallery-{i + 1}", 1600, 1100, ["cool", "warm", "signature", "bone"][i % 4]))

for i in range(4):
    SPECS.append((f"insight-{i + 1}", 1600, 900, ["cool", "signature", "warm", "brand"][i]))

for i in range(5):
    SPECS.append((f"stage-{i + 1}", 1200, 900, ["signature", "cool", "warm", "brand", "cool"][i]))


# Additional art direction for the content the CMS now holds — one composed
# frame per service, article, engagement and system discipline, so no two
# records share a visual. The manifest is generated from the content modules by
# `node scripts/build-visual-manifest.mjs`, which keeps this file free of any
# duplicated list of slugs.
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "visual-manifest.json")


def load_manifest() -> list[dict]:
    if not os.path.exists(MANIFEST):
        return []
    with open(MANIFEST, encoding="utf-8") as fh:
        return json.load(fh)["images"]


def _present(path: str) -> bool:
    """True when the file exists *and* holds an image.

    A zero-byte file is a failed or interrupted write, not art direction. Plain
    `os.path.exists` treats one as done, so an empty file survives every re-run
    while the pages referencing it render a broken image: the file is served,
    but the image optimiser cannot decode it and answers 400.
    """
    return os.path.exists(path) and os.path.getsize(path) > 0


def main() -> None:
    """Renders anything missing from public/img.

    An image that already exists is left alone unless --force is passed. Two
    reasons: the file may have been replaced deliberately, and the seeding fix
    that made this script genuinely deterministic also changed what a given
    name renders — so a blind re-run would rewrite committed art direction.
    """
    force = "--force" in sys.argv
    os.makedirs(OUT, exist_ok=True)

    written = 0
    for name, w, h, ramp in SPECS:
        if not force and _present(os.path.join(OUT, f"{name}.jpg")):
            continue
        role = "content" if name.split("-")[0] in {"work", "gallery", "insight", "service"} else "backdrop"
        render(name, w, h, ramp, role=role)
        written += 1

    manifest = load_manifest()
    for item in manifest:
        if not force and _present(os.path.join(OUT, f"{item['name']}.webp")):
            continue
        render(
            item["name"],
            item["width"],
            item["height"],
            item["ramp"],
            role=item.get("role", "content"),
            fmt="WEBP",
        )
        written += 1
    with open(os.path.join(OUT, "README.md"), "w") as fh:
        fh.write(
            "# Temporary art direction\n\n"
            "Generated by `scripts/generate_imagery.py`. These are composed abstract\n"
            "visuals in the Noriva palette, not final photography. Replace them by\n"
            "uploading real images in Admin — no code change is required, because every\n"
            "reference is a database field.\n"
        )
    print(f"rendered {written} new image(s); {len(SPECS)} jpeg and {len(manifest)} webp specs in total")


if __name__ == "__main__":
    main()
