# Online ödeme entegrasyonu

Bugün kayıt akışı şöyle işliyor:

```
/fiyatlar  →  /kayit  →  sipariş özeti WhatsApp'a yazılı gider  →  manuel tahsilat
```

`/kayit` sayfası kurs, paket ve ödeme planını alıp toplam tutarı hesaplıyor ve
seçimi eksiksiz bir mesaj hâlinde WhatsApp'a aktarıyor. Yani veliye hiçbir şey
iki kez sordurulmuyor — sadece tahsilat elle yapılıyor.

Aşağıdaki adımlar tamamlandığında aynı sayfa otomatik olarak gerçek ödeme
adımına geçer. **Kod tarafında değişmesi gereken tek şey bir bayrak.**

> **Uyarı — bu iş test edilmeden yayına alınmamalı.** Ödeme entegrasyonu para
> hareketi içerir; sağlayıcının sandbox (test) ortamında uçtan uca denenmeden
> canlıya alınmamalıdır. Bu dosya yol haritasıdır, çalışan entegrasyon değildir.

---

## 1. Sağlayıcı seçimi

| | iyzico | PayTR |
|---|---|---|
| Kurulum zorluğu | Orta — dokümantasyonu iyi | Kolay — hazır iFrame |
| Taksit desteği | Var, banka bazlı | Var, banka bazlı |
| Komisyon | Sözleşmeye göre | Sözleşmeye göre |
| Test ortamı | Var | Var |

Sitede anlattığımız **3/6/9 taksit faizsiz** yapısı için sağlayıcıyla
yapacağınız sözleşmede taksit komisyonunu kimin üstlendiği netleşmeli. Faizsiz
taksitte komisyonu satıcı öder; bu maliyet fiyatlandırmaya yansıtılmalı.

## 2. Anahtarlar nereye konur

**Kritik:** API anahtarları `VITE_` ile başlayan hiçbir değişkene yazılmaz.
Vite bu değişkenleri derleme sırasında tarayıcıya gömer; anahtarınız herkese
açık hâle gelir.

Anahtarlar yalnızca sunucu tarafında durur. Bu proje Netlify'da yayınlandığı
için doğru yer Netlify Functions:

```
Netlify Dashboard → Site configuration → Environment variables
  IYZICO_API_KEY      = ...
  IYZICO_SECRET_KEY   = ...
  IYZICO_BASE_URL     = https://sandbox-api.iyzipay.com   (test)
```

## 3. Yapılacaklar

1. **Sunucu fonksiyonu yazılır** — `netlify/functions/create-payment.ts`
   - İstemciden gelen `{ courseId, tierId, planId }` alınır
   - **Tutar sunucuda yeniden hesaplanır.** İstemciden gelen tutara asla
     güvenilmez; `src/data/pricing.ts` içindeki `priceFor` / `totalFor`
     fonksiyonları burada tekrar çalıştırılır.
   - Sağlayıcıya ödeme oturumu açılır, dönen ödeme sayfası adresi istemciye verilir

2. **Geri dönüş (callback) fonksiyonu yazılır** — `netlify/functions/payment-callback.ts`
   - Sağlayıcının imzası doğrulanır
   - Başarılıysa kayıt oluşturulur ve veliye e-posta gider
   - Kullanıcı `/kayit/tamam` veya `/kayit/hata` sayfasına yönlendirilir

3. **Sözleşme metinleri hazırlanır** — mesafeli satış sözleşmesi ve ön
   bilgilendirme formu yasal zorunluluk. Ödeme öncesi onay kutusu gerekir.
   İade politikası zaten `/fiyatlar#iade` adresinde yazılı.

4. **Test ortamında uçtan uca denenir** — başarılı ödeme, başarısız ödeme,
   3D Secure iptali, taksitli ödeme, iade senaryosu.

5. **Bayrak açılır:**
   ```
   VITE_PAYMENT_ONLINE=true
   ```
   `/kayit` sayfası bu bayrağı görünce WhatsApp aktarımı yerine ödeme adımını
   gösterir. Bkz. [`src/lib/payment.ts`](../src/lib/payment.ts) ve
   [`src/pages/CheckoutPage.tsx`](../src/pages/CheckoutPage.tsx).

## 4. Dokunulacak dosyalar

| Dosya | Ne yapılacak |
|---|---|
| `src/lib/payment.ts` | Bayrak zaten hazır, değişiklik gerekmez |
| `src/pages/CheckoutPage.tsx` | `PAYMENT_ONLINE` dalındaki devre dışı düğme, fonksiyonu çağıracak şekilde bağlanır |
| `netlify/functions/create-payment.ts` | Yeni — ödeme oturumu açar |
| `netlify/functions/payment-callback.ts` | Yeni — sonucu doğrular |
| `src/data/pricing.ts` | Değişiklik gerekmez; sunucu da bu dosyadan okur |

## 5. Fiyat mantığı tek yerde

`src/data/pricing.ts` hem arayüzün hem de sunucunun tek doğru kaynağıdır.
Fiyat değişikliği yalnızca bu dosyada yapılır; kayıt sayfası, kurs sayfaları,
hesaplayıcı ve ödeme fonksiyonu aynı rakamı okur.

---

## Rezervasyon takvimi (cal.com)

Ödemeden bağımsız, çok daha hızlı bir kazanım:

1. cal.com üzerinde ücretsiz hesap açın
2. "Deneme Dersi" adında 60 dakikalık bir etkinlik oluşturun
3. Eğitmen takvimlerini bağlayın ve uygun saat aralıklarını tanımlayın
4. `.env` dosyasına ekleyin:
   ```
   VITE_CAL_LINK=hypeacademia/deneme-dersi
   ```

Bayrak açılınca `/iletisim` sayfasında formun üstünde takvim belirir; veli
saat seçer, onay e-postası anında gider. Boş bırakılırsa sayfa bugünkü form
akışıyla çalışmaya devam eder.
