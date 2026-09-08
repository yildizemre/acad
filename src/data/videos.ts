// ─────────────────────────────────────────────────────────────────────────────
// ÖĞRENCİ EKRAN KAYITLARI
//
// Buradaki dokuz kayıt öğrencilerin kendi bilgisayarlarında yaptıkları işlerden
// alınmıştır. Stok görsel, temsilî ekran veya yeniden çizim değildir.
//
// Ham kayıtlar `medya-kaynak/videolar/` altında durur (siteye çıkmaz).
// `python scripts/videolar.py` onları sessiz, 12 saniyelik, 640 piksel
// genişliğinde mp4'lere ve kapak görsellerine çevirip `public/videos/` içine
// yazar. Ölçüler aşağıda elle değil, o betiğin çıktısından alınmıştır.
//
// ⚠️  Yeni kayıt eklerken: `scripts/videolar.py` içindeki KLIPLER listesine
//     ekleyin, betiği çalıştırın, yazdığı ölçüleri buraya girin.
//
// ⚠️  Kayıtta öğrencinin adı, e-postası veya yüzü görünüyorsa yayınlamadan
//     önce veliden yazılı izin alınmalıdır.
// ─────────────────────────────────────────────────────────────────────────────

export interface StudentVideo {
  /** public/videos/<id>.mp4 ve public/videos/<id>.jpg */
  id: string;
  title: string;
  /** Kayıtta görünen program — kart üzerindeki rozet */
  tool: string;
  /** Bir cümlede ne olduğu */
  blurb: string;
  /** Kayıtta gerçekten görünen teknik ayrıntı */
  detail: string;
  /** Bu iş bir kursumuzun kapsamına giriyorsa o kursun id'si */
  courseId?: string;
  width: number;
  height: number;
}

export const STUDENT_VIDEOS: StudentVideo[] = [
  {
    id: 'unity-acik-dunya',
    title: 'Açık Dünya Oyunu',
    tool: 'Unity · C#',
    blurb: 'Element seçme ekranıyla başlayan, can göstergesi olan ve arazide dolaşılan 3B oyun.',
    detail:
      'Menüden seçilen element oyuna taşınıyor, karakter köyün çevresinde koşuyor, aldığı hasar üstteki can göstergesinden düşüyor.',
    courseId: 'unity',
    width: 640,
    height: 260,
  },
  {
    id: 'quiz-uygulamasi',
    title: 'Bilgi Yarışması Uygulaması',
    tool: 'MIT App Inventor',
    blurb: 'Android telefonda çalışan, 10 soruluk ve 30 saniye süreli bilgi yarışması.',
    detail:
      'Doğru cevap 10 puan, yanlış cevap −10. Sorular rastgele seçiliyor; ekranlar arası geçiş ve puanı taşıyan değişken blok blok kuruluyor.',
    width: 640,
    height: 320,
  },
  {
    id: 'stadyum-3b',
    title: 'Futbol Stadyumu',
    tool: 'Tinkercad · 3B tasarım',
    blurb: 'Sahası, çizgileri, tribünleri ve aydınlatma kuleleriyle sıfırdan modellenmiş stadyum.',
    detail:
      'Her şey temel şekillerden çıkıyor. Zor kısmı ölçü: tribünler sahaya göre doğru orana oturmazsa yapı bir anda oyuncak gibi duruyor.',
    width: 640,
    height: 300,
  },
  {
    id: 'bilet-uygulamasi',
    title: 'Maç Bileti Satış Uygulaması',
    tool: 'C# · Visual Studio',
    blurb: 'Maç listesi, tribüne göre fiyat tablosu, bakiye ve bilet geçmişi olan masaüstü uygulaması.',
    detail:
      'Her maçın kendi “Bilet al” düğmesi var; altı ayrı tribün kategorisinin fiyatı farklı ve alınan bilet bakiyeden düşüyor.',
    width: 640,
    height: 314,
  },
  {
    id: 'villa-3b',
    title: 'Müstakil Ev Tasarımı',
    tool: 'SketchUp · 3B tasarım',
    blurb: 'Cam cepheli iki katlı bir ev; havuzu, bahçesi ve giriş saçağıyla birlikte modellenmiş.',
    detail:
      'Duvarlar, doğramalar ve malzemeler tek tek seçiliyor; kamera model çevresinde gezdirilerek tasarımın her açıdan tutarlı durup durmadığı kontrol ediliyor.',
    width: 640,
    height: 294,
  },
  {
    id: 'unity-birinci-sahis',
    title: 'Birinci Şahıs Toplama Oyunu',
    tool: 'Unity · C#',
    blurb: 'Süre işlerken sahnede dolaşıp nesne toplanan, puanın ekranın üstünde arttığı oyun.',
    detail:
      'Sağdaki panelde öğrencinin yazdığı mouseLook.cs açık: fare hareketi Input.GetAxisRaw ile okunuyor, bakış açısı Mathf.Clamp ile sınırlanıyor ki kamera takla atmasın.',
    courseId: 'unity',
    width: 640,
    height: 342,
  },
  {
    id: 'muzik-uygulamasi',
    title: 'Müzik Çalar Uygulaması',
    tool: 'MIT App Inventor',
    blurb: 'Her şarkının kendi düğmesi olan, duraklatılıp kaldığı yerden devam eden telefon müzik çaları.',
    detail:
      'Blok tarafında her düğme Player bileşeninin kaynağını değiştirip çalmayı başlatıyor; “dur” ve “devam” düğmeleri aynı çalar üzerinde çalışıyor.',
    width: 640,
    height: 234,
  },
  {
    id: 'masaustu-sahne-3b',
    title: 'Masaüstü Makine Sahnesi',
    tool: 'Tinkercad · 3B tasarım',
    blurb: 'Ahşap masa üzerine kurulmuş, hortumlu gövdesi ve eklemli kolu olan bir makine sahnesi.',
    detail:
      'Silindir, kutu ve delik şekilleri hizalanıp gruplanarak tek parçaya dönüşüyor — karmaşık görünen nesne, basit şekillerin doğru sırayla birleşmesinden çıkıyor.',
    width: 640,
    height: 260,
  },
  {
    id: 'site-plani-3b',
    title: 'Konut Sitesi Projesi',
    tool: 'SketchUp · 3B tasarım',
    blurb: 'Blokları, çevre duvarı, otoparkı ve oyun alanı olan bir konut sitesinin kuş bakışı planı.',
    detail:
      'Burada tek bina değil yerleşim tasarlanıyor: blokların arası, yolların genişliği ve ortak alanların yeri baştan planlanmak zorunda.',
    width: 640,
    height: 278,
  },
];

export function videoById(id: string): StudentVideo | undefined {
  return STUDENT_VIDEOS.find((v) => v.id === id);
}

/** Bir kursun sayfasında gösterilebilecek kayıtlar. */
export function videosForCourse(courseId: string): StudentVideo[] {
  return STUDENT_VIDEOS.filter((v) => v.courseId === courseId);
}

/**
 * Kayıtların siteye konulduğu tarih. schema.org VideoObject `uploadDate`
 * alanını ister; buraya gerçek yayın tarihi yazılır, yeni kayıt eklendikçe
 * güncellenir.
 */
export const VIDEOS_PUBLISHED = '2026-09-09';
