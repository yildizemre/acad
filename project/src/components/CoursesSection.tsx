import { useState } from 'react';
import {
  Clock, Users, Star, ArrowRight,
  Code2, Globe, Gamepad2, Brain, Cpu,
  Sparkles, BadgeCheck, TrendingUp
} from 'lucide-react';
import Modal from './Modal';

interface Course {
  id: string;
  icon: React.ElementType;
  title: string;
  ageRange: string;
  level: string;
  duration: string;
  students: string;
  rating: string;
  description: string;
  image: string;
  tag?: string;
  tagColor?: string;
  gains: string[];
  format: string;
}

const COURSES: Course[] = [
  {
    id: 'scratch',
    icon: Gamepad2,
    title: 'Scratch ile Oyun Geliştirme',
    ageRange: '8–12 Yaş',
    level: 'Başlangıç',
    duration: '8 Hafta',
    students: '320',
    rating: '4.9',
    description: 'Blok tabanlı görsel kodlama ile kendi oyunlarını yaratmaya başla. Mantıksal düşünme ve yaratıcılığı bir araya getir.',
    image: 'https://images.pexels.com/photos/7246526/pexels-photo-7246526.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'En Popüler',
    tagColor: 'bg-orange-100 text-orange-700',
    gains: [
      'Mantıksal düşünme ve problem çözme yeteneği kalıcı olarak gelişir',
      'İlk dijital oyununu sıfırdan yaparak özgüveni büyük ölçüde artar',
      '"Ben de bir şey üretebilirim" hissini yaşar — bu, her şeyin başlangıcıdır',
      'Algoritmik düşünmeye erken yaşta alışır; ilerideki tüm dersler daha kolay gelir',
      'Soyut fikirlerini ekranda hayata geçirmeyi öğrenir ve bunu arkadaşlarıyla paylaşır',
    ],
    format: 'Haftada 2 canlı online ders × 45 dakika | Maks. 8 öğrenci',
  },
  {
    id: 'python',
    icon: Code2,
    title: 'Python Programlama',
    ageRange: '11–15 Yaş',
    level: 'Orta',
    duration: '8 Hafta',
    students: '280',
    rating: '4.8',
    description: 'Gerçek yazılımcıların kullandığı dili öğren. Pratik projeler yaparak kod yazmayı alışkanlık haline getir.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'Yeni Dönem',
    tagColor: 'bg-blue-100 text-blue-700',
    gains: [
      'Gerçek bir yazılımcı gibi düşünmeye ve problemi parçalara ayırmaya başlar',
      'Günlük hayatını kolaylaştıracak küçük araçlar üretebilir hale gelir',
      'Veri okuma, mantık kurma ve sonuç çıkarma becerileri güçlenir',
      'AI ve veri bilimi gibi ileri konular için sağlam bir temel kazanır',
      'Üniversite ve staj başvurularında öne çıkacak somut bir portföy başlatır',
    ],
    format: 'Haftada 2 canlı online ders × 60 dakika | Maks. 8 öğrenci',
  },
  {
    id: 'web',
    icon: Globe,
    title: 'Web Tasarım & Geliştirme',
    ageRange: '12–17 Yaş',
    level: 'Orta',
    duration: '10 Hafta',
    students: '215',
    rating: '4.9',
    description: 'Kendi web siteni sıfırdan inşa et. Tasarımdan koda, fikirden yayına uzanan tam bir deneyim yaşa.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    gains: [
      'İnternette kendi sesini duyuracak bir alan inşa eder — bu büyük bir güç hissidir',
      'Estetik duyarlılığı ve tasarım zevki sistematik biçimde gelişir',
      'Fikirleri dijital ürüne dönüştürme yetkinliği kazanır; hayaller somutlaşır',
      '"Bunu satabilir miyim?" sorusunu sorar; girişimci düşünce filizlenir',
      'Gerçek bir portföy sitesiyle iş dünyasına ve üniversiteye güçlü bir giriş yapar',
    ],
    format: 'Haftada 2 canlı online ders × 60 dakika | Maks. 8 öğrenci',
  },
  {
    id: 'unity',
    icon: Gamepad2,
    title: 'Unity ile Oyun Geliştirme',
    ageRange: '13–17 Yaş',
    level: 'İleri',
    duration: '10 Hafta',
    students: '190',
    rating: '5.0',
    description: 'Profesyonel oyun motoru Unity ile 2D ve 3D oyunlar geliştir. Hayal gücünle teknolojiyi birleştir.',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'Favori',
    tagColor: 'bg-green-100 text-green-700',
    gains: [
      'Hayal kurmaktan üretmeye geçer; artık oyun oynamak değil oyun yapmak ister',
      'Sabır, planlama ve süreci tamamlama disiplini kalıcı olarak yerleşir',
      'Oynadığı oyunlara farklı gözlerle bakar; "bu nasıl yapıldı?" sorusu aklını meşgul eder',
      'Uzun soluklu bir projeyi başlatıp bitirmenin gurur ve tatminini yaşar',
      'Oyun geliştirici ya da teknoloji girişimcisi kariyerine somut bir adım atar',
    ],
    format: 'Haftada 2 canlı online ders × 75 dakika | Maks. 6 öğrenci',
  },
  {
    id: 'ai',
    icon: Brain,
    title: 'Yapay Zeka & ML',
    ageRange: '14–17 Yaş',
    level: 'İleri',
    duration: '8 Hafta',
    students: '160',
    rating: '4.8',
    description: 'Geleceği şekillendiren teknolojiyi anla ve kullan. Gerçek verilerle gerçek modeller geliştir.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    tag: 'Yeni',
    tagColor: 'bg-cyan-100 text-cyan-700',
    gains: [
      'Günlük hayatını şekillendiren teknolojinin perde arkasını görür; sihir olmadığını anlar',
      'Veri okuma, örüntü bulma ve analitik karar verme becerisi hayat boyu işine yarar',
      'Endüstrinin gerçek sorunlarına çözüm üretme deneyimi yaşar; sektörü tanır',
      'Yapay zekanın sınırlarını ve etik boyutlarını keşfederek eleştirel bakış açısı gelişir',
      'Akademik sınavlarda, olimpiyatlarda ve kariyer hedeflerinde belirleyici bir avantaj kazanır',
    ],
    format: 'Haftada 2 canlı online ders × 75 dakika | Maks. 6 öğrenci',
  },
  {
    id: 'robotics',
    icon: Cpu,
    title: 'Arduino & Robotik',
    ageRange: '10–15 Yaş',
    level: 'Orta',
    duration: '8 Hafta',
    students: '240',
    rating: '4.9',
    description: 'Fiziksel dünyayı kodla. Kendi elleriyle akıllı cihazlar ve robotlar inşa et.',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
    gains: [
      'Ekrana değil, kendi ürettiği nesneye bakar — bu his kodlamanın en güçlü motivasyonudur',
      'El becerisi, sabır ve mühendis düşüncesi tek bir projede bir araya gelir',
      'Fizik ve matematik soyut olmaktan çıkar; sensörlerde, motorlarda hayat bulur',
      'STEM alanlarına ilgisi derinleşir; okul derslerine bakışı değişir',
      'Bilim fuarlarında ve tekno-girişim yarışmalarında öne çıkacak özgün projeler üretir',
    ],
    format: 'Haftada 2 canlı online ders × 60 dakika | Donanım seti kargoda | Maks. 8 öğrenci',
  },
];

const levelColors: Record<string, string> = {
  Başlangıç: 'bg-emerald-100 text-emerald-700',
  Orta: 'bg-blue-100 text-blue-700',
  İleri: 'bg-rose-100 text-rose-700',
};

export default function CoursesSection() {
  const [selected, setSelected] = useState<Course | null>(null);

  return (
    <section id="kurslar" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-brand-navy/5 border border-brand-navy/10 text-brand-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Tüm Kurslar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
            Her Yaşa Özel{' '}
            <span className="text-brand-green">Teknoloji Kursları</span>
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            Kurs detaylarını ve çocuğunuza katacaklarını görmek için kartlara tıklayın.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {COURSES.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                onClick={() => setSelected(course)}
                className="card group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full">
                      {course.ageRange}
                    </span>
                  </div>
                  {course.tag && (
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${course.tagColor}`}>
                        {course.tag}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge ${levelColors[course.level]}`}>{course.level}</span>
                  </div>
                  <h3 className="font-bold text-brand-navy text-lg mb-2 leading-snug group-hover:text-brand-green transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 border-t border-gray-100 pt-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {course.students} öğrenci
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {course.rating}
                    </span>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-green transition-all duration-200">
                    Detayları İncele
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course detail modal */}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <img
            src={selected.image}
            alt={selected.title}
            className="w-full h-44 object-cover rounded-2xl mb-5"
          />

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              {selected.ageRange}
            </span>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${levelColors[selected.level]}`}>
              {selected.level}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> {selected.duration}
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {selected.rating}
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>

          {/* Gains */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-brand-navy flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-brand-green" />
              Bu Kurs Çocuğunuza Neler Katacak?
            </h4>
            <ul className="space-y-3">
              {selected.gains.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Format */}
          <div className="bg-slate-50 rounded-xl p-4 mb-5">
            <div className="text-xs font-bold text-brand-navy uppercase tracking-wide mb-1">Ders Formatı</div>
            <p className="text-gray-500 text-sm">{selected.format}</p>
          </div>

          {/* E-devlet badge */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-3 rounded-xl mb-5">
            <BadgeCheck className="w-4 h-4 shrink-0" />
            Kurs tamamlandığında E-Devlet onaylı sertifika verilmektedir.
          </div>

          <button
            onClick={() => {
              setSelected(null);
              document.querySelector('#deneme')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full btn-primary justify-center !py-4"
          >
            Ücretsiz Deneme Dersine Kayıt Ol
            <ArrowRight className="w-5 h-5" />
          </button>
        </Modal>
      )}
    </section>
  );
}
