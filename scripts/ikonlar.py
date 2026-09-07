# -*- coding: utf-8 -*-
"""
Favicon ve uygulama ikonlarını üretir.

TASARIM KARARI
--------------
İlk denemede işaret saydam zemine çizilmişti; 16 pikselde ince bir çubuk gibi
görünüyor, açık renkli sekmelerde kayboluyordu. Bunun yerine artık **katı mavi
bir karo** üzerine krem işaret çiziliyor:

  · 16 pikselde bile net bir siluet oluşuyor
  · Açık ve koyu sekme temalarında aynı okunurlukta
  · Marka rengi (#1B18FF) sekmede doğrudan görünüyor

Çalıştırmak için:  python scripts/ikonlar.py
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

# Karo içindeki işaret oranı ve köşe yuvarlaklığı
MARK_SCALE = 0.62
RADIUS = 0.22


def favicon_svg():
    """Sekme ikonu — mavi karo, krem işaret."""
    S = 100
    k = (S * MARK_SCALE) / max(MARK_W, MARK_H)
    ox = (S - MARK_W * k) / 2
    oy = (S - MARK_H * k) / 2

    def px(x, y):
        return round(ox + x * k, 2), round(oy + y * k, 2)

    cx, cy = px(*DOT[:2])
    r = round(DOT[2] * k, 2)
    (x1, y1), (x2, y2) = px(*BAR[0]), px(*BAR[1])
    w = round(BAR[2] * k, 2)

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" '
        f'role="img" aria-label="Hype Academia">'
        f'<rect width="{S}" height="{S}" rx="{round(S * RADIUS)}" fill="#1B18FF"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#F5F1EA"/>'
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#F5F1EA" '
        f'stroke-width="{w}" stroke-linecap="round"/>'
        f'</svg>'
    )


def draw_tile(size, scale=MARK_SCALE, radius=RADIUS, bleed=False, supersample=4):
    """Mavi karo üzerine krem işaret. bleed=True ise köşeler yuvarlanmaz."""
    S = size * supersample
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if bleed:
        d.rectangle([0, 0, S, S], fill=BLUE)
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=S * radius, fill=BLUE)

    k = (S * scale) / max(MARK_W, MARK_H)
    ox = (S - MARK_W * k) / 2
    oy = (S - MARK_H * k) / 2

    def P(x, y):
        return (ox + x * k, oy + y * k)

    cx, cy = P(*DOT[:2])
    r = DOT[2] * k
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=CREAM)

    (x1, y1), (x2, y2) = P(*BAR[0]), P(*BAR[1])
    w = BAR[2] * k
    d.line([x1, y1, x2, y2], fill=CREAM, width=round(w))
    for pxy in ((x1, y1), (x2, y2)):
        d.ellipse([pxy[0] - w / 2, pxy[1] - w / 2, pxy[0] + w / 2, pxy[1] + w / 2], fill=CREAM)

    return img.resize((size, size), Image.LANCZOS)


if __name__ == '__main__':
    os.makedirs('public', exist_ok=True)

    io.open('public/favicon.svg', 'w', encoding='utf-8').write(favicon_svg())
    print('public/favicon.svg')

    # .ico — küçük boyutta köşe yuvarlaklığı azaltılır, işaret büyütülür
    ico = draw_tile(64, scale=0.66, radius=0.18)
    ico.save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
    print('public/favicon.ico  (16/32/48)')

    # iOS kendi köşe yuvarlamasını uyguladığı için tam kare veriyoruz
    draw_tile(180, scale=0.58, bleed=True).save('public/apple-touch-icon.png')
    print('public/apple-touch-icon.png  180x180')

    for s in (192, 512):
        draw_tile(s).save(f'public/icon-{s}.png')
        print(f'public/icon-{s}.png  {s}x{s}')

    # Android uyarlanabilir ikon: kenarlardan %20'ye kadar kırpabilir
    draw_tile(512, scale=0.44, bleed=True).save('public/icon-maskable-512.png')
    print('public/icon-maskable-512.png  512x512 (güvenli alan payı ile)')
