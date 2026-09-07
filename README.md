# Hype Academia

8–17 yaş arası çocuklara canlı online yazılım, robotik ve yapay zeka eğitimi veren
akademinin web sitesi.

React 18 · TypeScript · Vite · Tailwind · React Router · Netlify

```bash
npm install
npm run dev        # geliştirme sunucusu
npm run build      # üretim derlemesi (dist/)
npm run typecheck  # tip kontrolü
npm run lint       # kod denetimi
```

---

## Şu an sizden bekleyen 5 şey

Site teknik olarak hazır. Aşağıdakiler tamamlandığında tam kapasiteye çıkar.
Sıralama etkiye göre.

### 1. Analitiği açın — 5 dakika

Bu yapılmadan hiçbir kararı veriyle veremezsiniz.

1. [plausible.io](https://plausible.io) üzerinde hesap açın (çerezsiz, KVKK dostu,
   çerez banneri gerektirmez)
2. Proje kökünde `.env.local` dosyası oluşturun:
   ```
   VITE_PLAUSIBLE_DOMAIN=hypeacademia.com
   ```
3. Netlify'da aynı değişkeni ekleyin: Site configuration → Environment variables

Sayfa görüntülemenin yanında şu dönüşüm olayları da otomatik ölçülür:
`form_gonderildi` · `whatsapp_tiklandi` (hangi bölümden geldiği dahil) ·
`kurs_goruntulendi` · `mufredat_haftasi_acildi` · `fiyat_hesaplandi`
(seçilen kurs, paket, plan ve tutar ile) · `telefon_tiklandi`

Sonuncusu özellikle değerli: velilerin hangi fiyat kombinasyonlarını denediğini
görürsünüz.

### 2. Rezervasyon takvimini bağlayın — 15 dakika

"48 saat içinde ararız" adımını tamamen ortadan kaldırır.

1. [cal.com](https://cal.com) üzerinde ücretsiz hesap açın
2. "Deneme Dersi" adında 60 dakikalık etkinlik oluşturun, eğitmen takvimlerini bağlayın
3. `.env.local` dosyasına ekleyin:
   ```
   VITE_CAL_LINK=hypeacademia/deneme-dersi
   ```

Bayrak açılınca `/iletisim` sayfasında formun üstünde takvim belirir. Boş bırakılırsa
site bugünkü form akışıyla çalışmaya devam eder.

### 3. Eğitmen bilgilerini tamamlayın

Sitenin en zayıf yeri burası. `Müh. Ahmet K.` gibi baş harfli isimler güven vermek
yerine tam tersini yapıyor — uydurma gibi okunuyor.

[`src/data/content.ts`](src/data/content.ts) → `TEACHERS`

```ts
{
  initials: 'AK',
  name: 'Ahmet Kaya',                          // tam ad
  photo: '/images/egitmen-ahmet.jpg',          // varsa fotoğraf
  profile: 'https://linkedin.com/in/ahmetkaya',// varsa profil
  title: 'Bilgisayarla Görü Uzmanı',
  exp: '...',
  courses: 'Python, Yapay Zeka & ML',
}
```

`photo` verilince kart fotoğrafı, `profile` verilince ada bağlantı gösterir.
İkisi de boşken bugünkü baş harf kutusu kullanılır.

### 4. Gerçek veli yorumu ekleyin

[`src/data/testimonials.ts`](src/data/testimonials.ts) → `TESTIMONIALS` dizisi
**bilerek boş** bırakıldı. Uydurma yorum koymadık: bir veli gerçek olup olmadığını
sorduğunda cevap verebilmek gerekiyor.

Dizi boşken sitede "Yazılı Taahhütlerimiz" bölümü görünüyor — doğrulanabilir
sözlerden oluşuyor ve sahte yorumdan daha ikna edici. Gerçek yorum eklediğiniz anda
bölüm otomatik olarak yorumlara dönüşür.

Veliden **yazılı izin** alın (adının ve çocuğunun yaşının yayınlanması için).
En ikna edici yorumlar övgü değil, değişim anlatanlardır.

### 5. Gerçek öğrenci projelerini yayınlayın

[`src/data/projects.ts`](src/data/projects.ts) şu an müfredatın ürettiği bitirme
projelerini gösteriyor — yani doğru, ama belirli bir öğrenciye ait değil.

Gerçek iş eklemek için:
- `student: { name: 'Kerem A.', age: 12 }` → kart öğrenci adını gösterir
- Scratch projesi → `embedId: '123456789'` (adresteki sayı) → proje sayfada **oynanabilir** olur
- itch.io oyunu → Embed bölümündeki upload numarası

Veli izni olmadan çocuk adı yayınlamayın.

---

## İçerik nerede?

Sitedeki bütün metin ve rakamlar `src/data/` altında. Bileşenlere dokunmadan
düzenleyebilirsiniz.

| Dosya | İçerik |
|---|---|
| [`courses.ts`](src/data/courses.ts) | 6 kurs · hafta hafta müfredat · kazanımlar · ön koşullar · kurs SSS'leri |
| [`pricing.ts`](src/data/pricing.ts) | Paketler · fiyatlar · ödeme planları · indirimler · hesaplama fonksiyonları |
| [`content.ts`](src/data/content.ts) | SSS · kayıt süreci · eğitmenler · değerler · iade politikası · hukuki metinler |
| [`articles.ts`](src/data/articles.ts) | Veli rehberi yazıları |
| [`projects.ts`](src/data/projects.ts) | Bitirme projeleri |
| [`testimonials.ts`](src/data/testimonials.ts) | Veli yorumları (boş) + yazılı taahhütler |
| [`site.ts`](src/data/site.ts) | Telefon · e-posta · adres · sosyal medya bağlantıları |

**Fiyat değiştirmek:** yalnızca `pricing.ts`. Kurs sayfaları, hesaplayıcı, kayıt
özeti ve yapısal veri hepsi oradan okuyor.

## Sayfalar

`/` · `/kurslar` · `/kurslar/:slug` (6) · `/projeler` · `/fiyatlar` · `/kayit` ·
`/rehber` · `/rehber/:slug` (5) · `/hakkimizda` · `/sss` · `/iletisim` ·
`/yasal/:slug` (3) · 404

## İkonlar

Favicon ve uygulama ikonları logo işaretinden (mavi nokta + diyagonal çubuk)
vektör olarak yeniden çizilir — `logo.png` kırpılmaz, her boyutta net kalır.

```bash
python scripts/ikonlar.py
```

Üretilenler: `favicon.svg` · `favicon.ico` (16/32/48) · `apple-touch-icon.png` (180) ·
`icon-192.png` · `icon-512.png` · `icon-maskable-512.png` (Android güvenli alan paylı)

**Logo değişirse:** `scripts/ikonlar.py` içindeki `BLUE` ve `DOT`/`BAR` koordinatlarını
güncelleyip yeniden çalıştırın, ardından paylaşım görselini de yenileyin.

## SEO

Tek sayfa uygulamalarda botlar ilk istekte boş bir HTML görür. `npm run build`
sonunda [`scripts/prerender.mjs`](scripts/prerender.mjs) çalışır ve **her rota için
ayrı bir `index.html`** üretir:

- Her sayfanın kendi `<title>`, açıklama ve canonical etiketi olur
- WhatsApp/Facebook paylaşımında doğru başlık ve açıklama çıkar
- JavaScript çalıştırmayan botlar `<noscript>` içindeki gerçek içeriği okur
  (kurs sayfalarında ~440 kelime: haftalık müfredat, fiyat, ön koşullar)
- `sitemap.xml` güncel tarihle otomatik üretilir

Sayfa metinleri [`src/seo/routes.ts`](src/seo/routes.ts) içinde ve aynı veri
dosyalarından beslenir — içerik değişince meta da kendiliğinden güncellenir.

⚠️ `netlify.toml` içindeki yönlendirme kuralına **`force = true` eklemeyin**;
eklenirse statik sayfalar atlanır ve ön işlemenin faydası kaybolur.

**Yapısal veri:** Organization + WebSite (her sayfada), Course + BreadcrumbList +
FAQPage (kurs sayfaları), Article + BreadcrumbList (rehber yazıları),
FAQPage (SSS sayfası). Google Rich Results Test ile doğrulanabilir.

## Görseller

Kurs ve proje görselleri SVG olarak koddan üretiliyor — her ölçekte net, toplam 280 KB.
Metnini veya rengini değiştirip yeniden üretebilirsiniz:

```bash
python scripts/gorseller.py           # kurs ders ekranları
python scripts/gorseller_projeler.py  # bitirme projeleri
```

Paylaşım görseli (`public/og.png`) logodan üretiliyor. **Logoyu değiştirdiğinizde
yeniden üretilmesi gerekir.**

## Ödeme entegrasyonu

Kayıt akışı bugün `/kayit` → sipariş özeti → WhatsApp şeklinde çalışıyor.
Online ödemeye geçiş için: [`docs/ODEME-ENTEGRASYONU.md`](docs/ODEME-ENTEGRASYONU.md)

## Marka

```
Zemin     #F5F1EA   kum / kağıt     beyaz kullanılmıyor
Ana       #0E2038   mürekkep        başlıklar, koyu yüzeyler
Metin     #2A3444   koyu kurşun     gövde metni
Eylem     #B8432B   tuğla           SADECE buton ve bağlantılarda
Marka     #1B18FF   logo mavisi     işaret, odak halkası, vurgu altı çizgisi
Çizgi     #C9BFAE   kum             gölge yerine kullanılan ayraç
```

Başlıklar Fraunces (serif), gövde Inter, kod JetBrains Mono.
Köşe yarıçapı 8px, gölge yok — derinlik 1px çizgiyle kuruluyor.

**İki rengin işi farklı, karıştırmayın:**
- **Tuğla** = "tıklanacak şey" (butonlar, bağlantı altı çizgileri)
- **Logo mavisi** = "bu marka" (işaret, odak halkası, başlık vurgusu, seviye göstergesi)

İkisi de dekoratif olarak geniş alanlarda dolgu yapılmaz; anlamları kaybolur.

## Netlify

- SPA yönlendirmesi: `public/_redirects` ve `netlify.toml`
- Form: `deneme-dersi` (bildirim ayarı Netlify panelinden yapılır)
- Ortam değişkenleri: Site configuration → Environment variables

`VITE_` ile başlayan değişkenler derleme sırasında tarayıcıya gömülür.
**API anahtarlarını asla `VITE_` değişkenine yazmayın.**
