import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { COURSES } from '../data/courses';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({ title: 'Sayfa bulunamadı | Hype Academia' });

  return (
    <section className="section">
      <div className="container">
        <div className="max-w-xl mx-auto text-center py-10">
          <div className="text-7xl font-semibold text-electric-500 mb-5">404</div>
          <h1 className="text-display-sm text-night-950 mb-4">
            Aradığınız sayfayı bulamadık
          </h1>
          <p className="text-night-500 text-lg mb-8">
            Bağlantı taşınmış veya yanlış yazılmış olabilir. Aşağıdan devam edebilirsiniz.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4" />
              Ana sayfaya dön
            </Link>
            <Link to="/kurslar" className="btn-ghost">
              Kursları gör
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8">
            <p className="text-sm text-night-400 mb-4">Popüler kurslar</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {COURSES.map((c) => (
                <Link
                  key={c.id}
                  to={`/kurslar/${c.slug}`}
                  className="badge bg-night-50 text-night-600 hover:bg-electric-50 hover:text-electric-600 transition-colors"
                >
                  {c.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
