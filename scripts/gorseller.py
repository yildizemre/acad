# -*- coding: utf-8 -*-
"""
Kurs ve proje görsellerini üretir.

Stok fotoğraf yerine, her kursun gerçekten neye benzediğini gösteren
canlı ders ekranı görüntüleri çizer: bir görüntülü görüşme penceresi ve
içinde o kursta kullanılan programın ekranı.

Çalıştırmak için:   python scripts/gorseller.py
Çıktı:              public/images/kurs-*.svg ve public/images/proje-*.svg

SVG olarak üretiliyor çünkü her ölçekte net kalıyor ve dosyalar birkaç KB.
"""
import io
import os

OUT = 'public/images'
os.makedirs(OUT, exist_ok=True)

# ─── Renkler ────────────────────────────────────────────────────────────────
INK = '#0E2038'
BRICK = '#B8432B'
SAND = '#F5F1EA'

CHROME = '#15171C'      # görüşme penceresi gövdesi
PANEL = '#20242C'       # yan paneller
PANEL2 = '#2A2F39'
EDGE = '#333945'
TXT = '#C7CCD6'
DIM = '#7C8493'
GREEN = '#3FA66A'

W, H = 1200, 800


def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def txt(x, y, s, size=15, fill=TXT, weight='400', mono=False, anchor='start', op=1.0):
    fam = "'JetBrains Mono',ui-monospace,monospace" if mono else "Inter,system-ui,sans-serif"
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" fill="{fill}" '
            f'font-weight="{weight}" text-anchor="{anchor}" opacity="{op}">{esc(s)}</text>')


def rect(x, y, w, h, fill, r=0, stroke=None, sw=1, op=1.0):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"{st} opacity="{op}"/>'


def circle(cx, cy, r, fill, stroke=None, sw=2, op=1.0):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{st} opacity="{op}"/>'


# ─── Görüşme penceresi çerçevesi ────────────────────────────────────────────
SHARE_X, SHARE_Y = 18, 60
SHARE_W, SHARE_H = 940, 660


def meeting_frame(title, participants):
    """Ekran paylaşımı yapılan bir canlı ders penceresi çizer."""
    p = [rect(0, 0, W, H, CHROME)]

    # Üst şerit
    p.append(rect(0, 0, W, 44, '#101216'))
    p.append(circle(24, 22, 5, '#E5484D'))
    p.append(txt(38, 27, 'Kayıtta', 13, '#E5484D', '600'))
    p.append(txt(100, 27, title, 13, TXT, '500'))
    p.append(txt(W - 22, 27, 'Canlı ders · 60 dk', 12, DIM, anchor='end'))

    # Katılımcı kutucukları (sağ sütun)
    px, pw, ph = 978, 204, 128
    for i, (name, initials, speaking) in enumerate(participants):
        y = 60 + i * (ph + 12)
        border = GREEN if speaking else EDGE
        p.append(rect(px, y, pw, ph, PANEL, r=8, stroke=border, sw=2 if speaking else 1))
        p.append(circle(px + pw / 2, y + 52, 26, PANEL2))
        p.append(txt(px + pw / 2, y + 59, initials, 17, TXT, '600', anchor='middle'))
        p.append(txt(px + 12, y + ph - 14, name, 12, TXT if speaking else DIM, '500'))
        if speaking:
            for k in range(3):
                p.append(rect(px + pw - 34 + k * 8, y + ph - 26 + (k % 2) * 4, 4,
                              12 - (k % 2) * 5, GREEN, r=2))

    # Alt kontrol şeridi
    p.append(rect(0, H - 52, W, 52, '#101216'))
    for i, lbl in enumerate(['Mikrofon', 'Kamera', 'Ekran', 'Sohbet']):
        cx = 60 + i * 92
        p.append(circle(cx, H - 26, 15, PANEL2))
        p.append(txt(cx, H - 6, lbl, 9, DIM, anchor='middle'))
    p.append(rect(W - 108, H - 40, 84, 28, '#C0362F', r=6))
    p.append(txt(W - 66, H - 21, 'Ayrıl', 12, '#fff', '600', anchor='middle'))

    return p


def wrap(body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'width="{W}" height="{H}" role="img">' + ''.join(body) + '</svg>')


def app_window(title, tabs=None):
    """Paylaşılan ekranın uygulama çerçevesi."""
    p = [rect(SHARE_X, SHARE_Y, SHARE_W, SHARE_H, '#1B1F26', r=8, stroke=EDGE)]
    p.append(rect(SHARE_X, SHARE_Y, SHARE_W, 34, '#232830', r=8))
    p.append(rect(SHARE_X, SHARE_Y + 26, SHARE_W, 8, '#232830'))
    for i, c in enumerate(['#E5484D', '#E8A33D', '#3FA66A']):
        p.append(circle(SHARE_X + 20 + i * 18, SHARE_Y + 17, 5, c))
    p.append(txt(SHARE_X + 84, SHARE_Y + 22, title, 12, DIM, '500'))
    if tabs:
        for i, t in enumerate(tabs):
            x = SHARE_X + 300 + i * 108
            p.append(rect(x, SHARE_Y + 6, 100, 22, '#1B1F26' if i == 0 else 'none', r=4))
            p.append(txt(x + 50, SHARE_Y + 21, t, 11, TXT if i == 0 else DIM, anchor='middle'))
    return p


def code_lines(x, y, lines, lh=23, size=14):
    """[(girinti, [(metin, renk), ...]), ...] biçiminde kod satırları."""
    p = []
    for i, (indent, parts) in enumerate(lines):
        yy = y + i * lh
        p.append(txt(x - 14, yy, str(i + 1), 11, '#4A5261', mono=True, anchor='end'))
        cx = x + indent * 16
        for s, col in parts:
            p.append(txt(cx, yy, s, size, col, mono=True))
            cx += len(s) * size * 0.6
    return p


# ─── Kurs görselleri ────────────────────────────────────────────────────────

def scratch():
    p = meeting_frame('Scratch ile Oyun Geliştirme · 3. Hafta: Döngüler',
                      [('Elif — Eğitmen', 'EÖ', True), ('Öğrenci', 'AK', False),
                       ('Öğrenci', 'MY', False), ('Öğrenci', 'ZT', False),
                       ('Öğrenci', 'BD', False)])
    p += app_window('Scratch 3.0 — uzay-savasi.sb3', ['Kod', 'Kılıklar', 'Sesler'])
    x0, y0 = SHARE_X + 16, SHARE_Y + 50

    # Sol: blok paleti
    p.append(rect(x0, y0, 108, 594, '#232830', r=6))
    cats = [('Hareket', '#4C97FF'), ('Görünüm', '#9966FF'), ('Ses', '#CF63CF'),
            ('Olaylar', '#FFBF00'), ('Kontrol', '#FFAB19'), ('Algılama', '#5CB1D6'),
            ('İşlemler', '#59C059'), ('Değişken', '#FF8C1A')]
    for i, (n, c) in enumerate(cats):
        p.append(circle(x0 + 20, y0 + 26 + i * 40, 8, c))
        p.append(txt(x0 + 36, y0 + 31 + i * 40, n, 11, TXT))

    # Orta: birleştirilmiş bloklar
    bx, by = x0 + 124, y0 + 10
    blocks = [('şapka', 'yeşil bayrağa tıklanınca', '#FFBF00', 0),
              ('', 'sürekli tekrarla', '#FFAB19', 0),
              ('', '10 adım git', '#4C97FF', 1),
              ('', 'kenara gelince sek', '#4C97FF', 1),
              ('', 'eğer <duvara değdi> ise', '#FFAB19', 1),
              ('', 'can değişkenini -1 değiştir', '#FF8C1A', 2),
              ('', '"Kaybettin!" de', '#9966FF', 2)]
    for i, (kind, label, col, ind) in enumerate(blocks):
        y = by + i * 44
        x = bx + ind * 22
        w = 300 - ind * 22
        if kind == 'şapka':
            p.append(f'<path d="M{x},{y+14} q0,-14 16,-14 h{w-32} q16,0 16,14 v26 '
                     f'a8,8 0 0 1 -8,8 h-{w-16} a8,8 0 0 1 -8,-8 z" fill="{col}"/>')
        else:
            p.append(rect(x, y, w, 34, col, r=6))
            p.append(rect(x + 16, y + 34, 18, 5, col, r=2))
        p.append(txt(x + 14, y + 23, label, 12, '#fff', '600'))

    # Sağ: sahne
    sx, sy = x0 + 470, y0
    p.append(rect(sx, sy, 420, 316, '#0B1220', r=6, stroke=EDGE))
    for i in range(28):
        p.append(circle(sx + 17 + (i * 53) % 400, sy + 25 + (i * 91) % 280, 1.6, '#fff', op=0.65))
    p.append(f'<path d="M{sx+200},{sy+180} l22,44 h-44 z" fill="{BRICK}"/>')
    p.append(circle(sx + 200, sy + 196, 7, '#FFBF00'))
    for i, ex in enumerate([90, 200, 310]):
        p.append(rect(sx + ex - 16, sy + 58, 32, 20, '#5CB1D6', r=4))
    p.append(txt(sx + 14, sy + 26, 'Puan: 240', 14, '#fff', '700'))
    p.append(txt(sx + 340, sy + 26, 'Can: 3', 14, '#fff', '700'))

    # Sağ alt: ödev notu
    p.append(rect(sx, sy + 332, 420, 262, '#232830', r=6))
    p.append(txt(sx + 16, sy + 358, 'Bu haftanın görevi', 13, BRICK, '700'))
    for i, l in enumerate(['Kalem bloklarıyla kar tanesi çiz',
                           'İç içe döngü kullan',
                           'Her kolda 3 dal olsun',
                           'Rengi her turda değiştir']):
        p.append(circle(sx + 22, sy + 386 + i * 30, 3.5, GREEN))
        p.append(txt(sx + 36, sy + 391 + i * 30, l, 12, TXT))
    return wrap(p)


def python_c():
    p = meeting_frame('Python Programlama · 5. Hafta: Listeler ve Sözlükler',
                      [('Ahmet — Eğitmen', 'AK', True), ('Öğrenci', 'SY', False),
                       ('Öğrenci', 'KA', False), ('Öğrenci', 'EM', False),
                       ('Öğrenci', 'TB', False)])
    p += app_window('Visual Studio Code — sozluk_oyunu.py')
    x0, y0 = SHARE_X + 60, SHARE_Y + 74

    K, S, N, F, C, D = '#C586C0', '#CE9178', '#B5CEA8', '#DCDCAA', '#6A9955', TXT
    lines = [
        (0, [('# Kelime ezberleme oyunu', C)]),
        (0, [('import ', K), ('random', D)]),
        (0, []),
        (0, [('kelimeler = {', D)]),
        (1, [('"apple"', S), (': ', D), ('"elma"', S), (',', D)]),
        (1, [('"book"', S), (': ', D), ('"kitap"', S), (',', D)]),
        (1, [('"house"', S), (': ', D), ('"ev"', S), (',', D)]),
        (0, [('}', D)]),
        (0, []),
        (0, [('def ', K), ('soru_sor', F), ('(sozluk):', D)]),
        (1, [('kelime = random.choice(', D), ('list', F), ('(sozluk))', D)]),
        (1, [('cevap = ', D), ('input', F), ('(f"', S), ('{kelime}', N), (' ne demek? "', S), (')', D)]),
        (1, [('return ', K), ('cevap == sozluk[kelime]', D)]),
        (0, []),
        (0, [('skor = ', D), ('0', N)]),
        (0, [('for ', K), ('i ', D), ('in ', K), ('range', F), ('(', D), ('5', N), ('):', D)]),
        (1, [('if ', K), ('soru_sor(kelimeler):', D)]),
        (2, [('skor += ', D), ('1', N)]),
        (2, [('print', F), ('("Doğru!")', S)]),
    ]
    p += code_lines(x0, y0, lines)

    # Terminal
    ty = SHARE_Y + 520
    p.append(rect(SHARE_X + 16, ty, SHARE_W - 32, 194, '#141820', r=6, stroke=EDGE))
    p.append(txt(SHARE_X + 32, ty + 24, 'TERMİNAL', 11, DIM, '700'))
    out = [('$ python sozluk_oyunu.py', GREEN),
           ('book ne demek? kitap', TXT),
           ('Doğru!', GREEN),
           ('house ne demek? ev', TXT),
           ('Doğru!', GREEN),
           ('Skor: 2 / 2', '#E8A33D')]
    for i, (l, c) in enumerate(out):
        p.append(txt(SHARE_X + 32, ty + 52 + i * 23, l, 13, c, mono=True))
    return wrap(p)


def web():
    p = meeting_frame('Web Tasarım & Geliştirme · 9. Hafta: Yayınlama',
                      [('Zeynep — Eğitmen', 'ZT', True), ('Öğrenci', 'DA', False),
                       ('Öğrenci', 'CS', False), ('Öğrenci', 'NK', False),
                       ('Öğrenci', 'İY', False)])
    p += app_window('VS Code + Tarayıcı — portfolyo')
    K, S, T, D, C = '#C586C0', '#CE9178', '#4EC9B0', TXT, '#6A9955'

    # Sol: kod
    p.append(rect(SHARE_X + 16, SHARE_Y + 50, 448, 594, '#171B22', r=6))
    lines = [
        (0, [('<', D), ('section', T), (' class=', D), ('"hero"', S), ('>', D)]),
        (1, [('<', D), ('h1', T), ('>Merhaba, ben Deniz</', D), ('h1', T), ('>', D)]),
        (1, [('<', D), ('p', T), ('>13 yaşındayım ve', D)]),
        (2, [('oyun yapıyorum.</', D), ('p', T), ('>', D)]),
        (1, [('<', D), ('a', T), (' href=', D), ('"#işler"', S), ('>', D)]),
        (2, [('Projelerim</', D), ('a', T), ('>', D)]),
        (0, [('</', D), ('section', T), ('>', D)]),
        (0, []),
        (0, [('/* mobil uyum */', C)]),
        (0, [('@media', K), (' (max-width: 768px) {', D)]),
        (1, [('.hero h1 { font-size: ', D), ('2rem', S), ('; }', D)]),
        (1, [('.grid { grid-template-columns:', D)]),
        (2, [('1fr', S), ('; }', D)]),
        (0, [('}', D)]),
    ]
    p += code_lines(SHARE_X + 74, SHARE_Y + 84, lines, lh=26)

    # Sağ: tarayıcı önizlemesi
    bx, by = SHARE_X + 480, SHARE_Y + 50
    p.append(rect(bx, by, 462, 594, SAND, r=6, stroke=EDGE))
    p.append(rect(bx, by, 462, 34, '#E4DED2', r=6))
    p.append(rect(bx, by + 26, 462, 8, '#E4DED2'))
    p.append(rect(bx + 60, by + 8, 330, 18, SAND, r=9))
    p.append(txt(bx + 74, by + 21, 'deniz-portfolyo.netlify.app', 10, '#6B6155', mono=True))
    p.append(circle(bx + 20, by + 17, 4, '#C9BFAE'))
    p.append(circle(bx + 34, by + 17, 4, '#C9BFAE'))

    p.append(txt(bx + 28, by + 96, 'Merhaba,', 30, INK, '700'))
    p.append(txt(bx + 28, by + 132, 'ben Deniz', 30, INK, '700'))
    p.append(rect(bx + 28, by + 142, 148, 4, BRICK))
    p.append(txt(bx + 28, by + 176, '13 yaşındayım ve oyun yapıyorum.', 13, '#525E72'))
    p.append(rect(bx + 28, by + 196, 116, 34, BRICK, r=4))
    p.append(txt(bx + 86, by + 218, 'Projelerim', 12, '#fff', '600', anchor='middle'))
    for r_ in range(2):
        for c_ in range(2):
            gx, gy = bx + 28 + c_ * 208, by + 262 + r_ * 152
            p.append(rect(gx, gy, 190, 134, '#EDE7DC', r=4, stroke='#DFD6C6'))
            p.append(rect(gx, gy, 190, 84, '#DFD6C6', r=4))
            p.append(txt(gx + 12, gy + 108, ['Uzay Oyunu', 'Hesap Makinesi',
                                             'Quiz Uygulaması', 'Hava Durumu'][r_ * 2 + c_],
                         12, INK, '600'))
    return wrap(p)


def unity():
    p = meeting_frame('Unity ile Oyun Geliştirme · 7. Hafta: Yapay Zeka Düşmanlar',
                      [('Burak — Eğitmen', 'BD', True), ('Öğrenci', 'ET', False),
                       ('Öğrenci', 'MK', False), ('Öğrenci', 'AS', False)])
    p += app_window('Unity 6 — PlatformOyunu.unity')
    y0 = SHARE_Y + 50

    # Araç çubuğu
    p.append(rect(SHARE_X + 16, y0, SHARE_W - 32, 34, '#282C34', r=4))
    for i, t in enumerate(['El', 'Taşı', 'Döndür', 'Ölçek']):
        p.append(rect(SHARE_X + 26 + i * 46, y0 + 6, 40, 22, PANEL2 if i == 1 else 'none', r=3))
        p.append(txt(SHARE_X + 46 + i * 46, y0 + 21, t, 10, TXT, anchor='middle'))
    for i, s in enumerate(['▶', '⏸', '⏭']):
        p.append(circle(SHARE_X + 460 + i * 34, y0 + 17, 12, PANEL2))
        p.append(txt(SHARE_X + 460 + i * 34, y0 + 22, s, 11, TXT, anchor='middle'))

    # Sol: hiyerarşi
    hx, hy = SHARE_X + 16, y0 + 42
    p.append(rect(hx, hy, 190, 552, PANEL, r=4))
    p.append(txt(hx + 12, hy + 22, 'Hierarchy', 11, DIM, '700'))
    items = [(0, 'SampleScene'), (1, 'Main Camera'), (1, 'Directional Light'),
             (1, 'Player'), (2, 'Sprite'), (2, 'Collider'), (1, 'Enemies'),
             (2, 'Enemy_01'), (2, 'Enemy_02'), (2, 'Enemy_03'), (1, 'Tilemap'),
             (1, 'Canvas'), (2, 'ScoreText'), (2, 'HealthBar')]
    for i, (ind, n) in enumerate(items):
        yy = hy + 48 + i * 27
        if n == 'Enemy_02':
            p.append(rect(hx + 4, yy - 14, 182, 22, '#2F5D8C', r=3))
        p.append(txt(hx + 14 + ind * 14, yy, n, 11, TXT if ind < 2 else DIM))

    # Orta: sahne
    vx, vy = SHARE_X + 214, y0 + 42
    vw, vh = 494, 552
    p.append(rect(vx, vy, vw, vh, '#2B3A4A', r=4))
    for i in range(1, 14):
        p.append(f'<line x1="{vx}" y1="{vy+i*40}" x2="{vx+vw}" y2="{vy+i*40}" stroke="#3A4A5C" stroke-width="1"/>')
        p.append(f'<line x1="{vx+i*40}" y1="{vy}" x2="{vx+i*40}" y2="{vy+vh}" stroke="#3A4A5C" stroke-width="1"/>')
    p.append(rect(vx + 20, vy + 440, vw - 40, 60, '#4A6741', r=3))
    p.append(rect(vx + 150, vy + 340, 120, 20, '#5A7A4F', r=3))
    p.append(rect(vx + 320, vy + 260, 120, 20, '#5A7A4F', r=3))
    p.append(rect(vx + 60, vy + 384, 26, 40, BRICK, r=4))
    p.append(circle(vx + 73, vy + 376, 12, '#E09E86'))
    for ex, ey in [(240, 300), (380, 220), (420, 400)]:
        p.append(circle(vx + ex, vy + ey, 15, '#8C3B4A'))
        p.append(circle(vx + ex - 5, vy + ey - 3, 3, '#fff'))
        p.append(circle(vx + ex + 5, vy + ey - 3, 3, '#fff'))
    p.append(f'<path d="M{vx+240},{vy+300} L{vx+86},{vy+404}" stroke="{GREEN}" '
             f'stroke-width="2" stroke-dasharray="6 5" fill="none"/>')
    p.append(txt(vx + 12, vy + 24, 'Scene', 11, TXT, '600'))
    p.append(txt(vx + vw - 12, vy + 24, 'NavMesh: aktif', 10, GREEN, anchor='end'))

    # Sağ: inspector
    ix = SHARE_X + 716
    p.append(rect(ix, vy, 226, 552, PANEL, r=4))
    p.append(txt(ix + 12, vy + 22, 'Inspector — Enemy_02', 11, DIM, '700'))
    fields = [('Speed', '3.5'), ('Detect Range', '8.0'), ('Attack Range', '1.5'),
              ('Health', '30'), ('Damage', '10'), ('Patrol', 'true')]
    for i, (k, v) in enumerate(fields):
        yy = vy + 62 + i * 42
        p.append(txt(ix + 14, yy, k, 11, DIM))
        p.append(rect(ix + 118, yy - 14, 94, 22, '#171B22', r=3, stroke=EDGE))
        p.append(txt(ix + 128, yy + 1, v, 11, TXT, mono=True))
    p.append(rect(ix + 14, vy + 330, 198, 84, '#171B22', r=4, stroke=EDGE))
    p.append(txt(ix + 24, vy + 354, 'EnemyAI.cs', 11, '#4EC9B0', mono=True))
    p.append(txt(ix + 24, vy + 376, 'if (dist < range)', 10, TXT, mono=True))
    p.append(txt(ix + 24, vy + 396, '  Chase(player);', 10, TXT, mono=True))
    return wrap(p)


def ai():
    p = meeting_frame('Yapay Zeka & ML · 5. Hafta: Model Değerlendirme',
                      [('Can — Eğitmen', 'CM', True), ('Öğrenci', 'ZK', False),
                       ('Öğrenci', 'AT', False), ('Öğrenci', 'BY', False)])
    p += app_window('Google Colab — bitki_siniflandirma.ipynb')
    x0, y0 = SHARE_X + 16, SHARE_Y + 50
    K, S, F, C, D, N = '#C586C0', '#CE9178', '#DCDCAA', '#6A9955', TXT, '#B5CEA8'

    # Kod hücresi
    p.append(rect(x0, y0, SHARE_W - 32, 176, '#1E222A', r=6, stroke=EDGE))
    p.append(txt(x0 + 14, y0 + 24, '[7]', 11, DIM, mono=True))
    lines = [
        (0, [('from ', K), ('sklearn.metrics ', D), ('import ', K), ('confusion_matrix', D)]),
        (0, [('tahmin = model.', D), ('predict', F), ('(X_test)', D)]),
        (0, [('dogruluk = (tahmin == y_test).', D), ('mean', F), ('()', D)]),
        (0, [('print', F), ('(f"Doğruluk: ', S), ('{dogruluk:.2%}', N), ('")', S)]),
    ]
    p += code_lines(x0 + 62, y0 + 52, lines, lh=26, size=13)

    # Çıktı
    oy = y0 + 190
    p.append(rect(x0, oy, SHARE_W - 32, 60, '#171B22', r=6))
    p.append(txt(x0 + 62, oy + 36, 'Doğruluk: 91.40%', 15, GREEN, mono=True, weight='600'))

    # Grafikler
    gy = oy + 74
    p.append(rect(x0, gy, SHARE_W - 32, 320, SAND, r=6))

    # Sol: karışıklık matrisi
    p.append(txt(x0 + 30, gy + 32, 'Karışıklık Matrisi', 13, INK, '700'))
    labels = ['Gül', 'Papatya', 'Lale']
    vals = [[42, 3, 1], [2, 38, 4], [1, 2, 45]]
    cell = 52
    for r_ in range(3):
        p.append(txt(x0 + 74, gy + 84 + r_ * cell + 6, labels[r_], 11, '#525E72', anchor='end'))
        p.append(txt(x0 + 104 + r_ * cell + cell / 2, gy + 62, labels[r_], 11, '#525E72', anchor='middle'))
        for c_ in range(3):
            v = vals[r_][c_]
            op = 0.15 + 0.85 * (v / 45)
            p.append(rect(x0 + 104 + c_ * cell, gy + 70 + r_ * cell, cell - 4, cell - 4,
                          INK, r=3, op=op))
            p.append(txt(x0 + 104 + c_ * cell + cell / 2 - 2, gy + 70 + r_ * cell + cell / 2 + 2,
                         str(v), 13, '#fff' if op > 0.5 else INK, '700', anchor='middle'))

    # Sağ: eğitim eğrisi
    cx0, cy0, cw, ch = x0 + 400, gy + 70, 380, 190
    p.append(txt(cx0, gy + 32, 'Eğitim ilerlemesi', 13, INK, '700'))
    p.append(f'<line x1="{cx0}" y1="{cy0+ch}" x2="{cx0+cw}" y2="{cy0+ch}" stroke="#C9BFAE" stroke-width="1.5"/>')
    p.append(f'<line x1="{cx0}" y1="{cy0}" x2="{cx0}" y2="{cy0+ch}" stroke="#C9BFAE" stroke-width="1.5"/>')
    tr = [0.42, 0.61, 0.72, 0.79, 0.84, 0.87, 0.89, 0.91]
    va = [0.38, 0.56, 0.68, 0.74, 0.80, 0.83, 0.86, 0.87]
    def path(vs, col):
        pts = ' '.join(f'{cx0 + i*(cw/(len(vs)-1)):.0f},{cy0+ch - v*ch:.0f}' for i, v in enumerate(vs))
        return f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="2.5" stroke-linejoin="round"/>'
    p.append(path(tr, INK))
    p.append(path(va, BRICK))
    p.append(rect(cx0 + cw - 116, cy0 + 6, 12, 3, INK))
    p.append(txt(cx0 + cw - 98, cy0 + 12, 'eğitim', 10, '#525E72'))
    p.append(rect(cx0 + cw - 116, cy0 + 26, 12, 3, BRICK))
    p.append(txt(cx0 + cw - 98, cy0 + 32, 'doğrulama', 10, '#525E72'))
    p.append(txt(cx0 - 6, cy0 + ch + 20, '1', 10, '#8B7F70', anchor='middle'))
    p.append(txt(cx0 + cw, cy0 + ch + 20, '8. tur', 10, '#8B7F70', anchor='middle'))
    return wrap(p)


def arduino():
    p = meeting_frame('Arduino & Robotik · 3. Hafta: Sensörler',
                      [('Elif — Eğitmen', 'ES', True), ('Öğrenci', 'OK', False),
                       ('Öğrenci', 'RD', False), ('Öğrenci', 'HN', False),
                       ('Öğrenci', 'SA', False)])
    p += app_window('Arduino IDE — gece_lambasi.ino')
    K, F, C, D, N, S = '#C586C0', '#DCDCAA', '#6A9955', TXT, '#B5CEA8', '#CE9178'

    # Sol: kod
    p.append(rect(SHARE_X + 16, SHARE_Y + 50, 430, 460, '#171B22', r=6))
    lines = [
        (0, [('// Karanlıkta yanan lamba', C)]),
        (0, [('int ', K), ('ldr = ', D), ('A0', N), (';', D)]),
        (0, [('int ', K), ('led = ', D), ('9', N), (';', D)]),
        (0, []),
        (0, [('void ', K), ('setup', F), ('() {', D)]),
        (1, [('pinMode', F), ('(led, ', D), ('OUTPUT', N), (');', D)]),
        (1, [('Serial.', D), ('begin', F), ('(', D), ('9600', N), (');', D)]),
        (0, [('}', D)]),
        (0, []),
        (0, [('void ', K), ('loop', F), ('() {', D)]),
        (1, [('int ', K), ('isik = ', D), ('analogRead', F), ('(ldr);', D)]),
        (1, [('if ', K), ('(isik < ', D), ('300', N), (') {', D)]),
        (2, [('digitalWrite', F), ('(led, ', D), ('HIGH', N), (');', D)]),
        (1, [('} ', D), ('else ', K), ('{', D)]),
        (2, [('digitalWrite', F), ('(led, ', D), ('LOW', N), (');', D)]),
        (1, [('}', D)]),
        (0, [('}', D)]),
    ]
    p += code_lines(SHARE_X + 74, SHARE_Y + 84, lines, lh=25, size=13)

    # Sol alt: seri port
    p.append(rect(SHARE_X + 16, SHARE_Y + 520, 430, 124, '#141820', r=6, stroke=EDGE))
    p.append(txt(SHARE_X + 32, SHARE_Y + 544, 'Seri Port Ekranı', 11, DIM, '700'))
    for i, v in enumerate(['isik = 812  → lamba KAPALI', 'isik = 604  → lamba KAPALI',
                           'isik = 190  → lamba AÇIK']):
        p.append(txt(SHARE_X + 32, SHARE_Y + 572 + i * 22, v, 12,
                     '#E8A33D' if i == 2 else TXT, mono=True))

    # Sağ: devre
    bx, by = SHARE_X + 464, SHARE_Y + 50
    p.append(rect(bx, by, 478, 594, '#1E232B', r=6, stroke=EDGE))
    p.append(txt(bx + 16, by + 26, 'Devre — canlı kamera', 12, DIM, '600'))
    p.append(circle(bx + 452, by + 20, 4, '#E5484D'))

    # Breadboard
    p.append(rect(bx + 30, by + 250, 418, 300, '#D8D2C4', r=6))
    for r_ in range(10):
        for c_ in range(26):
            p.append(circle(bx + 48 + c_ * 15.5, by + 276 + r_ * 26, 2, '#9A9384'))
    p.append(rect(bx + 30, by + 386, 418, 20, '#C4BDAE'))

    # Arduino kartı
    p.append(rect(bx + 40, by + 66, 398, 160, '#0E6B70', r=6))
    p.append(rect(bx + 56, by + 82, 366, 22, '#0A5458', r=3))
    for i in range(18):
        p.append(rect(bx + 60 + i * 20, by + 86, 12, 14, '#1A1A1A', r=2))
    p.append(rect(bx + 56, by + 190, 366, 22, '#0A5458', r=3))
    for i in range(18):
        p.append(rect(bx + 60 + i * 20, by + 194, 12, 14, '#1A1A1A', r=2))
    p.append(rect(bx + 150, by + 122, 100, 52, '#1A1A1A', r=3))
    p.append(txt(bx + 200, by + 152, 'ATmega328', 9, '#8A8A8A', anchor='middle'))
    p.append(txt(bx + 60, by + 152, 'ARDUINO', 13, '#7FD4D8', '700'))
    p.append(txt(bx + 60, by + 170, 'UNO R3', 10, '#5FA8AC'))
    p.append(circle(bx + 400, by + 130, 5, GREEN))
    p.append(txt(bx + 392, by + 156, 'ON', 8, GREEN, anchor='middle'))

    # LED + LDR + kablolar
    p.append(f'<path d="M{bx+110},{by+226} C{bx+110},{by+270} {bx+110},{by+270} {bx+110},{by+302}" '
             f'stroke="#D94A3D" stroke-width="4" fill="none"/>')
    p.append(f'<path d="M{bx+230},{by+226} C{bx+230},{by+270} {bx+300},{by+270} {bx+300},{by+302}" '
             f'stroke="#2F6FB5" stroke-width="4" fill="none"/>')
    p.append(f'<path d="M{bx+330},{by+226} C{bx+330},{by+280} {bx+390},{by+280} {bx+390},{by+302}" '
             f'stroke="#3A3A3A" stroke-width="4" fill="none"/>')
    # yanan LED
    p.append(circle(bx + 110, by + 330, 22, '#FFD24A', op=0.28))
    p.append(circle(bx + 110, by + 330, 13, '#FFC01E'))
    p.append(rect(bx + 104, by + 340, 4, 34, '#B0B0B0'))
    p.append(rect(bx + 116, by + 340, 4, 34, '#B0B0B0'))
    # LDR
    p.append(circle(bx + 300, by + 330, 15, '#E8B478'))
    p.append(f'<path d="M{bx+290},{by+330} l5,-7 l5,7 l5,-7 l5,7" stroke="#7A5A32" '
             f'stroke-width="2" fill="none"/>')
    p.append(txt(bx + 300, by + 372, 'LDR', 10, '#6B6155', anchor='middle'))
    p.append(txt(bx + 110, by + 392, 'LED', 10, '#6B6155', anchor='middle'))
    # direnç
    p.append(rect(bx + 372, by + 320, 36, 14, '#C8A46A', r=3))
    for i, c in enumerate(['#8B4513', '#000', '#CD7F32']):
        p.append(rect(bx + 378 + i * 8, by + 320, 3, 14, c))
    p.append(txt(bx + 390, by + 352, '220Ω', 9, '#6B6155', anchor='middle'))
    return wrap(p)


COURSES = {
    'kurs-scratch': scratch,
    'kurs-python': python_c,
    'kurs-web': web,
    'kurs-unity': unity,
    'kurs-ai': ai,
    'kurs-arduino': arduino,
}

if __name__ == '__main__':
    for name, fn in COURSES.items():
        path = f'{OUT}/{name}.svg'
        io.open(path, 'w', encoding='utf-8').write(fn())
        print(f'{path}  {os.path.getsize(path) // 1024} KB')
