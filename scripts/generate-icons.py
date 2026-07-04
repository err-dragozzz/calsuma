#!/usr/bin/env python3
"""Generate Calsuma PWA icons and the Open Graph image from primitives.

Run from the project root:  python3 scripts/generate-icons.py
Requires Pillow. Produces PNG/ICO assets under public/ and public/icons/.
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(ROOT, "public", "icons")
PUBLIC = os.path.join(ROOT, "public")
os.makedirs(ICONS, exist_ok=True)

BODY_TOP = (241, 236, 225)
BODY_BOT = (222, 215, 198)
PLATE = (203, 195, 177)
LCD_TOP = (188, 201, 173)
LCD_INK = (38, 48, 29)
KEY = (228, 221, 205)
KEY_DARK = (51, 52, 58)
EQ = (217, 83, 31)
BEZEL = (28, 29, 24)


def rrect(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def vgrad(size, top, bottom):
    """Vertical gradient image."""
    grad = Image.new("RGB", (1, size), 0)
    for y in range(size):
        t = y / max(1, size - 1)
        grad.putpixel(
            (0, y),
            tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )
    return grad.resize((size, size))


def load_font(px):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, px)
    return ImageFont.load_default()


def draw_icon(size, content_scale=1.0, bg=PLATE):
    """Draw the calculator icon at `size`, content scaled for maskable safe zone."""
    S = 1024  # supersample
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Background plate (rounded)
    bg_radius = int(S * 0.22)
    rrect(d, (0, 0, S, S), bg_radius, fill=bg + (255,))

    # Compute centered content box.
    inset = (1 - content_scale) / 2
    x0 = int(S * (0.17 + inset * 0.66))
    y0 = int(S * (0.14 + inset * 0.72))
    x1 = int(S * (0.83 - inset * 0.66))
    y1 = int(S * (0.86 - inset * 0.72))
    bw = x1 - x0

    # Body with gradient (masked rounded rect)
    body = vgrad(S, BODY_TOP, BODY_BOT).convert("RGBA")
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle((x0, y0, x1, y1), radius=int(bw * 0.15), fill=255)
    img.paste(body, (0, 0), mask)
    d.rounded_rectangle((x0, y0, x1, y1), radius=int(bw * 0.15), outline=(183, 173, 151, 255), width=3)

    pad = int(bw * 0.10)
    lx0, lx1 = x0 + pad, x1 - pad
    # LCD
    ly0 = y0 + pad
    lcd_h = int(bw * 0.28)
    d.rounded_rectangle((lx0, ly0, lx1, ly0 + lcd_h), radius=int(bw * 0.06), fill=BEZEL + (255,))
    lg = vgrad(S, LCD_TOP, (159, 176, 142)).convert("RGBA")
    lmask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(lmask).rounded_rectangle(
        (lx0 + 10, ly0 + 10, lx1 - 10, ly0 + lcd_h - 10), radius=int(bw * 0.04), fill=255
    )
    img.paste(lg, (0, 0), lmask)
    font = load_font(int(lcd_h * 0.62))
    text = "88.8"
    tb = d.textbbox((0, 0), text, font=font)
    d.text(
        (lx1 - 22 - (tb[2] - tb[0]), ly0 + (lcd_h - (tb[3] - tb[1])) / 2 - tb[1]),
        text,
        font=font,
        fill=LCD_INK + (255,),
    )

    # Keys 4x3 grid
    grid_top = ly0 + lcd_h + pad
    gh = y1 - pad - grid_top
    gw = lx1 - lx0
    cols, rows = 4, 3
    gap = int(bw * 0.045)
    kw = (gw - gap * (cols - 1)) / cols
    kh = (gh - gap * (rows - 1)) / rows
    for r in range(rows):
        for c in range(cols):
            kx0 = lx0 + c * (kw + gap)
            ky0 = grid_top + r * (kh + gap)
            box = (kx0, ky0, kx0 + kw, ky0 + kh)
            if c == 3 and r == 2:
                fill = EQ
            elif c == 3:
                fill = KEY_DARK
            else:
                fill = KEY
            d.rounded_rectangle(box, radius=int(kw * 0.28), fill=fill + (255,),
                                outline=(196, 187, 166, 255) if fill == KEY else None,
                                width=2 if fill == KEY else 0)

    return img.resize((size, size), Image.LANCZOS)


def main():
    # Standard icons
    draw_icon(192).save(os.path.join(ICONS, "icon-192.png"))
    draw_icon(512).save(os.path.join(ICONS, "icon-512.png"))
    draw_icon(180).save(os.path.join(ICONS, "apple-touch-icon.png"))
    # Maskable: content within safe zone, full-bleed background
    draw_icon(512, content_scale=0.78, bg=(203, 195, 177)).save(
        os.path.join(ICONS, "maskable-512.png")
    )
    # Favicon (multi-size ICO)
    fav = draw_icon(64)
    fav.save(os.path.join(PUBLIC, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

    # Open Graph 1200x630
    og = Image.new("RGB", (1200, 630), (215, 208, 192))
    # subtle radial-ish vignette
    grad = vgrad(630, (233, 227, 213), (203, 195, 177))
    og.paste(grad.resize((1200, 630)))
    icon = draw_icon(360)
    og.paste(icon, (110, 135), icon)
    d = ImageDraw.Draw(og)
    title_font = load_font(96)
    sub_font = load_font(40)
    tag_font = load_font(30)
    d.text((560, 210), "Calsuma", font=title_font, fill=(43, 44, 48))
    d.text((563, 330), "Premium 3D retro calculator", font=sub_font, fill=(90, 85, 74))
    d.text((563, 400), "SCIENTIFIC · HISTORY · MEMORY · OFFLINE", font=tag_font, fill=(217, 83, 31))
    og.save(os.path.join(PUBLIC, "og.png"))

    print("Icons and OG image generated.")


if __name__ == "__main__":
    main()
