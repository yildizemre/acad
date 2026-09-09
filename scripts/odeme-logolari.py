# -*- coding: utf-8 -*-
"""
Ödeme logo bandını üretir.

NEDEN
-----
Sanal POS sağlayıcısı iyzico'dan PayTR'a geçti. `iyzico-logo-pack` içindeki
hazır bant, kart şeması markalarının solunda "iyzico ile öde" logosunu taşıyor.
PayTR ile tahsilat yapıp iyzico logosu göstermek ziyaretçiyi yanıltır.

Bu betik:
  1. iyzico bandından iyzico grubunu siler; geriye yalnızca kart şeması kabul
     markaları (Mastercard, Visa, American Express, Troy) kalır.
  2. viewBox'ın sol kenarını kaydırarak boşluğu kırpar.
     (İçerideki transform'lara dokunmuyoruz — renkli ve beyaz sürümlerin iç
     ölçüleri farklı, tek tek kaydırmak kırılgan olurdu.)
  3. PayTR'ın kendi logo paketindeki SVG'leri public/odeme/ altına kopyalar.
  4. PayTR Mağaza Paneli'ne yüklenecek mağaza logosunu üretir (en fazla
     300x100 piksel, PNG — panelin şartı). Bu dosya siteye çıkmaz; dekont
     e-postalarında görünmesi için panele elle yüklenir.

Kart şeması markaları kartı kabul eden her işyeri tarafından gösterilebilir;
sağlayıcıya değil kart ağlarına aittir. PayTR logosu doğrudan PayTR'ın kendi
verdiği paketten gelir.

Çalıştırmak için:  python scripts/odeme-logolari.py
Girdi:             PayTR - New Logo Set/  ve  iyzico-logo-pack/
Çıktı:             public/odeme/paytr-renkli.svg · paytr-beyaz.svg
                   public/odeme/kart-semalari.svg · kart-semalari-beyaz.svg
                   medya-kaynak/paytr-panel/*.png  (panele elle yüklenir)
"""
import io
import os
import re
import shutil
import sys

from PIL import Image

PAYTR_SET = 'PayTR - New Logo Set/PayTR_Logo/SVG'
IYZICO_BANT = 'iyzico-logo-pack/footer_iyzico_ile_ode'
HEDEF = 'public/odeme'

# iyzico logosu bandın en solunda, x=0'dan başlayıp 129'a kadar uzanıyor.
# Kart markaları bu noktadan sonra başlıyor.
KIRPMA_X = 129

# PayTR Mağaza Paneli'nin mağaza logosu için koyduğu üst sınır.
PANEL_LOGO = (300, 100)
PANEL_KLASOR = 'medya-kaynak/paytr-panel'


def eslesen_kapanis(s: str, acilis_bas: int) -> int:
    """`<g ...>` etiketinin kapanan `</g>` etiketinin bitiş konumunu döner."""
    derinlik = 0
    for m in re.finditer(r'<g\b[^>]*>|</g>', s[acilis_bas:]):
        if m.group(0) == '</g>':
            derinlik -= 1
            if derinlik == 0:
                return acilis_bas + m.end()
        else:
            derinlik += 1
    raise ValueError('Kapanan </g> bulunamadı')


def bant_uret(kaynak: str, cikti: str) -> None:
    s = io.open(kaynak, encoding='utf-8').read()

    # iyzico logosu, x=0 konumundaki grup. Renkli ve beyaz sürümlerde grup adı
    # farklı olduğu için ada değil KONUMA bakıyoruz.
    aday = None
    for m in re.finditer(r'<g\b[^>]*transform="translate\(0\.0*,[^"]*\)"[^>]*>', s):
        aday = m
    if not aday:
        sys.exit(f'{kaynak}: x=0 konumundaki iyzico grubu bulunamadı — paket değişmiş olabilir')

    son = eslesen_kapanis(s, aday.start())
    s = s[: aday.start()] + s[son:]

    # viewBox'ın sol kenarını kaydır, genişliği o kadar daralt.
    vb = re.search(r'viewBox="0 0 (\d+) (\d+)"', s)
    if not vb:
        sys.exit(f'{kaynak}: viewBox okunamadı')
    genislik, yukseklik = int(vb.group(1)), int(vb.group(2))
    yeni_genislik = genislik - KIRPMA_X

    s = s[: vb.start()] + f'viewBox="{KIRPMA_X} 0 {yeni_genislik} {yukseklik}"' + s[vb.end():]
    s = re.sub(r'width="\d+px"', f'width="{yeni_genislik}px"', s, count=1)
    s = re.sub(r'<title>[^<]*</title>', '<title>Kabul edilen kartlar</title>', s, count=1)

    io.open(cikti, 'w', encoding='utf-8').write(s)
    print(f'{cikti}  {yeni_genislik}x{yukseklik}  {os.path.getsize(cikti) // 1024} KB')


def panel_logosu_uret() -> None:
    """
    PayTR Mağaza Paneli'ne yüklenecek logoyu üretir.

    Panel en fazla 300x100 piksel PNG istiyor. Kaynak logo 432x141 olduğu için
    önce kenarlardaki saydam boşluk kırpılır (yoksa ölçeklenince logo gereksiz
    küçülür), sonra orana sadık kalarak sığdırılır ve tam 300x100 tuvale
    ortalanır.

    İki sürüm çıkar:
      · beyaz  — dekont e-postalarında güvenli, her istemcide aynı görünür
      · saydam — koyu zeminli arayüzler için yedek
    """
    os.makedirs(PANEL_KLASOR, exist_ok=True)
    im = Image.open('public/logo.png').convert('RGBA')
    im = im.crop(im.getbbox())  # kenarlardaki saydam boşluğu at

    genislik, yukseklik = PANEL_LOGO
    oran = min(genislik / im.width, yukseklik / im.height)
    yeni = (round(im.width * oran), round(im.height * oran))
    kucuk = im.resize(yeni, Image.LANCZOS)
    konum = ((genislik - yeni[0]) // 2, (yukseklik - yeni[1]) // 2)

    saydam = Image.new('RGBA', PANEL_LOGO, (0, 0, 0, 0))
    saydam.paste(kucuk, konum, kucuk)
    saydam.save(f'{PANEL_KLASOR}/hype-academia-logo-300x100-saydam.png', 'PNG', optimize=True)

    beyaz = Image.new('RGB', PANEL_LOGO, (255, 255, 255))
    beyaz.paste(kucuk, konum, kucuk)
    beyaz.save(f'{PANEL_KLASOR}/hype-academia-logo-300x100-beyaz.png', 'PNG', optimize=True)

    for ad in ('beyaz', 'saydam'):
        yol = f'{PANEL_KLASOR}/hype-academia-logo-300x100-{ad}.png'
        print(f'{yol}  {genislik}x{yukseklik}  {os.path.getsize(yol) // 1024} KB')


if __name__ == '__main__':
    for klasor in (PAYTR_SET, IYZICO_BANT):
        if not os.path.isdir(klasor):
            sys.exit(f'Klasör bulunamadı: {klasor}')

    os.makedirs(HEDEF, exist_ok=True)

    # ── PayTR logoları (sağlayıcının kendi paketi) ──
    for kaynak_ad, hedef_ad in (
        ('PayTR - 2025 New Logo-Color.svg', 'paytr-renkli.svg'),
        ('PayTR - 2025 New Logo-White.svg', 'paytr-beyaz.svg'),
    ):
        hedef = os.path.join(HEDEF, hedef_ad)
        shutil.copyfile(os.path.join(PAYTR_SET, kaynak_ad), hedef)
        print(f'{hedef}  {os.path.getsize(hedef) // 1024} KB')

    # ── Kart şeması bandı ──
    bant_uret(f'{IYZICO_BANT}/Colored/logo_band_colored.svg', f'{HEDEF}/kart-semalari.svg')
    bant_uret(f'{IYZICO_BANT}/White/logo_band_white.svg', f'{HEDEF}/kart-semalari-beyaz.svg')

    # ── PayTR paneline yüklenecek mağaza logosu ──
    panel_logosu_uret()
