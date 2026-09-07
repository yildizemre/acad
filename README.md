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

## Şu an sizden bekleyen 6 şey

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

### 4. Rakamların dayanağını ekleyin

"2.500+ mezun" ve "%98 veli memnuniyeti" ifadeleri, dayanakları
belirtilemediği için ana sayfadaki rakam şeridinden **çıkarıldı**. Yerlerine
kendi içinde doğrulanabilir maddeler kondu (kuruluş yılı, program sayısı,
sınıf mevcudu, kayıt erişim süresi).

Geri eklemek için [`src/data/site.ts`](src/data/site.ts) → `STATS`:

```ts
{ value: '%98', label: 'Veli Memnuniyeti',
  note: 'Ocak–Haziran 2026 dönem sonu anketi, 214 veli' }
```

`note` alanı rakamın altında dipnot olarak görünür. **Anket dönemi ve katılımcı
sayısı olmadan yayınlamayın** — ziyaretçi doğrulayamadığı rakama güvenmiyor.

Aynı mantık GTÜ ilişkisi ve E-Devlet sertifikası için de geçerli: ilişkinin ne
olduğunu açıkça yazın, mümkünse doğrulama bağlantısı verin, sertifikanın kişisel
bilgileri kapatılmış bir örneğini yayınlayın.

### 5. Gerçek veli yorumu ekleyin

[`src/data/testimonials.ts`](src/data/testimonials.ts) → `TESTIMONIALS` dizisi
**bilerek boş** bırakıldı. Uydurma yorum koymadık: bir veli gerçek olup olmadığını
sorduğunda cevap verebilmek gerekiyor.

Dizi boşken sitede "Yazılı Taahhütlerimiz" bölümü görünüyor — doğrulanabilir
sözlerden oluşuyor ve sahte yorumdan daha ikna edici. Gerçek yorum eklediğiniz anda
bölüm otomatik olarak yorumlara dönüşür.

Veliden **yazılı izin** alın (adının ve çocuğunun yaşının yayınlanması için).
En ikna edici yorumlar övgü değil, değişim anlatanlardır.

### 6. Gerçek öğrenci projelerini yayınlayın

[`src/data/projects.ts`](src/data/projects.ts) şu an müfredatın ürettiği bitirme
projelerini gösteriyor — yani doğru, ama belirli bir öğrenciye ait değil.

Sayfada iki tür kart var ve ziyaretçi hangisine baktığını görüyor:
**Müfredat projesi** (kursun tanımladığı bitirme projesi) ve
**Öğrenci projesi** (gerçek, izinli, oynanabilir).

Gerçek iş eklemek için:
- `student: { name: 'Kerem A.', age: 12 }` → kart "Öğrenci projesi" rozetine geçer
- `embedId: '123456789'` → Scratch/itch.io projesi **sayfada oynanır**
- `demoUrl` → projeyi kendi sitesinde açan bağlantı
- `videoUrl` → 20–40 saniyelik ekran kaydı

Bunlardan hiçbiri yoksa kartta "oynanabilir bir sürümü henüz yayınlanmadı"
notu görünür — ziyaretçi tahmin etmek zorunda kalmaz.

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

### Fiyat mantığında bozulmaması gereken üç kural

1. **Taksitlerin toplamı, toplam tutara birebir eşit olmalı.**
   `installmentsFor()` hesabı kuruş üzerinden tam sayıyla yapar ve artan kuruşu
   son takside bindirir. Basit bölme + yuvarlama yapmayın — 13.900 / 6 işlemi
   6 × 2.320 = 13.920 gibi tutmayan bir sonuç verir.

2. **Sınıf mevcudu = paketin sınırı ile kursun sınırından DÜŞÜK olanı.**
   `classSizeFor()` bunu hesaplar. Unity ve Yapay Zeka kursları 6 kişiyle
   sınırlı olduğu için o kurslarda Kulüp paketi 8 değil 6 kişiliktir.
   Katmanın `maxStudents` değerini doğrudan ekrana basmayın.

3. **Ders süresi kursa aittir, pakete değil.** `lessonLineFor()` kullanın.
   Unity 75 dk, diğerleri 60 dk. Pakete sabit süre yazmayın.

Patika (yıllık program) süreleri ve karşılaştırma fiyatları elle girilmez;
`pathInfo()` bunları kurslardan hesaplar. Böylece bir kursun süresi değişince
patika bilgisi kendiliğinden düzelir.

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

## iyzico sanal POS başvurusu

Sanal POS **ana şirket Hype Vision** adına alındı; Hype Academia onun altında bir
markadır. Bu yüzden bütün sözleşmelerde **SATICI = Hype Vision** görünür ve
faturayı Hype Vision keser. iyzico, sözleşmelerdeki ünvan/vergi/adres bilgilerinin
POS başvurusundakiyle **birebir** aynı olmasını şart koşuyor.

### 🔴 Yayına almadan önce doldurun

Tek dosya: [`src/data/legal-entity.ts`](src/data/legal-entity.ts) → `SELLER`

| Alan | Ne yazılacak |
|---|---|
| `legalName` | Ticaret sicilindeki **tam ünvan** (Ltd. Şti. / A.Ş. dahil) |
| `address` | Fatura ve tebligat adresi |
| `taxOffice` | Vergi dairesi |
| `taxNumber` | Vergi kimlik numarası (VKN) |
| `mersis` | MERSİS numarası |
| `tradeRegistryNo` | Ticaret sicil numarası |
| `kep` | KEP adresi (varsa) |

Eksik alan kaldığı sürece:
- `npm run build` çıktısında **uyarı** görünür
- Sözleşme sayfalarında ziyaretçiye **kırmızı uyarı kutusu** çıkar
- Metinlerde `[DOLDURULACAK: ...]` ifadeleri görünür

Bu üç işaret de bilgiler girilince kendiliğinden kaybolur.

### iyzico kriter listesi

| # | Kriter | Durum |
|---|---|---|
| 1 | Hakkımızda sayfası | ✅ `/hakkimizda` — kurumsal kimlik tablosu dahil |
| 2 | SSL sertifikası | ⚙️ Netlify otomatik kurar — aşağıya bakın |
| 3 | Teslimat ve İade Şartları | ✅ `/yasal/teslimat-ve-iade` |
| 4 | Gizlilik Sözleşmesi | ✅ `/yasal/gizlilik` + `/yasal/kvkk` |
| 5 | Mesafeli Satış Sözleşmesi | ✅ `/yasal/mesafeli-satis-sozlesmesi` |
| 6 | Visa / MasterCard logoları | ✅ Altbilgi, kayıt sayfası, Hakkımızda |
| 7 | iyzico ile Öde logosu | ✅ Aynı logo bandının içinde |

Ayrıca **Ön Bilgilendirme Formu** (`/yasal/on-bilgilendirme-formu`) da eklendi —
mesafeli satışta yasal olarak zorunlu ve iyzico çoğu başvuruda istiyor.
Kayıt sayfasında ödemeye geçmeden önce **her iki sözleşmenin onay kutusu** var;
onaylanmadan buton çalışmıyor.

### SSL nasıl açılır

Netlify alan adını bağladığınızda Let's Encrypt sertifikasını otomatik kurar:

1. Netlify → Domain management → alan adını ekleyin
2. DNS kayıtlarını Netlify'a yönlendirin
3. HTTPS bölümünde sertifika birkaç dakikada oluşur
4. **"Force HTTPS" anahtarını açın** — HTTP istekleri HTTPS'e yönlenir

`netlify.toml` içinde `Strict-Transport-Security` başlığı tanımlı; tarayıcıya bir
yıl boyunca yalnızca HTTPS kullanmasını söyler. Sertifika aktif olmadan bu başlık
siteyi erişilemez yapabilir — **önce sertifikanın kurulduğunu doğrulayın.**

### ⚖️ Hukuki uyarı

Sözleşme metinleri 6502 sayılı kanun ve Mesafeli Sözleşmeler Yönetmeliği'ne göre
hazırlanmış **taslaklardır**. Yayına almadan önce bir hukuk danışmanına okutun;
özellikle cayma hakkı ve iade istisnası maddeleri işletmenizin gerçek
uygulamasıyla birebir örtüşmeli.

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
