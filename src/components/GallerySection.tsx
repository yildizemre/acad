import { Instagram, ExternalLink } from 'lucide-react';

const photos = [
  {
    src: 'https://images.pexels.com/photos/7246526/pexels-photo-7246526.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Scratch dersi',
    label: 'Scratch Atölyesi',
  },
  {
    src: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Python dersi',
    label: 'Python Programlama',
  },
  {
    src: 'https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Canlı ders',
    label: 'Canlı Online Dersler',
  },
  {
    src: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Robotik',
    label: 'Robotik Atölyesi',
  },
  {
    src: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Yapay zeka dersi',
    label: 'Yapay Zeka Dersleri',
  },
  {
    src: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500',
    alt: 'Web tasarım',
    label: 'Web Tasarım',
  },
];

export default function GallerySection() {
  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 text-pink-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Instagram className="w-4 h-4" />
              @hypeacademia
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
              Derslerimizden <span className="text-brand-green">Kareler</span>
            </h2>
            <p className="text-gray-500 mt-2">Gerçek derslerden, gerçek anlar</p>
          </div>
          <a
            href="https://instagram.com/hypeacademia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-2 border-gray-200 text-brand-navy font-semibold px-5 py-2.5 rounded-xl hover:border-pink-300 hover:text-pink-600 transition-all shrink-0 text-sm"
          >
            <Instagram className="w-4 h-4" />
            Instagram'da Takip Et
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {photos.map((photo, i) => (
            <a
              key={i}
              href="https://instagram.com/hypeacademia"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden aspect-square block shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-xs font-semibold">{photo.label}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
