// ─────────────────────────────────────────────────────────────────────────────
// ONLINE ÖDEME BAYRAĞI
//
// Ödeme sağlayıcısı (iyzico / PayTR) bağlanana kadar kayıt akışı WhatsApp
// üzerinden yürüyor. Entegrasyon tamamlandığında .env dosyasına
//
//   VITE_PAYMENT_ONLINE=true
//
// eklemek yeterli — kayıt özeti sayfası otomatik olarak ödeme adımına geçer.
// Adım adım yapılacaklar: docs/ODEME-ENTEGRASYONU.md
//
// ⚠️ Sağlayıcı API anahtarları ASLA bu dosyaya veya herhangi bir VITE_ değişkenine
//    yazılmaz — tarayıcıya sızar. Anahtarlar yalnızca sunucu tarafında durur.
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_ONLINE = import.meta.env.VITE_PAYMENT_ONLINE === 'true';
