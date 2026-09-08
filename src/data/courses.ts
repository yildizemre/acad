// ─────────────────────────────────────────────────────────────────────────────
// KURS KATALOĞU
//
// Sitedeki tek doğru kaynak. Kurs kartları, kurs detay sayfaları, yaş filtresi,
// fiyat hesaplayıcı ve schema.org verisi hepsi bu dosyadan beslenir.
//
// Her kursun haftalık müfredatı gerçek ders planıdır: veli "ne öğrenecek?"
// sorusunun cevabını rakamla ve proje adıyla görür.
// ─────────────────────────────────────────────────────────────────────────────

export type Level = 'Başlangıç' | 'Orta' | 'İleri';

export interface Week {
  week: number;
  title: string;
  topics: string[];
  /** O hafta bitiminde öğrencinin elinde kalan somut çıktı */
  project: string;
}

export interface CourseFaq {
  q: string;
  a: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  /** Kart üzerinde ve menüde kullanılan kısa ad */
  shortTitle: string;
  /** lucide-react ikon adı — bileşende eşlenir */
  icon: string;
  ageMin: number;
  ageMax: number;
  ageRange: string;
  level: Level;
  weeks: number;
  lessonsPerWeek: number;
  lessonMinutes: number;
  maxStudents: number;
  /**
   * Bu kursun paket fiyatına eklenen fark, TL.
   *
   * Paket fiyatı (Kulüp / Atölye / Birebir) ders formatına göre belirlenir;
   * bu alan kursun kendi maliyetini üstüne ekler — donanım seti, lisans,
   * daha küçük sınıf, daha uzun ders gibi. Girilmezse fark yoktur.
   */
  priceExtra?: number;
  students: string;
  rating: string;
  tag?: string;
  /** Kartın zemin rengi — her kursun kendi kimliği olsun diye */
  tint: 'peach' | 'rose' | 'lime' | 'sky' | 'lilac' | 'mint';
  image: string;
  /** Kart üzerindeki tek cümlelik özet */
  summary: string;
  /** Detay sayfasındaki giriş paragrafı */
  intro: string;
  /** Veliye doğrudan hitap eden açıklama — "bu kurs çocuğuma ne katar?" */
  parentNote: string;
  prerequisites: string;
  requirements: string[];
  tools: string[];
  gains: string[];
  curriculum: Week[];
  finalProject: string;
  /** Bu kurstan sonra önerilen kurs id'si */
  nextCourseId?: string;
  faq: CourseFaq[];
}

export const COURSES: Course[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'scratch',
    slug: 'scratch-ile-oyun-gelistirme',
    title: 'Scratch ile Oyun Geliştirme',
    shortTitle: 'Scratch',
    icon: 'Gamepad2',
    ageMin: 8,
    ageMax: 12,
    ageRange: '8–12 Yaş',
    level: 'Başlangıç',
    weeks: 8,
    lessonsPerWeek: 2,
    lessonMinutes: 60,
    maxStudents: 8,
    students: '320',
    rating: '4.9',
    tag: 'En Popüler',
    tint: 'peach',
    image: '/images/kurs-scratch.svg',
    summary:
      'Blok tabanlı görsel kodlamayla kendi oyunlarını sıfırdan yapar. Kod yazmayı bilmeye gerek yok.',
    intro:
      'Scratch, MIT tarafından çocuklar için geliştirilmiş görsel programlama dilidir. Öğrenci klavyeden kod yazmaz; renkli blokları sürükleyip birleştirir. Ama arkada öğrendiği şey gerçek programlamanın ta kendisidir: döngüler, koşullar, değişkenler, olaylar. Bu 8 hafta bittiğinde çocuğunuz oynanabilir, paylaşılabilir oyunlar yapmış olur.',
    parentNote:
      'Bu kurs bir "bilgisayar oyunu oynama" kursu değil, tam tersi: çocuğunuz oyunun tüketicisi olmaktan çıkıp üreticisi oluyor. İlk oyununu bitirdiği gün yaşadığı "bunu ben yaptım" duygusu, sonraki tüm teknik derslere karşı tutumunu belirliyor.',
    prerequisites:
      'Ön koşul yok. Fare kullanabilen ve okuma yazma bilen her çocuk katılabilir.',
    requirements: [
      'İnternet bağlantısı olan bilgisayar veya dizüstü (tablet önerilmez — sürükle bırak zorlaşır)',
      'Kamera ve mikrofon',
      'Chrome veya Edge tarayıcı',
      'Kurulum gerekmez, her şey tarayıcıda çalışır',
    ],
    tools: ['Scratch 3.0', 'Zoom / Google Meet', 'Hype Academia Öğrenci Paneli'],
    gains: [
      'Mantıksal düşünme ve problem çözme becerisi kalıcı olarak gelişir',
      'İlk dijital oyununu sıfırdan yaparak özgüveni belirgin şekilde artar',
      'Bir problemi küçük adımlara bölmeyi öğrenir — bu beceri matematiğe de yansır',
      'Algoritmik düşünmeye erken yaşta alışır, sonraki tüm dersler kolaylaşır',
      'Hata yapmayı öğrenme sürecinin parçası olarak görmeye başlar',
      'Soyut fikrini ekranda hayata geçirir ve arkadaşlarıyla paylaşır',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Scratch Dünyasına Giriş',
        topics: [
          'Scratch arayüzü: sahne, kuklalar ve blok paleti',
          'İlk hareket komutları ve blokları birleştirme',
          'Kukla ekleme, silme, boyutlandırma',
          'Projeyi kaydetme ve paylaşma',
        ],
        project: 'Karakterini hareket ettirdiğin ilk mini sahne',
      },
      {
        week: 2,
        title: 'Hareket, Yön ve Olaylar',
        topics: [
          'Koordinat sistemi (x, y) ve yön kavramı',
          'Klavye ve fare olayları: tuşa basılınca, tıklanınca',
          'Kuklayı klavyeyle kontrol etme',
          'Sahne sınırlarında sekme',
        ],
        project: 'Ok tuşlarıyla kontrol edilen uzay gemisi',
      },
      {
        week: 3,
        title: 'Döngüler — Tekrarın Gücü',
        topics: [
          'Sürekli tekrarla ve x kez tekrarla blokları',
          'İç içe döngüler',
          'Kalem bloklarıyla geometrik desen çizimi',
          'Döngüyle animasyon üretme',
        ],
        project: 'Kalemle kar tanesi ve spiral desen çizen program',
      },
      {
        week: 4,
        title: 'Koşullar ve Karar Verme',
        topics: [
          'Eğer / eğer-değilse blokları',
          'Renge ve kuklaya değme algılama',
          'Mantıksal operatörler: ve, veya, değil',
          'Oyun kaybetme koşulu kurma',
        ],
        project: 'Duvara değince kaybettiğin labirent oyunu',
      },
      {
        week: 5,
        title: 'Değişkenler, Skor ve Can',
        topics: [
          'Değişken oluşturma ve değer değiştirme',
          'Skor, can ve sayaç mekanikleri',
          'Zamanlayıcı kullanımı',
          'Zorluk seviyesini değişkenle ayarlama',
        ],
        project: 'Puan ve can barı olan elma toplama oyunu',
      },
      {
        week: 6,
        title: 'Kılık, Ses ve Sahne Tasarımı',
        topics: [
          'Kostüm değiştirerek yürüme animasyonu',
          'Ses ekleme, kaydetme ve efektler',
          'Sahne (arka plan) geçişleri',
          'Karakterler arası mesajlaşma (yayın blokları)',
        ],
        project: 'Sahneler arası geçen, sesli animasyonlu kısa hikâye',
      },
      {
        week: 7,
        title: 'Klonlar ve Gelişmiş Oyun Mekanikleri',
        topics: [
          'Klon üretme ve klon silme',
          'Düşman dalgaları ve mermi sistemi',
          'Rastgelelik ile tahmin edilemez oyun',
          'Oyun menüsü ve başlangıç ekranı',
        ],
        project: 'Düşman dalgaları olan uzay savaşı oyunu',
      },
      {
        week: 8,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Kendi oyun fikrini planlama ve taslak çıkarma',
          'Projeyi adım adım inşa etme ve test etme',
          'Arkadaşlarına oynatıp geri bildirimle düzeltme',
          'Scratch topluluğunda yayınlama',
        ],
        project: 'Tamamen kendi fikrin olan, yayınlanmış oyun',
      },
    ],
    finalProject:
      'Öğrenci kendi seçtiği oyun fikrini baştan sona tasarlar, kodlar, test eder ve Scratch topluluğunda yayınlar. Demo Günü’nde ailesine ve sınıfına canlı olarak sunar.',
    nextCourseId: 'python',
    faq: [
      {
        q: 'Çocuğum hiç kod yazmadı, zorlanır mı?',
        a: 'Hayır. Scratch tam olarak bunun için tasarlandı — klavyeden kod yazılmaz, bloklar sürüklenir. Sınıfın tamamı sıfırdan başlar.',
      },
      {
        q: 'İngilizce bilmesi gerekiyor mu?',
        a: 'Hayır. Scratch tamamen Türkçe kullanılabiliyor ve derslerimiz Türkçe işleniyor.',
      },
      {
        q: 'Kurs bitince ne yapabilir?',
        a: 'Kendi oyununu tasarlayıp kodlayabilir ve yayınlayabilir. Sonraki adım genellikle 11 yaşından itibaren Python Programlama kursudur.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'python',
    slug: 'python-programlama',
    title: 'Python Programlama',
    shortTitle: 'Python',
    icon: 'Code2',
    ageMin: 11,
    ageMax: 15,
    ageRange: '11–15 Yaş',
    level: 'Orta',
    weeks: 8,
    lessonsPerWeek: 2,
    lessonMinutes: 60,
    maxStudents: 8,
    // Ek: Python geliştirme ortamı ve bireysel kod incelemesi
    priceExtra: 1500,
    students: '280',
    rating: '4.8',
    tag: 'Yeni Dönem',
    tint: 'sky',
    image: '/images/kurs-python.svg',
    summary:
      'Gerçek yazılımcıların kullandığı dille tanışır. Bloklardan klavyeye geçişin ilk adımı.',
    intro:
      'Python, Google’dan NASA’ya kadar her yerde kullanılan, dünyanın en yaygın programlama dillerinden biri. Aynı zamanda okunabilirliği sayesinde öğrenmesi en kolay dil. Bu kurs, blok tabanlı kodlamadan gerçek metin tabanlı programlamaya geçişi mümkün olan en yumuşak şekilde yapar: her hafta çalışan bir program çıkar, hiçbir hafta teoriyle geçmez.',
    parentNote:
      'Bu, çocuğunuzun "oyun yapıyorum" aşamasından "yazılım yazıyorum" aşamasına geçtiği kurs. Python aynı zamanda ilerideki yapay zeka, veri bilimi ve otomasyon derslerinin de temeli — yani buraya yatırılan 8 hafta, sonraki her şeyin altyapısı oluyor.',
    prerequisites:
      'Klavyeyi rahat kullanabilmek yeterli. Scratch deneyimi avantaj sağlar ama şart değildir.',
    requirements: [
      'İnternet bağlantısı olan bilgisayar (Windows, macOS veya Linux)',
      'Kamera ve mikrofon',
      'Program kurulumu için yönetici izni (ilk derste birlikte kurulur)',
      'Tercihen harici klavye',
    ],
    tools: ['Python 3', 'Visual Studio Code', 'Thonny (ilk haftalar)', 'Turtle grafik kütüphanesi'],
    gains: [
      'Gerçek bir programlama dilinde kendi başına program yazabilir hâle gelir',
      'Hata mesajını okumayı ve hatayı kendi bulmayı öğrenir — en değerli mühendislik becerisi',
      'Matematiksel düşünme ile kod arasındaki bağı somut olarak kurar',
      'Bir problemi fonksiyonlara bölerek çözmeyi öğrenir',
      'Yapay zeka, veri bilimi ve otomasyon için gereken temeli edinir',
      'Kendi yazdığı programı başkasının kullanabileceği hâle getirmeyi öğrenir',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Metin Tabanlı Kodlamaya Geçiş',
        topics: [
          'Python nedir, nerede kullanılır',
          'Geliştirme ortamının kurulumu',
          'print() ile ekrana yazdırma, yorum satırları',
          'İlk hata mesajları ve nasıl okunur',
        ],
        project: 'Kendini tanıtan, biçimlendirilmiş çıktı veren ilk program',
      },
      {
        week: 2,
        title: 'Değişkenler ve Veri Tipleri',
        topics: [
          'Sayılar, metinler, mantıksal değerler',
          'input() ile kullanıcıdan veri alma',
          'Tip dönüşümleri ve sık yapılan hatalar',
          'Matematiksel operatörler ve öncelik sırası',
        ],
        project: 'Kullanıcıdan veri alan bilimsel hesap makinesi',
      },
      {
        week: 3,
        title: 'Koşullar ve Karar Yapıları',
        topics: [
          'if / elif / else yapısı',
          'Karşılaştırma ve mantıksal operatörler',
          'İç içe koşullar',
          'Girinti (indentation) kuralı ve önemi',
        ],
        project: 'İpucu veren sayı tahmin oyunu',
      },
      {
        week: 4,
        title: 'Döngüler',
        topics: [
          'for döngüsü ve range()',
          'while döngüsü ve sonsuz döngü tehlikesi',
          'break ve continue',
          'Döngüyle desen ve tablo üretme',
        ],
        project: 'Çarpım tablosu üreteci ve basit şifre deneme programı',
      },
      {
        week: 5,
        title: 'Listeler ve Sözlükler',
        topics: [
          'Liste oluşturma, ekleme, silme, sıralama',
          'İndeksleme ve dilimleme',
          'Sözlükler: anahtar–değer mantığı',
          'Veri yapısında döngüyle gezinme',
        ],
        project: 'Kelime ve anlamlarını tutan sözlük uygulaması',
      },
      {
        week: 6,
        title: 'Fonksiyonlar ve Modüler Kod',
        topics: [
          'def ile fonksiyon tanımlama',
          'Parametre ve return değeri',
          'Kod tekrarından kurtulma',
          'random, time ve math modülleri',
        ],
        project: 'Fonksiyonlara bölünmüş zar oyunu ve istatistik hesabı',
      },
      {
        week: 7,
        title: 'Dosya İşlemleri ve Hata Yönetimi',
        topics: [
          'Dosya okuma ve yazma',
          'try / except ile hata yakalama',
          'Program kapansa bile kaybolmayan veri',
          'Kullanıcı hatalarına karşı programı sağlamlaştırma',
        ],
        project: 'Skorları kalıcı olarak kaydeden oyun',
      },
      {
        week: 8,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Proje fikrini seçme ve planlama',
          'Turtle ile grafik veya konsol uygulaması geliştirme',
          'Kod düzenleme ve yorum ekleme',
          'Projeyi sunma ve savunma',
        ],
        project: 'Kendi seçtiğin konuda çalışan Python uygulaması',
      },
    ],
    finalProject:
      'Öğrenci; hesaplama aracı, metin tabanlı oyun veya Turtle ile grafik uygulama seçeneklerinden birini seçip baştan sona geliştirir. Kodun tamamını satır satır açıklayarak Demo Günü’nde sunar.',
    nextCourseId: 'ai',
    faq: [
      {
        q: 'Scratch bilmeden Python’a başlanabilir mi?',
        a: 'Evet. 11 yaş ve üzeri, klavyeyi rahat kullanabilen öğrenciler doğrudan başlayabilir. Scratch geçmişi varsa ilk iki hafta daha hızlı geçer.',
      },
      {
        q: 'İngilizce şart mı?',
        a: 'Değil. Komutlar İngilizce kelimelerden oluşuyor ama bunlar 20–30 kelimelik sabit bir liste; ders anlatımı tamamen Türkçe.',
      },
      {
        q: 'Bilgisayara program kuracak mıyız?',
        a: 'Evet, Python ve VS Code kuruyoruz. İlk derste eğitmenimiz ekran paylaşımıyla adım adım birlikte kuruyor, tek başınıza uğraşmıyorsunuz.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'web',
    slug: 'web-tasarim-ve-gelistirme',
    title: 'Web Tasarım & Geliştirme',
    shortTitle: 'Web Geliştirme',
    icon: 'Globe',
    ageMin: 12,
    ageMax: 17,
    ageRange: '12–17 Yaş',
    level: 'Orta',
    weeks: 10,
    lessonsPerWeek: 2,
    lessonMinutes: 60,
    maxStudents: 8,
    // Ek: yayına alınan site için alan adı ve barındırma
    priceExtra: 1500,
    students: '215',
    rating: '4.9',
    tint: 'lime',
    image: '/images/kurs-web.svg',
    summary:
      'HTML, CSS, JavaScript ve React ile internette gerçekten yayında olan siteler yapar.',
    intro:
      'Bu kursun çıktısı ekranda kalan bir alıştırma değil; internette herkesin girebileceği, kendi adresine sahip gerçek bir web sitesi. Öğrenci sıfırdan başlar, 10 hafta sonunda kendi portfolyo sitesini yayına alır ve linkini paylaşabilir. Kullandığımız araçlar profesyonel yazılımcıların bugün kullandığı araçların aynısıdır.',
    parentNote:
      'Web geliştirme, çocuğunuzun yaptığı işi gösterebildiği tek alan — bir Python programını göstermek zordur ama bir web sitesinin linkini herkese verebilir. Bu görünürlük motivasyonu ciddi şekilde besliyor. Ayrıca lise çağında freelance iş yapılabilen ilk beceri alanı budur.',
    prerequisites:
      'Ön koşul yok. Dosya klasör mantığını bilen ve klavyeyi kullanabilen her öğrenci başlayabilir.',
    requirements: [
      'İnternet bağlantısı olan bilgisayar',
      'Kamera ve mikrofon',
      'Chrome tarayıcı (geliştirici araçları için)',
      'Ücretsiz GitHub ve Netlify hesabı (derste birlikte açılır)',
    ],
    tools: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git & GitHub', 'Netlify', 'VS Code', 'Figma'],
    gains: [
      'İnternette yayında olan, linkini paylaşabildiği kendi sitesine sahip olur',
      'Tasarım ile kodu birlikte düşünmeyi öğrenir — görsel zevk ve teknik beceri aynı anda gelişir',
      'Mobil uyumlu düşünmeyi öğrenir; her ekranı hesaba katar',
      'Git ve GitHub ile profesyonel çalışma alışkanlığı kazanır',
      'Portfolyo oluşturur — üniversite başvurusu ve staj için somut kanıt',
      'Lise çağında gelir getirebilecek ilk mesleki beceriyi edinir',
    ],
    curriculum: [
      {
        week: 1,
        title: 'İnternet Nasıl Çalışır & HTML Temelleri',
        topics: [
          'Tarayıcı, sunucu ve alan adı ilişkisi',
          'HTML belge yapısı ve etiket mantığı',
          'Başlıklar, paragraflar, bağlantılar',
          'Geliştirici araçlarıyla siteleri inceleme',
        ],
        project: 'İlk HTML sayfan — kendi tanıtım sayfan',
      },
      {
        week: 2,
        title: 'HTML ile Yapı Kurmak',
        topics: [
          'Listeler, tablolar, görseller, videolar',
          'Formlar ve giriş alanları',
          'Semantik etiketler (header, nav, main, footer)',
          'Erişilebilirlik temelleri',
        ],
        project: 'Çok bölümlü, formu olan tanıtım sayfası',
      },
      {
        week: 3,
        title: 'CSS ile Görsel Tasarım',
        topics: [
          'Seçiciler, renkler, tipografi',
          'Kutu modeli: margin, padding, border',
          'Arka planlar, gölgeler, köşe yuvarlama',
          'Renk paleti ve yazı tipi seçme prensipleri',
        ],
        project: 'Baştan aşağı tasarlanmış tek sayfalık site',
      },
      {
        week: 4,
        title: 'Flexbox ile Düzen',
        topics: [
          'Flex konteyner ve elemanlar',
          'Yatay ve dikey hizalama',
          'Kart ve menü tasarımları',
          'Boşluk yönetimi ve görsel hiyerarşi',
        ],
        project: 'Kart ızgarası olan ürün tanıtım sayfası',
      },
      {
        week: 5,
        title: 'Responsive Tasarım',
        topics: [
          'CSS Grid ile iki boyutlu düzen',
          'Media query ile ekrana göre uyarlama',
          'Mobil öncelikli tasarım yaklaşımı',
          'Mobil menü tasarımı',
        ],
        project: 'Telefonda da bilgisayarda da düzgün görünen site',
      },
      {
        week: 6,
        title: 'JavaScript Temelleri',
        topics: [
          'Değişkenler, fonksiyonlar, diziler',
          'Koşullar ve döngüler',
          'Konsol ile hata ayıklama',
          'Olay dinleyicileri (event listener)',
        ],
        project: 'Tıklanınca tepki veren etkileşimli sayfa',
      },
      {
        week: 7,
        title: 'DOM ile Sayfayı Canlandırma',
        topics: [
          'Elemanları seçme ve değiştirme',
          'Dinamik içerik ekleme ve silme',
          'Form doğrulama',
          'localStorage ile veri saklama',
        ],
        project: 'Verileri kaybolmayan yapılacaklar listesi uygulaması',
      },
      {
        week: 8,
        title: "React'e Giriş",
        topics: [
          'Bileşen (component) mantığı',
          'props ile veri aktarımı',
          'useState ile durum yönetimi',
          'Listeleri render etme',
        ],
        project: 'React ile yazılmış filtrelenebilir kart galerisi',
      },
      {
        week: 9,
        title: 'Git, GitHub ve Yayınlama',
        topics: [
          'Sürüm kontrolü neden gerekli',
          'commit, push ve depo yönetimi',
          'Netlify ile canlıya alma',
          'Alan adı bağlama ve temel SEO',
        ],
        project: 'İnternette yayında olan, linki paylaşılabilir site',
      },
      {
        week: 10,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Kendi portfolyo sitesini tasarlama',
          'Figma’da taslak çizme',
          'Kodlama, test ve mobil kontrol',
          'Yayına alma ve sunum',
        ],
        project: 'Yayında olan kişisel portfolyo siten',
      },
    ],
    finalProject:
      'Öğrenci kendi kişisel portfolyo sitesini tasarlar, kodlar ve gerçek bir adres altında yayına alır. Site öğrencinin tüm projelerini barındırır ve kurs bittikten sonra da güncellenebilir kalır.',
    nextCourseId: 'unity',
    faq: [
      {
        q: 'Site gerçekten internette yayında mı olacak?',
        a: 'Evet. 9. haftada Netlify üzerinden canlıya alıyoruz ve öğrenci linki herkesle paylaşabiliyor. Site kurs bittikten sonra da öğrencinin kendi hesabında kalır.',
      },
      {
        q: 'Tasarım yeteneği gerekiyor mu?',
        a: 'Gerekmiyor. Renk, yazı tipi ve boşluk kullanımını kurallarıyla öğretiyoruz; tasarım burada yetenek değil öğrenilebilir bir sistem.',
      },
      {
        q: 'React 12 yaş için ağır değil mi?',
        a: '8. haftaya kadar HTML, CSS ve JavaScript sağlam oturuyor. React’i sadece temel seviyede, bileşen mantığını göstermek için işliyoruz; ileri konulara girmiyoruz.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'unity',
    slug: 'unity-ile-oyun-gelistirme',
    title: 'Unity ile Oyun Geliştirme',
    shortTitle: 'Unity',
    icon: 'Joystick',
    ageMin: 13,
    ageMax: 17,
    ageRange: '13–17 Yaş',
    level: 'İleri',
    weeks: 10,
    lessonsPerWeek: 2,
    lessonMinutes: 75,
    maxStudents: 6,
    // Ek: 6 kişilik sınıf ve 75 dakikalık ders
    priceExtra: 1500,
    students: '190',
    rating: '5.0',
    tag: 'Favori',
    tint: 'lilac',
    image: '/images/kurs-unity.svg',
    summary:
      'Profesyonel oyun motoruyla C# yazarak 2D ve 3D oyunlar geliştirir, yayınlar.',
    intro:
      'Unity, dünyadaki mobil oyunların yarısından fazlasının yapıldığı profesyonel oyun motoru. Bu kurs bir simülasyon değil: öğrenci sektörde kullanılan aracın aynısını, sektörde kullanılan dilin (C#) aynısını kullanır. 10 hafta sonunda oyunu itch.io üzerinde yayınlanır ve herkes tarayıcıdan oynayabilir.',
    parentNote:
      'Oyun oynamayı seven çocuklar için en güçlü motivasyon köprüsü budur. Ama kursun kazandırdığı şey oyunla sınırlı değil: C# ciddi bir kurumsal yazılım dili, 3B matematik ve fizik gerçek mühendislik konuları. Öğrenci eğlendiğini sanırken lise üstü seviyede konularla çalışıyor.',
    prerequisites:
      'Temel programlama deneyimi gerekir. Python veya Web kursunu tamamlamış olmak ideal; en azından değişken, döngü ve fonksiyon kavramlarını bilmek şart.',
    requirements: [
      'En az 8 GB RAM ve ayrı ekran kartı olan bilgisayar (Unity ağır bir programdır)',
      'En az 20 GB boş disk alanı',
      'Windows 10/11 veya macOS',
      'Kamera, mikrofon ve tercihen mouse',
    ],
    tools: ['Unity 6', 'C#', 'Visual Studio', 'Blender (temel)', 'Git', 'itch.io'],
    gains: [
      'Sektörde kullanılan gerçek oyun motorunu ve C# dilini öğrenir',
      'Fizik, vektör ve koordinat matematiğini uygulayarak kavrar',
      'Yayınlanmış, oynanabilir bir oyunu portfolyosuna ekler',
      'Nesne yönelimli programlamayı somut örneklerle öğrenir',
      'Büyük bir projeyi planlama ve bitirme disiplinini kazanır',
      'Oyun tasarımı, denge ve kullanıcı deneyimi üzerine düşünmeyi öğrenir',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Unity Arayüzü ve 3B Dünya',
        topics: [
          'Unity kurulumu ve proje oluşturma',
          'Sahne, Hierarchy, Inspector panelleri',
          'GameObject ve Component mantığı',
          'Transform: konum, dönüş, ölçek',
        ],
        project: 'Nesnelerle dolu, gezilebilir ilk 3B sahne',
      },
      {
        week: 2,
        title: 'C# Programlama Temelleri',
        topics: [
          'MonoBehaviour ve script yaşam döngüsü',
          'Start() ve Update() metotları',
          'Değişkenler, metotlar, sınıflar',
          "Inspector'dan değer düzenleme",
        ],
        project: 'Kod ile dönen ve hareket eden nesneler',
      },
      {
        week: 3,
        title: 'Fizik ve Karakter Hareketi',
        topics: [
          'Rigidbody ve kütle, sürtünme',
          'Collider ve çarpışma algılama',
          'Kullanıcı girdisiyle karakter kontrolü',
          'Zıplama ve yerçekimi ayarları',
        ],
        project: 'Zıplayabilen, çarpışan karakter kontrolcüsü',
      },
      {
        week: 4,
        title: '2B Oyun Mekanikleri',
        topics: [
          'Sprite ve 2B fizik',
          'Animator ile karakter animasyonu',
          'Platform, tuzak ve toplanabilir nesneler',
          'Tilemap ile seviye çizme',
        ],
        project: 'Oynanabilir 2B platform oyunu bölümü',
      },
      {
        week: 5,
        title: 'Arayüz, Menü ve Skor Sistemi',
        topics: [
          'Canvas ve UI elemanları',
          'Butonlar ve sahne geçişleri',
          'Skor, can ve süre göstergeleri',
          'Oyun bitti ve duraklat ekranları',
        ],
        project: 'Menüsü ve skor tablosu olan tam oyun akışı',
      },
      {
        week: 6,
        title: 'Ses, Efekt ve Parçacık Sistemleri',
        topics: [
          'AudioSource ile müzik ve efekt',
          'Particle System: patlama, ateş, toz',
          'Işıklandırma ve gölge',
          'Post-processing ile görsel kalite',
        ],
        project: 'Görsel ve işitsel olarak zenginleştirilmiş sahne',
      },
      {
        week: 7,
        title: 'Yapay Zeka Düşmanlar',
        topics: [
          'NavMesh ile yol bulma',
          'Düşman durum makineleri (devriye, takip, saldırı)',
          'Görüş alanı ve algılama',
          'Zorluk dengeleme',
        ],
        project: 'Oyuncuyu takip eden ve saldıran akıllı düşmanlar',
      },
      {
        week: 8,
        title: 'Seviye Tasarımı ve Oyun Dengesi',
        topics: [
          'Öğrenme eğrisi ve zorluk artışı',
          'Ödül döngüsü tasarımı',
          'Prefab ile tekrar kullanılabilir içerik',
          'Oyun testçileriyle test etme',
        ],
        project: 'Zorluğu kademeli artan çok bölümlü oyun',
      },
      {
        week: 9,
        title: 'Optimizasyon ve Build Alma',
        topics: [
          'Performans profilleme',
          'Doku ve model optimizasyonu',
          'WebGL, Windows ve Android için build',
          'itch.io üzerinde yayınlama',
        ],
        project: 'Tarayıcıda oynanabilen, yayınlanmış oyun',
      },
      {
        week: 10,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Kendi oyun fikrinin tasarım belgesi',
          'Geliştirme, test ve düzeltme döngüsü',
          'Oyun tanıtım sayfası hazırlama',
          'Canlı sunum ve oynatma',
        ],
        project: 'Yayında olan, herkesin oynayabildiği kendi oyunun',
      },
    ],
    finalProject:
      'Öğrenci kendi oyun fikrini tasarım belgesiyle planlar, geliştirir, test ettirir ve itch.io üzerinde yayınlar. Demo Günü’nde oyunu canlı oynatarak tasarım kararlarını anlatır.',
    nextCourseId: 'ai',
    faq: [
      {
        q: 'Bilgisayarımız Unity’yi kaldırır mı?',
        a: 'En az 8 GB RAM ve ayrı ekran kartı öneriyoruz. Kayıt öncesi bilgisayarınızın özelliklerini bize iletirseniz ücretsiz uygunluk kontrolü yapıyoruz.',
      },
      {
        q: 'Hiç kod bilmeyen katılabilir mi?',
        a: 'Önermiyoruz. Bu kurs ileri seviye; en az Python veya Web kursunu tamamlamış olmak gerekiyor. Aksi hâlde öğrenci C# tarafında zorlanıyor.',
      },
      {
        q: 'Oyunu mağazalarda satabilir mi?',
        a: 'Teknik olarak evet, oyun build alınabilir durumda oluyor. Yaş nedeniyle mağaza hesabı velinin adına açılır; isteyen ailelere süreci anlatıyoruz.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ai',
    slug: 'yapay-zeka-ve-makine-ogrenmesi',
    title: 'Yapay Zeka & Makine Öğrenmesi',
    shortTitle: 'Yapay Zeka',
    icon: 'Brain',
    ageMin: 14,
    ageMax: 17,
    ageRange: '14–17 Yaş',
    level: 'İleri',
    weeks: 8,
    lessonsPerWeek: 2,
    lessonMinutes: 75,
    maxStudents: 6,
    // Ek: bulut işlem gücü (model eğitimi), 6 kişilik sınıf, 75 dakikalık ders
    priceExtra: 3500,
    students: '160',
    rating: '4.8',
    tag: 'Yeni',
    tint: 'mint',
    image: '/images/kurs-ai.svg',
    summary:
      'Yapay zekayı kullanmayı değil, nasıl çalıştığını ve kendi modelini nasıl eğiteceğini öğrenir.',
    intro:
      'Bugün herkes yapay zeka kullanıyor; çok azı nasıl çalıştığını biliyor. Bu kurs o farkı kapatıyor. Öğrenci kendi veri setini toplar, temizler, görselleştirir, model eğitir ve modelin neden yanıldığını analiz eder. Kurucu ekibimizin bilgisayarla görü ve derin öğrenme alanındaki sanayi deneyimi doğrudan bu müfredata yansıyor.',
    parentNote:
      'Bu kurs çocuğunuzu yapay zekanın tüketicisi olmaktan çıkarıp onu anlayan tarafa geçiriyor. Ayrıca etik boyutu da işliyoruz: veri gizliliği, önyargılı modeller, üretilen içeriğin doğruluğu. Bu, önümüzdeki 10 yılda en çok ihtiyaç duyulacak okuryazarlık.',
    prerequisites:
      'Python bilgisi zorunludur. Python Programlama kursunu tamamlamış olmak veya döngü, fonksiyon ve liste kavramlarına hâkim olmak gerekir.',
    requirements: [
      'İnternet bağlantısı olan bilgisayar',
      'Kamera ve mikrofon',
      'Google hesabı (Google Colab için)',
      'Kurulum gerekmez — modeller bulutta eğitilir',
    ],
    tools: [
      'Python 3',
      'Google Colab',
      'NumPy & Pandas',
      'Matplotlib',
      'scikit-learn',
      'OpenCV',
      'Teachable Machine',
    ],
    gains: [
      'Yapay zekanın nasıl çalıştığını sezgisel değil teknik olarak anlar',
      'Kendi veri setiyle model eğitip test edebilir hâle gelir',
      'Veriyi okuma, temizleme ve grafikle anlamlandırma becerisi kazanır',
      'Modellerin nerede ve neden yanıldığını değerlendirebilir',
      'Yapay zeka etiği, önyargı ve veri gizliliği konusunda bilinç kazanır',
      'Üniversite tercih ve kariyer yönelimi için gerçek bir fikir edinir',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Yapay Zeka Nedir, Nerede Kullanılır',
        topics: [
          'Yapay zeka, makine öğrenmesi ve derin öğrenme farkı',
          'Günlük hayattaki yapay zeka örnekleri',
          'Yapay zeka etiği, önyargı ve veri gizliliği',
          'Google Colab ortamıyla tanışma',
        ],
        project: 'Teachable Machine ile eğitilmiş ilk görüntü sınıflandırıcı',
      },
      {
        week: 2,
        title: 'Veriyle Düşünmek',
        topics: [
          'NumPy dizileri ve vektör işlemleri',
          'Pandas ile tablo okuma ve filtreleme',
          'Eksik ve hatalı veriyi temizleme',
          'Veri setleri nereden bulunur',
        ],
        project: 'Gerçek bir veri setini temizleyip analize hazır hâle getirme',
      },
      {
        week: 3,
        title: 'Veri Görselleştirme',
        topics: [
          'Matplotlib ile çizgi, sütun, dağılım grafikleri',
          'Grafikten anlam çıkarma',
          'Korelasyon ve nedensellik farkı',
          'Yanıltıcı grafikleri tanıma',
        ],
        project: 'Seçtiğin konuda veri analizi raporu ve grafikleri',
      },
      {
        week: 4,
        title: 'İlk Makine Öğrenmesi Modeli',
        topics: [
          'Denetimli öğrenme mantığı',
          'Eğitim ve test verisi ayrımı',
          'Sınıflandırma: karar ağacı ve k-NN',
          'scikit-learn ile model eğitme',
        ],
        project: 'Tahmin yapan, eğitilmiş ilk sınıflandırma modelin',
      },
      {
        week: 5,
        title: 'Model Değerlendirme',
        topics: [
          'Doğruluk, kesinlik, duyarlılık',
          'Karışıklık matrisi okuma',
          'Aşırı öğrenme (overfitting) ve önlemleri',
          'Modeli iyileştirme döngüsü',
        ],
        project: 'Modelin nerede ve neden yanıldığını gösteren analiz',
      },
      {
        week: 6,
        title: 'Bilgisayarla Görü',
        topics: [
          'Görüntü nasıl sayıya dönüşür (piksel, kanal)',
          'OpenCV ile görüntü işleme filtreleri',
          'Yüz ve nesne algılama',
          'Kameradan gerçek zamanlı işleme',
        ],
        project: 'Kameradan yüz algılayan çalışan uygulama',
      },
      {
        week: 7,
        title: 'Sinir Ağları ve Üretken Yapay Zeka',
        topics: [
          'Yapay sinir ağı nasıl öğrenir',
          'Katman, ağırlık ve aktivasyon kavramları',
          'Büyük dil modelleri nasıl çalışır',
          'Etkili istem (prompt) yazma ve sınırları',
        ],
        project: 'Sinir ağıyla eğitilmiş el yazısı rakam tanıyıcı',
      },
      {
        week: 8,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Kendi problem ve veri setini seçme',
          'Model eğitme ve iyileştirme',
          'Sonuçları görselleştirme',
          'Bulguları sunma ve savunma',
        ],
        project: 'Kendi verinle eğittiğin, sonuçlarını sunduğun model',
      },
    ],
    finalProject:
      'Öğrenci kendi ilgi alanından bir problem seçer (spor istatistiği, müzik türü, bitki tanıma vb.), veri setini bulur veya oluşturur, modeli eğitir ve sonuçları grafiklerle sunar. Modelin sınırlarını ve etik boyutunu da tartışır.',
    faq: [
      {
        q: 'Python bilmeden alınabilir mi?',
        a: 'Hayır. Bu kurs Python üzerine kurulu; döngü ve fonksiyon bilmeden takip edilemez. Python kursumuzu önce tamamlamanızı öneriyoruz.',
      },
      {
        q: 'Güçlü bilgisayar gerekiyor mu?',
        a: 'Hayır. Tüm modeller Google Colab üzerinde, Google’ın sunucularında eğitiliyor. Tarayıcı açabilen her bilgisayar yeterli.',
      },
      {
        q: 'Matematik seviyesi ne olmalı?',
        a: 'Lise 1 düzeyi yeterli. Gereken matematiği (ortalama, oran, koordinat) ders içinde ihtiyaç duyduğumuz kadarıyla anlatıyoruz.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'robotics',
    slug: 'arduino-ve-robotik',
    title: 'Arduino & Robotik',
    shortTitle: 'Robotik',
    icon: 'Cpu',
    ageMin: 10,
    ageMax: 15,
    ageRange: '10–15 Yaş',
    level: 'Orta',
    weeks: 8,
    lessonsPerWeek: 2,
    lessonMinutes: 60,
    maxStudents: 8,
    // Ek: adrese gönderilen 30 parçalık Arduino seti — öğrencide kalır
    priceExtra: 6000,
    students: '240',
    rating: '4.9',
    tag: 'Donanım Seti Dahil',
    tint: 'rose',
    image: '/images/kurs-arduino.svg',
    summary:
      'Kodun ekrandan çıkıp fiziksel dünyayı hareket ettirdiği kurs. Donanım seti adrese gönderilir.',
    intro:
      'Bu kursta yazılan kod ekranda kalmaz; bir LED yakar, bir motoru döndürür, bir robotu çizgi üzerinde yürütür. Kayıt sonrası öğrencinin adresine 30 parçalık Arduino başlangıç seti kargoyla gönderilir ve set öğrencide kalır. Derslerde eğitmen kendi setiyle aynı devreyi kurar, öğrenci adım adım takip eder.',
    parentNote:
      'Ekran başında geçen sürenin fiziksel bir çıktıya dönüştüğü tek programımız bu. Somut düşünen, elleriyle iş yapmayı seven çocuklarda kodlamaya ilgiyi açan kapı genellikle robotik oluyor. Ayrıca elektronik ve fizik dersleriyle doğrudan bağlantılı.',
    prerequisites:
      'Ön koşul yok. Küçük parçalarla dikkatli çalışabilen her öğrenci katılabilir.',
    requirements: [
      'İnternet bağlantısı olan bilgisayar ve boş bir USB portu',
      'Kamera ve mikrofon (devreyi eğitmene gösterebilmek için önemli)',
      'Çalışmak için düz bir masa yüzeyi',
      'Arduino seti tarafımızdan kargoyla gönderilir — ek ücret yoktur',
    ],
    tools: [
      'Arduino UNO R3',
      'Arduino IDE',
      'Tinkercad Circuits (simülasyon)',
      '30 parçalık sensör ve motor seti',
    ],
    gains: [
      'Yazdığı kodun fiziksel dünyada karşılık bulduğunu deneyimler',
      'Temel elektronik bilgisi kazanır: devre, direnç, akım, gerilim',
      'Sensörden veri okuyup karar veren sistemler kurmayı öğrenir',
      'C tabanlı Arduino dilini öğrenerek metin tabanlı kodlamaya geçer',
      'Fizik ve teknoloji derslerine somut bir bağ kurar',
      'Kendi tasarladığı robotu kurup çalıştırır — evde kalan kalıcı bir eser',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Elektronik Temelleri ve İlk Devre',
        topics: [
          'Akım, gerilim, direnç kavramları',
          'Breadboard nasıl çalışır',
          'Arduino kartının tanıtımı ve bağlantısı',
          'Arduino IDE kurulumu ve ilk kod yüklemesi',
        ],
        project: 'Yanıp sönen LED devresi',
      },
      {
        week: 2,
        title: 'Dijital Giriş ve Çıkış',
        topics: [
          'digitalWrite ve digitalRead',
          'Buton bağlama ve pull-up direnç',
          'Birden fazla LED kontrolü',
          'Döngü ve gecikme mantığı',
        ],
        project: 'Butonla çalışan trafik lambası',
      },
      {
        week: 3,
        title: 'Analog Sinyaller ve Sensörler',
        topics: [
          'analogRead ve analogWrite (PWM)',
          'Potansiyometre ile değer okuma',
          'Işık sensörü (LDR) kullanımı',
          'Sensör verisini eşik değerle karşılaştırma',
        ],
        project: 'Karanlıkta otomatik yanan gece lambası',
      },
      {
        week: 4,
        title: 'Ekran ve Çevresel Ölçüm',
        topics: [
          'DHT11 ile sıcaklık ve nem ölçümü',
          'LCD ekran bağlama ve yazı yazdırma',
          'Kütüphane kurulumu ve kullanımı',
          'Seri port ile veri izleme',
        ],
        project: 'Ekranlı mini hava istasyonu',
      },
      {
        week: 5,
        title: 'Ses ve Mesafe Ölçümü',
        topics: [
          'Buzzer ile ses ve melodi üretme',
          'HC-SR04 ultrasonik mesafe sensörü',
          'Mesafeye göre tepki verme',
          'Fonksiyon yazarak kodu düzenleme',
        ],
        project: 'Yaklaşınca sesi hızlanan park sensörü',
      },
      {
        week: 6,
        title: 'Motorlar ve Hareket',
        topics: [
          'Servo motor açı kontrolü',
          'DC motor ve motor sürücü kartı',
          'Birden fazla motoru birlikte yönetme',
          'Mekanik tasarım temelleri',
        ],
        project: 'Nesne kavrayan robot kol',
      },
      {
        week: 7,
        title: 'Çizgi İzleyen Robot',
        topics: [
          'Kızılötesi (IR) sensör mantığı',
          'Sensör verisiyle motor yönlendirme',
          'Robot şasisini kurma',
          'Parkurda test etme ve ayar yapma',
        ],
        project: 'Çizgiyi takip ederek pistte ilerleyen robot',
      },
      {
        week: 8,
        title: 'Bitirme Projesi ve Demo Günü',
        topics: [
          'Kendi robot veya sistem fikrini tasarlama',
          'Devre şemasını çizme',
          'Kurma, kodlama ve test etme',
          'Kamerayla canlı gösterim ve sunum',
        ],
        project: 'Kendi tasarladığın, çalışan robotik sistem',
      },
    ],
    finalProject:
      'Öğrenci kendi seçtiği bir problemi çözen robotik sistem tasarlar (otomatik sulama, akıllı çöp kutusu, alarm sistemi vb.), devresini kurar, kodunu yazar ve Demo Günü’nde kamera karşısında canlı çalıştırarak sunar.',
    nextCourseId: 'python',
    faq: [
      {
        q: 'Donanım seti için ayrıca ödeme yapacak mıyız?',
        a: 'Hayır. 30 parçalık Arduino seti kurs ücretine dahildir ve kayıt sonrası adresinize kargolanır. Set kurs bittikten sonra öğrencide kalır.',
      },
      {
        q: 'Kargo ne zaman gelir?',
        a: 'Kayıt onayından sonra 3 iş günü içinde gönderiyoruz. İlk ders, set elinize ulaştıktan sonra planlanır.',
      },
      {
        q: 'Çocuğum elektrikten zarar görür mü?',
        a: 'Hayır. Arduino 5 volt ile çalışır — bir kalem pilden daha düşük. Prize takılan hiçbir parça yoktur, tüm besleme USB üzerindendir.',
      },
    ],
  },
];

// ─── Yardımcılar ─────────────────────────────────────────────────────────────

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function courseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

/** Belirli bir yaşa uygun kursları döner. */
export function coursesForAge(age: number): Course[] {
  return COURSES.filter((c) => age >= c.ageMin && age <= c.ageMax);
}

/** Toplam canlı ders sayısı. */
export function totalLessons(c: Course): number {
  return c.weeks * c.lessonsPerWeek;
}

/** "16 ders · 60 dk · maks. 8 kişi" gibi tek satırlık özet. */
export function formatLine(c: Course): string {
  return `${totalLessons(c)} canlı ders · ${c.lessonMinutes} dk · maks. ${c.maxStudents} öğrenci`;
}
