// ─────────────────────────────────────────────────────────────────────────────
// BİTİRME PROJELERİ
//
// Buradaki kayıtlar müfredatın ürettiği projelerdir — her kursun son haftasında
// öğrencinin yaptığı iş. Yani uydurma değil, programın tanımı. Görseller de
// projenin gerçekte neye benzediğini gösteriyor.
//
// ⚠️  Bunlar BELİRLİ BİR ÖĞRENCİYE ait değildir ve öyle sunulmamalıdır.
//     Gerçek öğrenci işlerini yayınlamak için:
//       1. Veliden yazılı izin alın (ad ve yaş yayını için ayrıca)
//       2. `student` alanını doldurun — kart o zaman öğrenci adını gösterir
//       3. Scratch/itch.io bağlantısı varsa `embedId` girin, proje oynanabilir olur
//
//     Scratch  → scratch.mit.edu/projects/123456789  →  embedId: '123456789'
//     itch.io  → oyun sayfasındaki "Embed" bölümünde yazan upload numarası
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectKind = 'scratch' | 'itch' | 'link';

export interface Project {
  id: string;
  title: string;
  /** courses.ts içindeki kurs id'si */
  courseId: string;
  /** Projenin bir cümlelik tanımı */
  brief: string;
  /** Öğrencinin bu projede çözmek zorunda kaldığı asıl problem */
  challenge: string;
  /** Projenin gösterdiği teknik yetkinlikler */
  skills: string[];
  image: string;
  kind: ProjectKind;
  /** scratch: proje numarası · itch: upload numarası */
  embedId?: string;
  url?: string;
  /**
   * Gerçek bir öğrenciye ait yayınlanmış işlerde doldurulur.
   * Boşken kart "bitirme projesi" olarak sunulur, kimseye atfedilmez.
   */
  student?: { name: string; age: number };
}

export const PROJECTS: Project[] = [
  {
    id: 'uzay-savasi',
    title: 'Uzay Savaşı',
    courseId: 'scratch',
    brief:
      'Düşman dalgaları, puan ve can sistemi olan, klavyeyle oynanan 2 boyutlu uzay oyunu.',
    challenge:
      'Bütün düşmanlar aynı anda ekrana gelince oyun oynanamaz hâle geliyor. Öğrenci klon mantığını kullanarak düşmanları dalgalar hâlinde göndermeyi ve her dalgada hızı artırmayı çözüyor.',
    skills: ['Klonlama', 'Çarpışma algılama', 'Değişkenlerle skor', 'Zorluk dengeleme'],
    image: '/images/proje-uzay-savasi.svg',
    kind: 'scratch',
  },
  {
    id: 'otomatik-sulama',
    title: 'Otomatik Sulama Sistemi',
    courseId: 'robotics',
    brief:
      'Toprak nemini ölçen, kuruyunca pompayı çalıştıran ve durumu LCD ekranda gösteren Arduino sistemi.',
    challenge:
      'Sensör değeri sürekli dalgalandığı için pompa saniyede birkaç kez açılıp kapanıyor. Öğrenci eşik değere bir tolerans aralığı ekleyerek sistemi kararlı hâle getiriyor.',
    skills: ['Analog sensör okuma', 'Eşik değer mantığı', 'Röle ile pompa sürme', 'LCD ekran'],
    image: '/images/proje-sulama.svg',
    kind: 'link',
  },
  {
    id: 'portfolyo-sitesi',
    title: 'Kişisel Portfolyo Sitesi',
    courseId: 'web',
    brief:
      'Öğrencinin kendi projelerini sergilediği, telefonda ve bilgisayarda düzgün görünen, gerçekten yayında olan web sitesi.',
    challenge:
      'Bilgisayarda güzel duran tasarım telefonda dağılıyor. Öğrenci mobil öncelikli düşünmeyi ve media query ile düzeni ekrana göre yeniden kurmayı öğreniyor.',
    skills: ['HTML & CSS', 'Responsive tasarım', 'React bileşenleri', 'Git ile yayınlama'],
    image: '/images/proje-portfolyo.svg',
    kind: 'link',
  },
  {
    id: 'platform-oyunu',
    title: 'Platform Oyunu',
    courseId: 'unity',
    brief:
      'Unity ve C# ile geliştirilmiş, üç bölümlü, takip eden düşmanları olan ve tarayıcıda oynanabilen platform oyunu.',
    challenge:
      'İlk bölüm test edenlerin çoğunun geçemeyeceği kadar zor çıkıyor. Öğrenci öğrenme eğrisi kavramıyla tanışıyor ve bölümleri kolaydan zora yeniden sıralıyor.',
    skills: ['C# ile karakter kontrolü', 'Rigidbody fizik', 'NavMesh ile düşman yapay zekası', 'WebGL build'],
    image: '/images/proje-platform-oyunu.svg',
    kind: 'itch',
  },
  {
    id: 'bitki-tanima',
    title: 'Bitki Türü Tanıyan Model',
    courseId: 'ai',
    brief:
      'Öğrencinin kendi topladığı fotoğraflarla eğitilmiş, altı bitki türünü ayırt eden görüntü sınıflandırma modeli.',
    challenge:
      'Model yaprakları birbirine karıştırıyor. Öğrenci hata analizini yapıp sorunun veri setindeki tek tip ışıkta olduğunu buluyor; fotoğrafları farklı ışıkta yeniden çekince doğruluk %78’den %91’e çıkıyor.',
    skills: ['Veri toplama ve etiketleme', 'Eğitim/test ayrımı', 'Karışıklık matrisi', 'Hata analizi'],
    image: '/images/proje-bitki-tanima.svg',
    kind: 'link',
  },
  {
    id: 'kelime-oyunu',
    title: 'Kelime Ezberleme Uygulaması',
    courseId: 'python',
    brief:
      'Yanlış bilinen kelimeleri daha sık soran ve skorları dosyaya kaydeden Python uygulaması.',
    challenge:
      'Program her açıldığında skorlar sıfırlanıyor. Öğrenci dosya okuma-yazmayı öğrenerek verinin kalıcı olmasını sağlıyor ve bozuk dosyaya karşı hata yakalama ekliyor.',
    skills: ['Sözlük veri yapısı', 'Fonksiyonlar', 'Dosya işlemleri', 'Hata yönetimi'],
    image: '/images/proje-kelime-oyunu.svg',
    kind: 'link',
  },
];

export function projectsForCourse(courseId: string): Project[] {
  return PROJECTS.filter((p) => p.courseId === courseId);
}

/** Gömülü oynatma adresi — yoksa undefined döner. */
export function embedUrl(p: Project): string | undefined {
  if (!p.embedId) return undefined;
  if (p.kind === 'scratch') return `https://scratch.mit.edu/projects/${p.embedId}/embed`;
  if (p.kind === 'itch') return `https://itch.io/embed-upload/${p.embedId}?color=0E2038`;
  return undefined;
}
