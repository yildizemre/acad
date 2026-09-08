# -*- coding: utf-8 -*-
"""
Öğrenci ekran kayıtlarını web'e uygun hâle getirir.

NEDEN
-----
Ham kayıtlar 9 adet, toplam ~32 MB, 60 saniye ve sesli. Ana sayfada 3x3 ızgara
hâlinde dokuz tanesini birden oynatmak bu hâliyle sayfayı öldürür. Bu betik her
kaydı sessiz, kısa, döngüye uygun bir mp4'e ve bir kapak (poster) JPEG'ine
çevirir.

YAPTIKLARI
----------
1. Kenarlardaki ekran kaydı çerçevesini (mavi şerit) kırpar.
2. En ilginç 12 saniyelik pencereyi alır.
3. 640 piksel genişliğe indirir, 24 fps, sesi tamamen atar.
4. İlk saniyeden bir kapak görseli üretir — video yüklenene kadar o görünür.

Çalıştırmak için:  python scripts/videolar.py
Kaynak:            medya-kaynak/videolar/*.mp4   (ham kayıtlar, siteye çıkmaz)
Çıktı:             public/videos/<id>.mp4  +  public/videos/<id>.jpg
"""
import json
import os
import subprocess
import sys

KAYNAK = 'medya-kaynak/videolar'
HEDEF = 'public/videos'

GENISLIK = 640      # çıktı genişliği
SURE = 12           # saniye
FPS = 24
CRF = 32            # 28 = daha kaliteli/büyük · 34 = daha küçük/bulanık

# Ham kayıtların kenarında ekran kaydı uygulamasının bıraktığı çerçeve var:
# mavi kenarlık, üstte/altta pembe şerit ve altta ortada mavi bir kutu. Bunların
# kalınlığı kayıt boyunca değiştiği için otomatik tespit güvenilir olmuyor;
# hepsini kesen sabit bir pay kullanıyoruz. Sıra: üst, alt, sol, sağ.
KIRP = (34, 40, 14, 14)
#
# Bazı kayıtların üstünde tarayıcı yer imleri, hesap adı veya e-posta adresi
# görünüyor. KİŞİSEL VERİ SİTEDE DURMAZ — o kayıtlarda üst pay artırıldı.
# Yeni kayıt eklerken üst şeridi mutlaka gözle kontrol edin.
KIRP_OZEL = {
    'quiz-uygulamasi': (66, 40, 14, 14),      # App Inventor başlığındaki e-posta
    'muzik-uygulamasi': (104, 20, 14, 14),    # yer imleri çubuğu + e-posta
    'villa-3b': (78, 40, 14, 14),             # kişisel yer imleri çubuğu
    'bilet-uygulamasi': (60, 40, 14, 14),     # Visual Studio hesap baş harfleri
}

# id, ham dosyanın sıradaki numarası (1-9), klibin başlangıç saniyesi
KLIPLER = [
    ('unity-acik-dunya', 8, 20),
    ('quiz-uygulamasi', 9, 40),
    ('stadyum-3b', 1, 42),
    ('bilet-uygulamasi', 7, 44),
    ('villa-3b', 6, 30),
    ('unity-birinci-sahis', 2, 38),
    ('muzik-uygulamasi', 4, 40),
    ('masaustu-sahne-3b', 3, 40),
    ('site-plani-3b', 5, 12),
]


def ham_dosyalar():
    if not os.path.isdir(KAYNAK):
        sys.exit(f'Kaynak klasör yok: {KAYNAK}')
    return sorted(
        os.path.join(KAYNAK, f)
        for f in os.listdir(KAYNAK)
        if f.lower().endswith(('.mp4', '.mov', '.webm', '.mkv'))
    )


def olcu(path):
    r = subprocess.run(
        ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_streams', path],
        capture_output=True, text=True, check=True,
    )
    v = next(s for s in json.loads(r.stdout)['streams'] if s['codec_type'] == 'video')
    return int(v['width']), int(v['height'])


def kb(path):
    return os.path.getsize(path) // 1024


if __name__ == '__main__':
    os.makedirs(HEDEF, exist_ok=True)
    hamlar = ham_dosyalar()
    if len(hamlar) < max(n for _, n, _ in KLIPLER):
        sys.exit(f'{KAYNAK} içinde {len(hamlar)} video var, en az 9 bekleniyordu.')

    boyutlar = {}
    toplam = 0

    for vid, no, bas in KLIPLER:
        kaynak = hamlar[no - 1]
        w, h = olcu(kaynak)
        ust, alt, sol, sag = KIRP_OZEL.get(vid, KIRP)
        # Kenar çerçevesini at, 640 piksel genişliğe indir
        vf = (
            f'crop={w - sol - sag}:{h - ust - alt}:{sol}:{ust},'
            f'scale={GENISLIK}:-2:flags=lanczos,fps={FPS}'
        )
        mp4 = f'{HEDEF}/{vid}.mp4'
        jpg = f'{HEDEF}/{vid}.jpg'

        subprocess.run(
            ['ffmpeg', '-y', '-v', 'error', '-ss', str(bas), '-t', str(SURE),
             '-i', kaynak, '-vf', vf,
             '-c:v', 'libx264', '-preset', 'veryslow', '-crf', str(CRF),
             '-profile:v', 'main', '-pix_fmt', 'yuv420p',
             '-movflags', '+faststart', '-an', mp4],
            check=True,
        )
        subprocess.run(
            ['ffmpeg', '-y', '-v', 'error', '-ss', str(bas + 1), '-i', kaynak,
             '-frames:v', '1', '-vf', vf.replace(f',fps={FPS}', ''),
             '-q:v', '6', jpg],
            check=True,
        )

        ow, oh = olcu(mp4)
        boyutlar[vid] = (ow, oh)
        toplam += kb(mp4) + kb(jpg)
        print(f'{vid:24s} {ow}x{oh}  video {kb(mp4):4d} KB  kapak {kb(jpg):3d} KB')

    print(f'\nToplam: {toplam / 1024:.1f} MB')
    print('\nvideos.ts için ölçüler:')
    for vid, (w, h) in boyutlar.items():
        print(f"  {vid}: width: {w}, height: {h}")
