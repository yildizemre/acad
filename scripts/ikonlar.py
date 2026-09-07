# -*- coding: utf-8 -*-
"""
Favicon ve uygulama ikonlarını üretir.

Logo işaretini (mavi nokta + diyagonal çubuk) vektör olarak yeniden çizer;
logo.png'den kırpma yapmaz, böylece her boyutta net kalır.

Çalıştırmak için:  python scripts/ikonlar.py
Üretilenler:
    public/favicon.svg              tarayıcı sekmesi (vektör)
    public/favicon.ico              eski tarayıcılar (16/32/48)
    public/apple-touch-icon.png     iOS ana ekran (180)
    public/icon-192.png             Android / PWA
    public/icon-512.png             Android / PWA
    public/icon-maskable-512.png    Android uyarlanabilir ikon (güvenli alan payı)
"""
import io
import os
from PIL import Image, ImageDraw

BLUE = (27, 24, 255)        # #1B18FF — logodaki mavi
CREAM = (245, 241, 234)     # #F5F1EA — marka zemini

# İşaretin 112x100 birimlik koordinatları (logo.png ölçülerek çıkarıldı)
DOT = (20, 20, 19)                    # cx, cy, r
BAR = ((92, 20), (55, 80), 38)        # başlangıç, bitiş, kalınlık
MARK_W, MARK_H = 112, 100


def favicon_svg():
    """Sekme ikonu — saydam zemin, sadece işaret."""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {MARK_W} {MARK_H}" '
        f'role="img" aria-label="Hype Academia">'
        f'<circle cx="{DOT[0]}" cy="{DOT[1]}" r="{DOT[2]}" fill="#1B18FF"/>'
        f'<line x1="{BAR[0][0]}" y1="{BAR[0][1]}" x2="{BAR[1][0]}" y2="{BAR[1][1]}" '
        f'stroke="#1B18FF" stroke-width="{BAR[2]}" stroke-linecap="round"/>'
        f'</svg>'
    )


def draw_mark(size, bg=None, scale=0.72, supersample=4):
    """İşareti kare bir tuvale ortalayarak çizer."""
    S = size * supersample
    img = Image.new('RGBA', (S, S), (*bg, 255) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # İşareti kare içine sığdır ve ortala
    k = (S * scale) / max(MARK_W, MARK_H)
    ox = (S - MARK_W * k) / 2
    oy = (S - MARK_H * k) / 2
    def P(x, y):
        return (ox + x * k, oy + y * k)

    cx, cy = P(*DOT[:2])
    r = DOT[2] * k
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLUE)

    (x1, y1), (x2, y2) = P(*BAR[0]), P(*BAR[1])
    w = BAR[2] * k
    d.line([x1, y1, x2, y2], fill=BLUE, width=round(w))
    # Yuvarlak uçlar
    for px, py in ((x1, y1), (x2, y2)):
        d.ellipse([px - w / 2, py - w / 2, px + w / 2, py + w / 2], fill=BLUE)

    return img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    os.makedirs('public', exist_ok=True)

    io.open('public/favicon.svg', 'w', encoding='utf-8').write(favicon_svg())
    print('public/favicon.svg')

    # .ico — koyu ve açık sekmelerde görünsün diye saydam zemin
    ico = draw_mark(64, scale=0.86)
    ico.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print('public/favicon.ico  (16/32/48)')

    # iOS saydamlığı siyaha çevirdiği için krem zemin veriyoruz
    draw_mark(180, bg=CREAM, scale=0.62).save('public/apple-touch-icon.png')
    print('public/apple-touch-icon.png  180x180')

    for s in (192, 512):
        draw_mark(s, bg=CREAM, scale=0.66).save(f'public/icon-{s}.png')
        print(f'public/icon-{s}.png  {s}x{s}')

    # Uyarlanabilir ikon: Android kenarlardan %20'ye kadar kırpabilir
    draw_mark(512, bg=CREAM, scale=0.46).save('public/icon-maskable-512.png')
    print('public/icon-maskable-512.png  512x512 (güvenli alan payı ile)')
