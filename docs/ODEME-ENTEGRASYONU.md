# Online Ödeme — PayTR iFrame API

Bu dosya ödeme akışının nasıl kurulduğunu ve canlıya nasıl alınacağını anlatır.

---

## Neden iFrame API, neden "link ile ödeme" değil

Sitede **6 kurs × 3 paket × 6 ödeme planı** var; her kombinasyon farklı bir
tutar üretiyor. "Link ile ödeme" yönteminde her sipariş için panelden elle link
üretmek gerekirdi. iFrame API'de tutar sipariş anında hesaplanıyor ve müşteri
siteden hiç çıkmıyor.

Kart bilgileri PayTR'ın alan adındaki iframe içinde giriliyor; bizim
sunucumuza hiç ulaşmıyor. Bu yüzden kart verisi için PCI yükümlülüğümüz doğmuyor
ve sözleşmelerde bunu böyle yazabiliyoruz.

---

## Akış

```
  Tarayıcı                     Netlify Function                 PayTR
     │                                │                            │
     │ 1. kurs+paket+plan+alıcı       │                            │
     ├───────────────────────────────►│                            │
     │   (TUTAR GÖNDERİLMEZ)          │                            │
     │                                │ tutarı kendi hesaplar      │
     │                                │ siparişi Blobs'a yazar     │
     │                                │ 2. get-token ──────────────►│
     │                                │◄────────────── iframe_token │
     │◄───────────────────────────────┤                            │
     │ 3. iframe açılır, kart girilir ─────────────────────────────►│
     │                                │                            │
     │                                │◄── 4. BİLDİRİM (POST) ──────┤
     │                                │    hash doğrulanır         │
     │                                │    sipariş sonuçlanır      │
     │                                │    kayıt ekibine e-posta   │
     │                                ├──────── "OK" ──────────────►│
     │◄─ 5. /odeme-sonucu'na yönlenir │                            │
     │    durumu yoklar ──────────────►│                            │
```

**Kritik nokta:** 4. adım ile 5. adım birbirinden bağımsızdır. Müşteri sonuç
sayfasına ulaştığında ödeme henüz kesinleşmemiş olabilir. Bu yüzden sipariş
**yalnızca bildirimle** onaylanır, sonuç sayfasında değil.

---

## Dosyalar

| Dosya | İşi |
|---|---|
| `netlify/lib/paytr.ts` | İmza (HMAC-SHA256), token isteği, bildirim doğrulama |
| `netlify/lib/siparis.ts` | Sipariş kaydı (Netlify Blobs), tekrarlayan bildirim koruması |
| `netlify/functions/paytr-token.mts` | 1. ADIM — `POST /api/paytr/token` |
| `netlify/functions/paytr-bildirim.mts` | 2. ADIM — `POST /api/paytr/bildirim` |
| `netlify/functions/paytr-durum.mts` | `GET /api/paytr/durum?no=…` |
| `src/lib/payment.ts` | Tarayıcı tarafı — yalnızca kendi uçlarımızla konuşur |
| `src/components/PaytrFrame.tsx` | Ödeme formu iframe'i |
| `src/pages/CheckoutPage.tsx` | 3 adımlı kayıt akışı |
| `src/pages/PaymentResultPage.tsx` | `/odeme-sonucu` |

---

## Güvenlik kararları

**1. Tutar tarayıcıdan alınmaz.**
`paytr-token.mts` kurs/paket/plan kimliklerini alır ve fiyatı `src/data/pricing.ts`
üzerinden **yeniden hesaplar**. Tarayıcıdan gelen bir tutara güvenmek, konsoldan
13.900 TL'yi 1 TL yapmak demektir.

**2. Bildirim imzası doğrulanır.**
`bildirimImzasiDogru()` atlanırsa herkes `status=success` POST'u atıp bedava
kayıt açtırabilir. PayTR dokümanı da bunu açıkça uyarıyor. Karşılaştırma
`timingSafeEqual` ile yapılır.

**3. Tekrarlayan bildirim tek kez işlenir.**
PayTR ağ sorunlarında aynı bildirimi birkaç kez gönderebilir. `sonuclandir()`
yalnızca ilk bildirimde `ilkKez: true` döner; e-posta bir kez gider.

**4. Anahtarlar tarayıcıya gitmez.**
`merchant_key` ve `merchant_salt` yalnızca Netlify ortam değişkenlerinde durur.
`VITE_` ile başlayan hiçbir değişkene yazılmaz — o değişkenler derlenmiş
JavaScript'in içine gömülür ve herkes görebilir.

**5. Bildirim ucu her durumda "OK" döner.**
Sipariş bulunamasa veya e-posta gitmese bile OK dönülür. OK dönülmezse PayTR
işlemi "Devam Ediyor" bırakır ve **para hesabınıza aktarılmaz**.

---

## Canlıya alma — sırasıyla

### 1. PayTR anahtarlarını alın
Mağaza Paneli → **BİLGİ** sayfası (Ana Kullanıcı veya Teknik Sorumlu görebilir):
- Mağaza no → `PAYTR_MERCHANT_ID`
- Mağaza parolası → `PAYTR_MERCHANT_KEY`
- Mağaza gizli anahtarı → `PAYTR_MERCHANT_SALT`

### 2. Netlify'a girin
Site configuration → Environment variables:

```
PAYTR_MERCHANT_ID=…
PAYTR_MERCHANT_KEY=…
PAYTR_MERCHANT_SALT=…
PAYTR_TEST_MODE=1        ← önce test
PAYTR_DEBUG=1
VITE_PAYMENT_ONLINE=true
```

> `.env` dosyasına yazıp git'e commit etmeyin.

### 3. Bildirim URL'yi tanımlayın
PayTR Mağaza Paneli → **Ayarlar → Bildirim URL Ayarları**:

```
https://hypeacademia.com/api/paytr/bildirim
```

Protokol **HTTPS** seçilmeli (sitede SSL var).

### 4. Mağaza logosunu panele yükleyin
PayTR Mağaza Paneli → **Ayarlar** → mağaza logosu.
Panel en fazla **300×100 piksel PNG** kabul ediyor; hazır dosya:

```
medya-kaynak/paytr-panel/hype-academia-logo-300x100-beyaz.png
```

(`python scripts/odeme-logolari.py` ile yeniden üretilir.) Yüklenmezse ödeme
sonrası müşteriye giden dekont e-postalarında logo görünmez.

### 5. E-posta bildirimini açın

> ⚠️ **Netlify formları DEPLOY ANINDA tarayarak bulur.** Panelde Forms sayfası
> boşsa neredeyse her zaman sebep budur: form eklendikten sonra site henüz
> yeniden deploy edilmemiştir. Formlar `index.html` içinde `<body>` sonunda
> gizli olarak duruyor (`<head>` içinde `<form>` geçersiz HTML'dir ve tespit
> güvenilmez olur). Deploy ettikten sonra `deneme-dersi` ve `odeme-bildirimi`
> panelde görünür.

Netlify → Site configuration → Forms → Form notifications → Add notification:
- Event: `New form submission`
- Form: `odeme-bildirimi`
- Email: `info@hypevisionlab.com`

### 6. Test ödemesi yapın
`PAYTR_TEST_MODE=1` iken siteden bir kayıt tamamlayın. Sonra:

- PayTR Mağaza Paneli → **İşlemler** sayfasında işlem **"Başarılı"** görünmeli.
- **"Devam Ediyor"** görünüyorsa bildirim ucumuzdan OK alınamamış demektir.
  Satırdaki **Detay** bağlantısından dönen yanıtı kontrol edin, ardından
  Netlify → Functions → `paytr-bildirim` günlüklerine bakın.

### 7. Canlıya geçin
`PAYTR_TEST_MODE=0` yapın ve küçük tutarlı bir gerçek işlem deneyin.

---

## Bilinmesi gerekenler

**Taksit farkını banka belirler.**
Sitede yazan taksit tutarı bizim planımızdır; PayTR ekranında bankanın vade
farkı ayrıca görünür ve tahsil edilen tutar (`total_amount`) sitede gösterilen
tutardan yüksek olabilir. Bu, bildirimde ayrı bir alan olarak kaydedilir ve
kayıt e-postasında "Tahsil edilen" satırında görünür.

> **Dikkat:** `PAYMENT_PLANS` içinde "12 Taksit" planının `multiplier` değeri
> `1.05`. PayTR'da vade farkını zaten banka eklediği için bu %5 üstüne biner ve
> müşteri iki kez vade farkı ödemiş olur. Bunu düzeltmek için `pricing.ts`
> içinde o planın `multiplier` değerini `1` yapmanız yeterli.

**"Aylık Esnek" planı online ödemeye kapalıdır.**
Taahhütsüz, ay ay ödenen ve istenildiği ay bırakılabilen bir plan tek bir kart
çekimi olarak tahsil edilemez. `pricing.ts` içinde `onlineOdeme: false` ile
işaretli; o plan seçiliyken kayıt sayfası WhatsApp yolunu gösterir.

**Sipariş kayıtları Netlify Blobs'ta durur.**
Ayrı veritabanı gerekmez. Kayıtları görmek için Netlify CLI:
`netlify blobs:list siparisler`

**İade.**
PayTR'ın ayrı bir İade API'si var (`PayTR İade API` klasöründe). Şu an bağlı
değil — iadeler Mağaza Paneli üzerinden elle yapılır. Sözleşmedeki "ilk 2 ders
içinde koşulsuz iade" taahhüdü için bu yeterli; iade sayısı artarsa API bağlanır.

---

## Sorun giderme

| Belirti | Sebep |
|---|---|
| "Ödeme altyapısı henüz yapılandırılmadı" | `PAYTR_MERCHANT_*` değişkenleri Netlify'da tanımlı değil |
| PayTR "paytr_token gecersiz" diyor | İmzaya giren alanların sırası bozulmuş (`netlify/lib/paytr.ts` → `hashSTR`) |
| PayTR "Zorunlu alan degeri gecersiz: user_ip" | Fonksiyon müşteri IP'sini alamıyor; yerel `netlify dev` denemelerinde olur |
| İşlem "Devam Ediyor" kalıyor | Bildirim ucundan OK alınamıyor — Netlify Functions günlüğüne bakın |
| Ödeme başarılı ama e-posta gelmiyor | Netlify Forms'ta `odeme-bildirimi` formuna bildirim tanımlanmamış |
| Netlify Forms sayfası boş | Formlar deploy anında taranır — form eklendikten sonra siteyi yeniden deploy edin |
| Dekont e-postasında logo yok | PayTR Paneli → Ayarlar'dan mağaza logosu yüklenmemiş (300×100 PNG) |
| Sonuç sayfası "kesinleşmedi" diyor | Bildirim henüz ulaşmamış veya hash doğrulaması başarısız |
