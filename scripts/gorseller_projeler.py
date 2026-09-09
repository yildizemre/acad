# -*- coding: utf-8 -*-
"""
Proje görsellerini üretir — kurs sonunda ortaya çıkan işin kendisi.
Görüşme penceresi yok; sadece ürünün ekranı.

Çalıştırmak için:   python scripts/gorseller_projeler.py
Çıktı:              public/images/proje-*.svg
"""
import io
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gorseller import OUT, INK, BRICK, SAND, TXT, DIM, GREEN, txt, rect, circle  # noqa: E402

PW, PH = 1000, 750


def pwrap(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {PW} {PH}" '
            f'width="{PW}" height="{PH}" role="img">' + ''.join(body) + '</svg>')


def browser_chrome(url, bg=SAND):
    p = [rect(0, 0, PW, PH, bg)]
    p.append(rect(0, 0, PW, 46, '#E4DED2'))
    for i, c in enumerate(['#E5484D', '#E8A33D', '#3FA66A']):
        p.append(circle(26 + i * 20, 23, 6, c))
    p.append(rect(110, 11, PW - 200, 24, SAND, r=12))
    p.append(txt(128, 27, url, 12, '#6B6155', mono=True))
    return p


def proj_scratch():
    """Scratch bitirme projesi — uzay savaşı oyunu"""
    p = [rect(0, 0, PW, PH, '#0B1220')]
    for i in range(70):
        p.append(circle((i * 137) % PW, (i * 89) % PH, 1.4 + (i % 3) * 0.6, '#fff',
                        op=0.3 + (i % 4) * 0.15))
    p.append(f'<path d="M500,560 l30,60 h-60 z" fill="{BRICK}"/>')
    p.append(f'<path d="M500,566 l16,34 h-32 z" fill="#FFC01E"/>')
    p.append(circle(500, 628, 11, '#FF8C1A', op=0.7))
    p.append(circle(500, 642, 6, '#FFD24A', op=0.45))
    for my in [470, 410, 350]:
        p.append(rect(497, my, 6, 20, '#FFD24A', r=3))
    for r_ in range(2):
        for c_ in range(6):
            ex, ey = 180 + c_ * 128, 150 + r_ * 90
            p.append(rect(ex - 26, ey - 14, 52, 28, '#5CB1D6', r=6))
            p.append(circle(ex - 12, ey, 5, '#0B1220'))
            p.append(circle(ex + 12, ey, 5, '#0B1220'))
            p.append(rect(ex - 8, ey + 14, 16, 6, '#3F8CB0', r=2))
    p.append(circle(692, 240, 27, '#FF8C1A', op=0.45))
    p.append(circle(692, 240, 15, '#FFD24A', op=0.9))
    p.append(txt(34, 52, 'PUAN', 14, '#6FA8DC', '700'))
    p.append(txt(34, 90, '2.480', 34, '#fff', '700'))
    p.append(txt(PW - 34, 52, 'CAN', 14, '#6FA8DC', '700', anchor='end'))
    for i in range(3):
        col = '#E5484D' if i < 2 else '#39394A'
        bx = PW - 44 - i * 40
        p.append(f'<path d="M{bx},70 a11,11 0 0 1 22,0 a11,11 0 0 1 22,0 '
                 f'q0,17 -22,32 q-22,-15 -22,-32 z" fill="{col}"/>')
    p.append(rect(0, PH - 54, PW, 54, '#0B1220', op=0.85))
    p.append(txt(PW / 2, PH - 20, 'Ok tuşları: hareket   ·   Boşluk: ateş', 15, '#8FA8C8',
                 anchor='middle'))
    return pwrap(p)


def proj_arduino():
    """Arduino bitirme projesi — otomatik sulama sistemi"""
    p = [rect(0, 0, PW, PH, '#141820')]
    p.append(rect(0, 0, PW, 54, '#0E1116'))
    p.append(circle(30, 27, 6, GREEN))
    p.append(txt(50, 32, 'Otomatik Sulama Sistemi — çalışır durumda', 15, TXT, '600'))
    p.append(rect(0, 470, PW, PH - 470, '#2A2620'))
    p.append(rect(0, 470, PW, 6, '#3A342B'))

    p.append('<path d="M300,470 l24,-140 h132 l24,140 z" fill="#A8542F"/>')
    p.append(rect(296, 316, 192, 22, '#C2653A', r=4))
    p.append(rect(316, 336, 152, 26, '#4A3B2A'))
    for sx, h in [(360, 120), (392, 160), (424, 130)]:
        p.append(f'<path d="M{sx},336 q4,-{h * 0.6:.0f} 0,-{h}" stroke="#3E7D4A" '
                 f'stroke-width="6" fill="none"/>')
        y1 = 336 - h * 0.55
        y2 = 336 - h * 0.78
        p.append(f'<ellipse cx="{sx - 16}" cy="{y1:.0f}" rx="20" ry="10" fill="#4E9A5C" '
                 f'transform="rotate(-28 {sx - 16} {y1:.0f})"/>')
        p.append(f'<ellipse cx="{sx + 16}" cy="{y2:.0f}" rx="20" ry="10" fill="#57A866" '
                 f'transform="rotate(24 {sx + 16} {y2:.0f})"/>')

    p.append(rect(430, 352, 12, 70, '#B0B0B0', r=2))
    p.append('<path d="M436,352 L560,300" stroke="#2F6FB5" stroke-width="4" fill="none"/>')
    for dy in [248, 284, 320]:
        p.append(f'<path d="M470,{dy} q8,11 0,17 q-8,-6 0,-17 z" fill="#5CB1D6" opacity="0.9"/>')
    p.append(rect(440, 198, 64, 42, '#3A4453', r=6))
    p.append(txt(472, 224, 'pompa', 11, TXT, anchor='middle'))

    p.append(rect(600, 300, 300, 170, '#0E6B70', r=8))
    p.append(txt(624, 336, 'ARDUINO UNO', 14, '#7FD4D8', '700'))
    p.append(rect(624, 352, 252, 96, '#0A5458', r=4))
    p.append(rect(636, 364, 228, 72, '#1E5F3A', r=3))
    p.append(txt(650, 394, 'Nem: %28', 18, '#7FE39A', mono=True, weight='600'))
    p.append(txt(650, 422, 'SULAMA ACIK', 18, '#FFD24A', mono=True, weight='600'))
    p.append(circle(878, 318, 6, GREEN))
    p.append('<path d="M600,340 C560,340 540,300 504,300" stroke="#D94A3D" '
             'stroke-width="4" fill="none"/>')
    p.append('<path d="M600,382 C570,382 572,320 560,300" stroke="#2F6FB5" '
             'stroke-width="4" fill="none"/>')
    p.append(txt(436, 448, 'nem sensörü', 11, DIM, anchor='middle'))
    p.append(txt(750, 496, 'Arduino UNO + LCD ekran', 11, DIM, anchor='middle'))
    return pwrap(p)


def proj_web():
    """Web bitirme projesi — yayında olan portfolyo sitesi"""
    p = browser_chrome('deniz-portfolyo.netlify.app')
    p.append(rect(0, 46, PW, 76, SAND))
    p.append(txt(48, 98, 'deniz.', 26, INK, '700'))
    for i, n in enumerate(['Hakkımda', 'Projeler', 'İletişim']):
        p.append(txt(PW - 340 + i * 110, 94, n, 14, '#525E72'))
    p.append(f'<line x1="0" y1="122" x2="{PW}" y2="122" stroke="#DFD6C6" stroke-width="1"/>')
    p.append(txt(48, 208, 'Merhaba, ben Deniz.', 44, INK, '700'))
    p.append(txt(48, 260, '13 yaşındayım, oyun yapıyorum.', 44, INK, '700'))
    p.append(rect(48, 274, 300, 5, BRICK))
    p.append(txt(48, 320, 'Scratch ile başladım, şimdi Python öğreniyorum.', 17, '#525E72'))
    p.append(rect(48, 348, 172, 46, BRICK, r=4))
    p.append(txt(134, 377, 'Projelerimi gör', 14, '#fff', '600', anchor='middle'))
    p.append(rect(236, 348, 140, 46, 'none', r=4, stroke='#C9BFAE', sw=1.5))
    p.append(txt(306, 377, 'CV indir', 14, INK, '600', anchor='middle'))
    p.append(f'<line x1="48" y1="442" x2="{PW - 48}" y2="442" stroke="#DFD6C6" stroke-width="1"/>')
    p.append(txt(48, 482, 'SEÇİLMİŞ İŞLER', 12, '#8B7F70', '700'))
    for i, (t, tag) in enumerate([('Uzay Savaşı', 'Scratch'), ('Kelime Oyunu', 'Python'),
                                  ('Hava Durumu', 'JavaScript')]):
        cx = 48 + i * 306
        p.append(rect(cx, 504, 280, 198, '#FBF9F5', r=6, stroke='#DFD6C6'))
        p.append(rect(cx, 504, 280, 112, '#EDE7DC', r=6))
        p.append(rect(cx + 100, 540, 80, 44, '#DFD6C6', r=4))
        p.append(txt(cx + 18, 650, t, 16, INK, '700'))
        p.append(rect(cx + 18, 664, 74, 22, 'none', r=3, stroke='#C9BFAE'))
        p.append(txt(cx + 55, 679, tag, 10, '#6B6155', anchor='middle'))
    return pwrap(p)


def proj_unity():
    """Unity bitirme projesi — yayınlanmış platform oyunu"""
    p = [rect(0, 0, PW, PH, '#1C2733')]
    p.append(rect(0, 0, PW, 470, '#2E4459'))
    for i, (cy, op) in enumerate([(90, 0.16), (172, 0.11)]):
        for k in range(4):
            cx = 90 + k * 260 + i * 90
            p.append(f'<ellipse cx="{cx}" cy="{cy}" rx="86" ry="30" fill="#fff" opacity="{op}"/>')
    for k in range(5):
        bx = 40 + k * 210
        p.append(f'<path d="M{bx},470 l90,-180 l90,180 z" fill="#38506B" opacity="0.7"/>')
    p.append(rect(0, 590, PW, PH - 590, '#3E5B3A'))
    p.append(rect(0, 590, PW, 12, '#4E7247'))
    for px, py, pw_ in [(150, 480, 170), (420, 400, 150), (680, 470, 190)]:
        p.append(rect(px, py, pw_, 26, '#4E7247', r=4))
        p.append(rect(px, py, pw_, 8, '#5E8A55', r=4))
    p.append(rect(196, 424, 34, 46, BRICK, r=6))
    p.append(circle(213, 408, 18, '#E09E86'))
    p.append(circle(207, 405, 3, INK))
    p.append(circle(219, 405, 3, INK))
    p.append(rect(200, 470, 10, 12, '#2A3444', r=2))
    p.append(rect(216, 470, 10, 12, '#2A3444', r=2))
    for cx in [460, 500, 540]:
        p.append(circle(cx, 358, 12, '#FFC01E'))
        p.append(circle(cx, 358, 6, '#FFD980'))
    p.append(circle(760, 442, 20, '#8C3B4A'))
    p.append(circle(753, 438, 4, '#fff'))
    p.append(circle(767, 438, 4, '#fff'))
    p.append('<path d="M748,452 q12,10 24,0" stroke="#fff" stroke-width="2.5" fill="none"/>')
    p.append(rect(28, 28, 214, 40, '#0E1116', r=6, op=0.62))
    p.append(circle(50, 48, 11, '#FFC01E'))
    p.append(txt(72, 55, '× 12', 19, '#fff', '700'))
    p.append(txt(152, 55, 'Bölüm 2/3', 14, '#C7CCD6'))
    p.append(rect(PW - 242, 28, 214, 40, '#0E1116', r=6, op=0.62))
    p.append(txt(PW - 224, 55, 'Can', 13, '#C7CCD6'))
    p.append(rect(PW - 178, 40, 130, 16, '#3A3A4A', r=8))
    p.append(rect(PW - 178, 40, 86, 16, '#E5484D', r=8))
    p.append(rect(0, PH - 46, PW, 46, '#0E1116', op=0.8))
    p.append(txt(PW / 2, PH - 16, 'itch.io üzerinde yayında · tarayıcıda oynanır', 14,
                 '#8FA8C8', anchor='middle'))
    return pwrap(p)


def proj_ai():
    """Yapay zeka bitirme projesi — bitki türü tanıyan model"""
    p = browser_chrome('colab.research.google.com', bg='#F7F7F8')
    p.append(txt(48, 100, 'Bitki Türü Tanıma', 30, INK, '700'))
    p.append(rect(48, 112, 220, 4, BRICK))
    p.append(txt(48, 150, '400 fotoğrafla eğitildi  ·  6 tür  ·  %91 doğruluk', 15, '#525E72'))

    p.append(rect(48, 186, 300, 300, '#E8EDE6', r=8, stroke='#D6DCD3'))
    p.append('<path d="M198,430 q6,-110 0,-170" stroke="#3E7D4A" stroke-width="9" fill="none"/>')
    for a, cy, dx in [(-28, 300, -18), (26, 268, 18), (-22, 236, -18)]:
        p.append(f'<ellipse cx="{198 + dx}" cy="{cy}" rx="46" ry="21" fill="#4E9A5C" '
                 f'transform="rotate({a} {198 + dx} {cy})"/>')
    for k in range(6):
        p.append(f'<ellipse cx="198" cy="222" rx="27" ry="12" fill="#F07898" '
                 f'transform="rotate({k * 60} 198 222)"/>')
    p.append(circle(198, 222, 11, '#FFD24A'))
    p.append(rect(48, 448, 300, 38, '#DDE3DA'))
    p.append(txt(198, 473, 'test_foto_042.jpg', 13, '#4A5A48', mono=True, anchor='middle'))

    p.append(txt(392, 212, 'MODELİN TAHMİNİ', 12, '#8B7F70', '700'))
    for i, (n, v, top) in enumerate([('Gül', 0.94, True), ('Lale', 0.04, False),
                                     ('Papatya', 0.01, False), ('Menekşe', 0.01, False)]):
        y = 250 + i * 62
        p.append(txt(392, y, n, 16, INK if top else '#525E72', '700' if top else '500'))
        p.append(rect(392, y + 12, 480, 20, '#E4E6E3', r=10))
        p.append(rect(392, y + 12, max(10, 480 * v), 20, BRICK if top else '#B9BEB6', r=10))
        p.append(txt(884, y + 27, f'%{v * 100:.0f}', 14, INK if top else '#8B7F70', '700'))

    p.append(rect(392, 512, 480, 82, '#EFEDE8', r=6))
    p.append(txt(410, 540, 'GELİŞTİRME NOTU', 11, BRICK, '700'))
    p.append(txt(410, 564, 'Model yaprakları karıştırıyordu. Fotoğraflar farklı', 13, '#3E4A5E'))
    p.append(txt(410, 584, 'ışıkta yeniden çekilince doğruluk %78’den %91’e çıktı.', 13, '#3E4A5E'))
    return pwrap(p)


def proj_python():
    """Python bitirme projesi — kelime ezberleme uygulaması"""
    p = [rect(0, 0, PW, PH, '#141820')]
    p.append(rect(0, 0, PW, 46, '#232830'))
    for i, c in enumerate(['#E5484D', '#E8A33D', '#3FA66A']):
        p.append(circle(26 + i * 20, 23, 6, c))
    p.append(txt(PW / 2, 28, 'kelime_oyunu.py', 13, DIM, anchor='middle'))
    lines = [
        ('$ python kelime_oyunu.py', GREEN),
        ('', TXT),
        ('=== KELİME EZBERLEME OYUNU ===', '#FFD24A'),
        ('Toplam 24 kelime · 5 soru sorulacak', DIM),
        ('', TXT),
        ('1) "book" ne demek? > kitap', TXT),
        ('   Doğru!', GREEN),
        ('', TXT),
        ('2) "window" ne demek? > kapı', TXT),
        ('   Yanlış. Doğrusu: pencere', '#E5484D'),
        ('   Bu kelime tekrar sorulacak.', '#E8A33D'),
        ('', TXT),
        ('3) "house" ne demek? > ev', TXT),
        ('   Doğru!', GREEN),
        ('', TXT),
        ('4) "window" ne demek? > pencere', TXT),
        ('   Doğru! Artık biliyorsun.', GREEN),
        ('', TXT),
        ('--- SONUÇ ---', '#FFD24A'),
        ('Skor: 3 / 4    En iyi skorun: 5 / 5', TXT),
        ('Skorlar skorlar.txt dosyasına kaydedildi.', DIM),
    ]
    for i, (line, c) in enumerate(lines):
        p.append(txt(48, 96 + i * 30, line, 17, c, mono=True))
    p.append(rect(48, 96 + len(lines) * 30 - 18, 12, 22, TXT, op=0.7))
    return pwrap(p)


PROJECTS_ART = {
    'proje-uzay-savasi': proj_scratch,
    'proje-sulama': proj_arduino,
    'proje-portfolyo': proj_web,
    'proje-platform-oyunu': proj_unity,
    'proje-bitki-tanima': proj_ai,
    'proje-kelime-oyunu': proj_python,
}

if __name__ == '__main__':
    for name, fn in PROJECTS_ART.items():
        path = f'{OUT}/{name}.svg'
        io.open(path, 'w', encoding='utf-8').write(fn())
        print(f'{path}  {os.path.getsize(path) // 1024} KB')
