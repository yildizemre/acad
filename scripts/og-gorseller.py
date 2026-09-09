# -*- coding: utf-8 -*-
"""
Paylaşım görsellerini (og:image) üretir — WhatsApp, Facebook, X, LinkedIn.

NEDEN GEREKLİ
-------------
WhatsApp ve Facebook önizlemelerinde **SVG desteklenmez**. Kurs sayfalarının
og:image'ı ders ekranı SVG'siydi; link paylaşıldığında hiç görsel çıkmıyordu.
Bu betik her sayfa için 1200x630 PNG kart üretir.

TASARIM
-------
Sitenin yeni dili: beyaz zemin, kalın siyah başlık, fosforlu vurgu, marka
mavisi. Kurs kartları o kursun kendi renginde çıkar.

Çalıştırmak için:  python scripts/og-gorseller.py
Çıktı:             public/og.png (ana sayfa) ve public/og/*.png
"""
import io
import json
import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
WHITE = (255, 255, 255)
NIGHT = (15, 18, 22)
GREY = (100, 109, 124)
BLUE = (27, 24, 255)
MARKER = (216, 248, 78)

TINTS = {
    'peach': (255, 234, 223),
    'rose': (252, 228, 242),
    'lime': (237, 249, 206),
    'sky': (226, 236, 254),
    'lilac': (237, 231, 254),
    'mint': (220, 245, 236),
}

FD = 'C:/Windows/Fonts/'


def font(names, size):
    for n in names:
        p = FD + n
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def BLACK(s):   # başlıklar — en kalın kesit
    return font(['seguibl.ttf', 'ariblk.ttf', 'arialbd.ttf'], s)


def BOLD(s):
    return font(['segoeuib.ttf', 'arialbd.ttf'], s)


def REG(s):
    return font(['segoeui.ttf', 'arial.ttf'], s)


def wrap(d, text, f, max_w):
    """Metni genişliğe göre satırlara böler."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=f) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_marked(d, x, y, line, f, mark_words, fill=NIGHT):
    """
    Satırı çizer; `mark_words` içindeki kelimelerin arkasını fosforlu boyar.
    Kodland'daki vurgu efektinin aynısı.
    """
    cx = x
    space = d.textlength(' ', font=f)
    asc, desc = f.getmetrics()
    for word in line.split():
        temiz = word.strip('.,!?:;').lower()
        w = d.textlength(word, font=f)
        if temiz in mark_words:
            pad = f.size * 0.14
            d.rounded_rectangle(
                [cx - pad, y - f.size * 0.06, cx + w + pad, y + asc + desc * 0.25],
                radius=f.size * 0.16, fill=MARKER,
            )
        d.text((cx, y), word, font=f, fill=fill)
        cx += w + space


def paste_logo(img, x, y, width=270):
    try:
        logo = Image.open('public/logo.png').convert('RGBA')
        logo = logo.resize((width, round(logo.height * width / logo.width)), Image.LANCZOS)
        img.paste(logo, (x, y), logo)
        return logo.height
    except Exception:
        return 0


def card(bg, eyebrow, title, mark_words, facts, title_size=68):
    img = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(img)

    # Sağ alt köşede marka mavisi yay — boşluğu dolduruyor
    d.ellipse([W - 190, H - 190, W + 260, H + 260], fill=BLUE)

    lh = paste_logo(img, 70, 58)
    y = 58 + lh + 40

    if eyebrow:
        d.text((70, y), eyebrow.upper(), font=BOLD(22), fill=GREY)
        y += 42

    f = BLACK(title_size)
    lines = wrap(d, title, f, W - 70 - 250)
    while len(lines) > 3 and title_size > 40:
        title_size -= 6
        f = BLACK(title_size)
        lines = wrap(d, title, f, W - 70 - 250)
    for line in lines[:3]:
        draw_marked(d, 70, y, line, f, mark_words)
        y += title_size + 14

    # Alt bant
    if facts:
        d.text((70, H - 74), '   ·   '.join(facts), font=REG(25), fill=GREY)
    return img


def load_data():
    """TypeScript veri dosyalarını esbuild ile derleyip okur."""
    entry = 'node_modules/.og-entry.ts'
    out = 'node_modules/.og-data.mjs'
    io.open(entry, 'w', encoding='utf-8').write(
        "export { COURSES, totalLessons } from '../src/data/courses';\n"
        "export { ARTICLES_BY_DATE } from '../src/data/articles';\n"
        "export { TIERS, priceFor, formatTRY } from '../src/data/pricing';\n"
    )
    subprocess.run(
        ['npx', 'esbuild', entry, '--bundle', '--format=esm', '--platform=node',
         f'--outfile={out}', '--log-level=silent'],
        check=True, shell=(os.name == 'nt'),
    )
    res = subprocess.run(
        ['node', '--input-type=module', '-e', f'''
        const m = await import("./{out}");
        console.log(JSON.stringify({{
          kurslar: m.COURSES.map(c => ({{
            id: c.id, title: c.title, ageRange: c.ageRange, level: c.level,
            tint: c.tint, weeks: c.weeks, lessons: m.totalLessons(c),
            price: m.formatTRY(m.priceFor(m.TIERS[0], c)),
          }})),
          yazilar: m.ARTICLES_BY_DATE.map(a => ({{
            slug: a.slug, title: a.title, category: a.category, min: a.readMinutes,
          }})),
        }}));
        '''],
        capture_output=True, text=True, encoding='utf-8', check=True,
    )
    data = json.loads(res.stdout.strip().splitlines()[-1])
    for f in (entry, out):
        try:
            os.remove(f)
        except OSError:
            pass
    return data


if __name__ == '__main__':
    os.makedirs('public/og', exist_ok=True)
    data = load_data()

    # ── Ana sayfa — sloganıyla ──
    card(
        WHITE, '2020’den beri · Gebze Teknik Üniversitesi',
        'Çocuğunuz ekranın üretici tarafına geçsin',
        {'üretici'},
        ['8–17 yaş', 'canlı online dersler', 'ilk ders ücretsiz'],
        title_size=70,
    ).save('public/og.png', 'PNG', optimize=True)
    print(f'public/og.png  {os.path.getsize("public/og.png") // 1024} KB')

    # ── Kurs sayfaları — her biri kendi renginde ──
    for c in data['kurslar']:
        img = card(
            TINTS.get(c['tint'], WHITE),
            f"{c['ageRange']}  ·  {c['level']}",
            c['title'],
            set(),
            [f"{c['weeks']} hafta", f"{c['lessons']} canlı ders", f"{c['price']}’den başlayan"],
            title_size=62,
        )
        p = f"public/og/kurs-{c['id']}.png"
        img.save(p, 'PNG', optimize=True)
        print(f'{p}  {os.path.getsize(p) // 1024} KB')

    # ── Rehber yazıları ──
    for a in data['yazilar']:
        img = card(
            WHITE, f"Veli Rehberi  ·  {a['category']}",
            a['title'], set(),
            [f"{a['min']} dakika okuma", 'hypeacademia.com/rehber'],
            title_size=58,
        )
        p = f"public/og/rehber-{a['slug']}.png"
        img.save(p, 'PNG', optimize=True)
        print(f'{p}  {os.path.getsize(p) // 1024} KB')

    # ── Öne çıkan diğer sayfalar ──
    digerleri = [
        ('fiyatlar', TINTS['sky'], 'Fiyatlar', 'Fiyatlarımız burada yazıyor',
         {'yazıyor'}, ['3 paket', '9 taksite kadar faizsiz', 'ilk 2 ders koşulsuz iade']),
        ('kurslar', TINTS['lime'], 'Programlar', 'Her kursun müfredatı hafta hafta açık',
         {'hafta'}, ['6 program', '8–17 yaş', 'kayıt olmadan görülebilir']),
        ('projeler', TINTS['peach'], 'Bitirme Projeleri', '8 hafta sonunda elinde ne kalıyor?',
         {'kalıyor?'}, ['oyunlar', 'web siteleri', 'robotlar', 'yapay zeka modelleri']),
        ('iletisim', TINTS['rose'], 'Ücretsiz Deneme Dersi', 'Önce deneyin, sonra karar verin',
         {'deneyin,'}, ['1 saat', 'kart bilgisi istenmez', 'bağlayıcılığı yok']),
    ]
    for slug, bg, eyebrow, title, marks, facts in digerleri:
        p = f'public/og/{slug}.png'
        card(bg, eyebrow, title, marks, facts, title_size=64).save(p, 'PNG', optimize=True)
        print(f'{p}  {os.path.getsize(p) // 1024} KB')
