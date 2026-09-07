// ─────────────────────────────────────────────────────────────────────────────
// VELİ YORUMLARI
//
// Bu dizi BİLEREK BOŞ bırakıldı. Uydurma yorum koymuyoruz: bir veli gerçek
// olup olmadığını sorduğunda cevap verebilmek gerekiyor, ayrıca sahte yorum
// tespit edildiğinde markaya verdiği zarar hiçbir dönüşümü karşılamıyor.
//
// Dizi boşken sitede yorum bölümü yerine "Yazılı Taahhütlerimiz" bölümü
// görünür — bu bölüm doğrulanabilir sözlerden oluşur ve sahte yorumdan daha
// ikna edicidir.
//
// GERÇEK YORUM EKLEMEK İÇİN
//   1. Veliden yazılı izin alın (adının ve çocuğunun yaşının yayınlanması için)
//   2. Aşağıya ekleyin — bölüm otomatik olarak yorumları göstermeye başlar
//   3. Fotoğraf yoksa `photo` alanını boş bırakın; baş harfler kullanılır
//
// İpucu: en ikna edici yorumlar övgü değil, DEĞİŞİM anlatanlardır.
// "Çok memnunuz" zayıf; "eskiden sadece oynuyordu, şimdi kendi oyununu
// yapıyor" güçlüdür.
// ─────────────────────────────────────────────────────────────────────────────

export interface Testimonial {
  quote: string;
  /** Veli adı — izin alınmadıysa yayınlamayın */
  name: string;
  /** "Kerem'in annesi · 13 yaş" */
  role: string;
  /** Aldığı kurs */
  course: string;
  /** public/ altındaki fotoğraf yolu — yoksa baş harfler gösterilir */
  photo?: string;
  /** Video yorum varsa bağlantısı */
  videoUrl?: string;
}

export const TESTIMONIALS: Testimonial[] = [];

export const HAS_TESTIMONIALS = TESTIMONIALS.length > 0;

// ─── Yazılı taahhütler ───────────────────────────────────────────────────────
// Yorum yokken bu bölüm gösterilir. Her madde doğrulanabilir ve sitenin başka
// bir yerinde de yazılı — yani kontrol edilebilir bir söz.

export interface Commitment {
  n: string;
  title: string;
  detail: string;
  /** Sözün sitede nerede yazılı olduğunu gösteren bağlantı */
  proofLabel?: string;
  proofTo?: string;
}

export const COMMITMENTS: Commitment[] = [
  {
    n: '01',
    title: 'Sınıf mevcudunu sayıyla veriyoruz',
    detail:
      'Kulüp paketinde en fazla 8, Atölye paketinde en fazla 4 öğrenci. "Küçük gruplar" gibi belirsiz bir ifade kullanmıyoruz; sayı sözleşmede yazılı.',
    proofLabel: 'Paket detayları',
    proofTo: '/fiyatlar',
  },
  {
    n: '02',
    title: 'Müfredatı kayıt olmadan gösteriyoruz',
    detail:
      'Hangi hafta ne işleneceği, hangi projenin çıkacağı ve kurs sonunda elinde ne kalacağı sitede açık. Kayıt sonrası sürpriz içerik yok.',
    proofLabel: 'Haftalık müfredatlar',
    proofTo: '/kurslar',
  },
  {
    n: '03',
    title: 'Fiyatı sitede yazıyoruz',
    detail:
      'Fiyat öğrenmek için form doldurup beklemeniz gerekmiyor. Üç paket, altı ödeme planı ve bütün indirimler açık; sonradan çıkan ek ücret yok.',
    proofLabel: 'Fiyatlar ve hesaplayıcı',
    proofTo: '/fiyatlar#hesaplayici',
  },
  {
    n: '04',
    title: 'İlk iki ders içinde koşulsuz iade',
    detail:
      'Beğenmezseniz gerekçe sormadan ödemenin tamamını iade ediyoruz. Bu bir kampanya değil, yazılı politika.',
    proofLabel: 'İade politikası',
    proofTo: '/fiyatlar#iade',
  },
  {
    n: '05',
    title: 'Her ders kaydedilir, 12 ay erişilebilir',
    detail:
      'Çocuğunuz hasta olduğu haftayı kaybetmez. Siz de dersin gerçekte nasıl geçtiğini istediğiniz zaman izleyebilirsiniz.',
  },
  {
    n: '06',
    title: 'Ayda bir yazılı gelişim raporu',
    detail:
      '"İyi gidiyor" demiyoruz. Neyi yaptı, nerede zorlandı, sonraki ay ne hedefleniyor — yazılı olarak gönderiyoruz. Dönem ortasında birebir görüşme yapıyoruz.',
  },
  {
    n: '07',
    title: 'Kaçırılan ders için telafi hakkı',
    detail:
      'Dönem başına iki telafi hakkınız var. En az 24 saat önce bildirirseniz dersi başka bir gruba veya telafi saatine alıyoruz.',
    proofLabel: 'Sık sorulan sorular',
    proofTo: '/sss',
  },
  {
    n: '08',
    title: 'Sertifika E-Devlet üzerinden doğrulanabilir',
    detail:
      'Kurs sonunda verilen tamamlama sertifikası öğrencinin adına düzenlenir ve resmî olarak doğrulanabilir. Duvara asılan bir kâğıttan ibaret değil.',
  },
];
