#!/usr/bin/env python3
"""Render the Doodh Hisaab launcher icons from a simple geometric design.

Run from the repo root:  .venv/bin/python tools/make_icons.py
Requires Pillow (dev-only). Output: android/app/src/main/res/mipmap-*/ic_launcher.png
"""
import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

GREEN_TOP = (36, 134, 79)
GREEN_BOTTOM = (19, 88, 55)
WHITE = (255, 255, 255, 255)
SUPERSAMPLE = 4


def rounded_mask(size, radius):
    mask = Image.new("L", (size * SUPERSAMPLE, size * SUPERSAMPLE), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle(
        [0, 0, size * SUPERSAMPLE - 1, size * SUPERSAMPLE - 1],
        radius=radius * SUPERSAMPLE,
        fill=255,
    )
    return mask.resize((size, size), Image.LANCZOS)


def gradient(size):
    img = Image.new("RGB", (1, size))
    for y in range(size):
        f = y / max(1, size - 1)
        img.putpixel(
            (0, y),
            (
                round(GREEN_TOP[0] + (GREEN_BOTTOM[0] - GREEN_TOP[0]) * f),
                round(GREEN_TOP[1] + (GREEN_BOTTOM[1] - GREEN_TOP[1]) * f),
                round(GREEN_TOP[2] + (GREEN_BOTTOM[2] - GREEN_TOP[2]) * f),
            ),
        )
    return img.resize((size, size), Image.BICUBIC)


def bezier(p0, p1, p2, steps=48):
    pts = []
    for i in range(steps + 1):
        t = i / steps
        x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0]
        y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1]
        pts.append((x, y))
    return pts


def drop_polygon(cx, cy, scale):
    """Classic milk drop: pointed top + round bulb."""
    r = 0.30 * scale
    apex = (cx, cy - 0.46 * scale)
    bulb = (cx, cy + 0.10 * scale)
    right = (cx + r * math.cos(math.radians(20)), bulb[1] + r * math.sin(math.radians(20)))
    left = (cx - r * math.cos(math.radians(20)), bulb[1] + r * math.sin(math.radians(20)))

    pts = [apex]
    pts += bezier(apex, (cx + 0.34 * scale, cy - 0.10 * scale), right, 40)
    # bulb arc from 20deg through 90, 180, 270 to 160deg
    start, end = 20, 160
    steps = 90
    for i in range(steps + 1):
        a = math.radians(start + (end - start) * i / steps)
        pts.append((bulb[0] + r * math.cos(a), bulb[1] + r * math.sin(a)))
    pts += bezier(left, (cx - 0.34 * scale, cy - 0.10 * scale), apex, 40)
    return pts


def render(size, rounded=True):
    big = size * SUPERSAMPLE
    layer = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    grad = gradient(big).convert("RGBA")
    if rounded:
        mask = Image.new("L", (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, big - 1, big - 1], radius=int(big * 0.235), fill=255
        )
        layer.paste(grad, (0, 0), mask)
    else:
        layer.paste(grad, (0, 0))

    d = ImageDraw.Draw(layer)
    pts = drop_polygon(big / 2, big * 0.50, big * 0.72)
    d.polygon(pts, fill=WHITE)

    # little highlight on the drop, composited properly
    shine = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shine)
    sd.ellipse([big * 0.395, big * 0.575, big * 0.475, big * 0.70], fill=(227, 243, 234, 235))
    layer = Image.alpha_composite(layer, shine)

    return layer.resize((size, size), Image.LANCZOS)


def main():
    sizes = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    for name, size in sizes.items():
        out_dir = os.path.join(RES, "mipmap-" + name)
        os.makedirs(out_dir, exist_ok=True)
        render(size).save(os.path.join(out_dir, "ic_launcher.png"), optimize=True)
        print("wrote", os.path.join(out_dir, "ic_launcher.png"))

    # big preview for the README / store listing
    preview_dir = os.path.join(ROOT, "docs")
    os.makedirs(preview_dir, exist_ok=True)
    render(512).save(os.path.join(preview_dir, "icon-512.png"), optimize=True)
    print("wrote", os.path.join(preview_dir, "icon-512.png"))


if __name__ == "__main__":
    main()
