import { ArrowRight, Clock, Users, Star, Zap } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Scratch ile Oyun Geliştirme',
    ageRange: '8-11 Yaş',
    level: 'Başlangıç',
    duration: '8 Hafta',
    students: '320',
    rating: '4.9',
    description:
      'Görsel blok tabanlı kodlama ile kendi oyunlarını yaratmaya başla. Mantıksal düşünme ve problem çözme becerilerini geliştir.',
    image: 'https://images.pexels.com/photos/7246526/pexels-photo-7246526.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-orange-400 to-pink-500',
    tag: 'En Popüler',
    tagColor: 'bg-orange-100 text-orange-700',
  },
  {
    id: 2,
    title: 'Python ile Programlamaya Giriş',
    ageRange: '11-14 Yaş',
    level: 'Orta',
    duration: '12 Hafta',
    students: '280',
    rating: '4.8',
    description:
      'Dünyanın en çok sevilen dilini öğren. Değişkenler, döngüler ve fonksiyonlarla gerçek projeler geliştir.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-blue-400 to-cyan-500',
    tag: 'Yeni Dönem',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    title: 'Web Tasarım & Geliştirme',
    ageRange: '12-16 Yaş',
    level: 'Orta',
    duration: '16 Hafta',
    students: '215',
    rating: '4.9',
    description:
      'HTML, CSS ve JavaScript ile etkileyici web siteleri tasarla. Portfolio projen hazır olsun.',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-green-400 to-teal-500',
    tag: '',
    tagColor: '',
  },
  {
    id: 4,
    title: 'Unity ile 2D/3D Oyun Geliştirme',
    ageRange: '13-17 Yaş',
    level: 'İleri',
    duration: '20 Hafta',
    students: '190',
    rating: '5.0',
    description:
      'Profesyonel oyun motoru Unity ile kendi 2D ve 3D oyunlarını geliştir. C# programlama dilini öğren.',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-purple-400 to-pink-500',
    tag: 'Favori',
    tagColor: 'bg-green-100 text-green-700',
  },
  {
    id: 5,
    title: 'Yapay Zeka & Makine Öğrenmesi',
    ageRange: '14-17 Yaş',
    level: 'İleri',
    duration: '14 Hafta',
    students: '160',
    rating: '4.8',
    description:
      'Yapay zeka kavramlarını ve makine öğrenmesinin temellerini öğren. Python ile AI modelleri oluştur.',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-cyan-400 to-blue-600',
    tag: 'Yeni',
    tagColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 6,
    title: 'Arduino & Robotik Kodlama',
    ageRange: '10-15 Yaş',
    level: 'Orta',
    duration: '10 Hafta',
    students: '240',
    rating: '4.9',
    description:
      'Fiziksel dünyayı kodla! Arduino ile sensörler, motorlar ve devreler kullanarak akıllı cihazlar üret.',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-yellow-400 to-orange-500',
    tag: '',
    tagColor: '',
  },
];

const levelColors: Record<string, string> = {
  'Başlangıç': 'bg-emerald-100 text-emerald-700',
  'Orta': 'bg-blue-100 text-blue-700',
  'İleri': 'bg-rose-100 text-rose-700',
};

export default function Courses() {
  return (
    <section id="kurslar" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-brand-navy/5 border border-brand-navy/10 text-brand-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <Zap className="w-4 h-4 text-brand-green" />
            Popüler Kurslar
          </span>
          <h2 className="section-title">
            Her Yaşa Özel{' '}
            <span className="text-brand-green">Teknoloji Kursları</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Çocuğunuzun ilgi alanı ve yaşına göre tasarlanmış, proje tabanlı
            eğitim programlarını keşfedin.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="card group"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${course.color} opacity-40`} />

                {/* Age badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 text-brand-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {course.ageRange}
                  </span>
                </div>

                {/* Tag badge */}
                {course.tag && (
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${course.tagColor}`}>
                      {course.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${levelColors[course.level]}`}>
                    {course.level}
                  </span>
                </div>

                <h3 className="font-bold text-brand-navy text-lg mb-2 leading-snug group-hover:text-brand-green transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 border-t border-gray-100 pt-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {course.students} öğrenci
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </span>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-brand-navy text-white font-semibold py-3 rounded-xl hover:bg-brand-navy-light transition-all duration-200 hover:shadow-lg group-hover:bg-brand-green">
                  İncele
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 border-2 border-brand-navy text-brand-navy font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-navy hover:text-white transition-all duration-200">
            Tüm Kursları Gör
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
