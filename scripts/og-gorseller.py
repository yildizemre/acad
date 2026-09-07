# -*- coding: utf-8 -*-
"""
Sayfaya özel paylaşım görsellerini (og:image) üretir.

NEDEN AYRI ÜRETİLİYOR
---------------------
WhatsApp, Facebook ve X paylaşım önizlemelerinde SVG DESTEKLENMEZ. Kurs
sayfalarının og:image'ı olarak ders ekranı SVG'sini verirsek önizleme boş çıkar.
Bu yüzden her kurs ve her rehber yazısı için 1200x630 PNG kart üretiyoruz.

Kartta ne var: marka logosu, kursun adı, yaş aralığı, süre ve başlangıç fiyatı.
Küçültülmüş bir ekran görüntüsünden çok daha okunur.

Çalıştırmak için:  python scripts/og-gorseller.py
Çıktı:             public/og/kurs-*.png ve public/og/rehber-*.png
"""
import io
import json
import os
import re
import subprocess
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
SAND = (245, 241, 234)
INK = (14, 32, 56)
LEAD = (82, 94, 114)
BLUE = (27, 24, 255)
LINE = (201, 191, 174)

FD = 'C:/Windows/Fonts/'


def font(name, size):
    for f in (name, 'arial.ttf'):
        p = FD + f
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


SERIF = lambda s: font('georgiab.ttf', s)   # noqa: E731
SANS = lambda s: font('arial.ttf', s)       # noqa: E731
SANSB = lambda s: font('arialbd.ttf', s)    # noqa: E731


def wrap(draw, text, fnt, max_w):
    """Metni verilen genişliğe göre satırlara böler."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        deneme = (cur + ' ' + w).strip()
        if draw.textlength(deneme, font=fnt) <= max_w:
            cur = deneme
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def card(eyebrow, title, facts, max_lines=3):
    img = Image.new('RGB', (W, H), SAND)
    d = ImageDraw.Draw(img)

    # Sağ kenarda mürekkep bloğu ve marka mavisi şerit
    d.rectangle([W - 118, 0, W, H], fill=INK)
    d.rectangle([W - 118, 0, W - 114, H], fill=BLUE)

    # Logo
    try:
        logo = Image.open('public/logo.png').convert('RGBA')
        tw = 300
        logo = logo.resize((tw, round(logo.height * tw / logo.width)), Image.LANCZOS)
        img.paste(logo, (78, 62), logo)
        top = 62 + logo.height + 44
    except Exception:
        top = 120

    d.text((78, top), eyebrow.upper(), font=SANSB(20), fill=LEAD)

    # Başlık — sığmazsa punto küçültülür
    y = top + 44
    for size in (60, 54, 48, 42):
        f = SERIF(size)
        lines = wrap(d, title, f, W - 78 - 170)
        if len(lines) <= max_lines:
            break
    for i, line in enumerate(lines[:max_lines]):
        d.text((78, y + i * (size + 12)), line, font=f, fill=INK)
    y += len(lines[:max_lines]) * (size + 12) + 14

    d.rectangle([78, y, 78 + 190, y + 5], fill=BLUE)

    # Alt bant — künye
    d.line([(78, H - 92), (W - 170, H - 92)], fill=LINE, width=2)
    d.text((78, H - 70), '   ·   '.join(facts), font=SANS(24), fill=LEAD)
    return img


def load_data():
    """TypeScript veri dosyalarını esbuild ile derleyip okur."""
    tmp = 'node_modules/.og-data.mjs'
    entry = 'node_modules/.og-entry.ts'
    io.open(entry, 'w', encoding='utf-8').write(
        "export { COURSES, totalLessons } from '../src/data/courses';\n"
        "export { ARTICLES_BY_DATE } from '../src/data/articles';\n"
        "export { TIERS, priceFor, formatTRY } from '../src/data/pricing';\n"
    )
    subprocess.run(
        ['npx', 'esbuild', entry, '--bundle', '--format=esm', '--platform=node',
         f'--outfile={tmp}', '--log-level=silent'],
        check=True, shell=(os.name == 'nt'),
    )
    out = subprocess.run(
        ['node', '-e', f'''
        import("./{tmp}").then(m => {{
          const kurslar = m.COURSES.map(c => ({{
            id: c.id, slug: c.slug, title: c.title, ageRange: c.ageRange,
            level: c.level, weeks: c.weeks, lessons: m.totalLessons(c),
            price: m.formatTRY(m.priceFor(m.TIERS[0], c.weeks)),
          }}));
          const yazilar = m.ARTICLES_BY_DATE.map(a => ({{
            slug: a.slug, title: a.title, category: a.category, min: a.readMinutes,
          }}));
          console.log(JSON.stringify({{ kurslar, yazilar }}));
        }});
        '''],
        capture_output=True, text=True, encoding='utf-8', check=True,
    )
    data = json.loads(out.stdout.strip().splitlines()[-1])
    for f in (tmp, entry):
        try:
            os.remove(f)
        except OSError:
            pass
    return data


if __name__ == '__main__':
    os.makedirs('public/og', exist_ok=True)
    data = load_data()

    for c in data['kurslar']:
        img = card(
            f"{c['ageRange']}  ·  {c['level']}",
            c['title'],
            [f"{c['weeks']} hafta", f"{c['lessons']} canlı ders", f"{c['price']}’den başlayan"],
        )
        path = f"public/og/kurs-{c['id']}.png"
        img.save(path, 'PNG', optimize=True)
        print(f"{path}  {os.path.getsize(path) // 1024} KB")

    for a in data['yazilar']:
        img = card(
            f"Veli Rehberi  ·  {a['category']}",
            a['title'],
            [f"{a['min']} dakika okuma", 'hypeacademia.com/rehber'],
        )
        path = f"public/og/rehber-{a['slug']}.png"
        img.save(path, 'PNG', optimize=True)
        print(f"{path}  {os.path.getsize(path) // 1024} KB")
