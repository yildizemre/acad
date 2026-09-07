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
          <div className="font-display text-7xl font-semibold text-brick-500 mb-5">404</div>
          <h1 className="text-display-sm font-bold text-ink-950 mb-4">
            Aradığınız sayfayı bulamadık
          </h1>
          <p className="text-lead-500 text-lg mb-8">
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

          <div className="pt-8 border-t border-sand-300">
            <p className="text-sm text-lead-400 mb-4">Popüler kurslar</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {COURSES.map((c) => (
                <Link
                  key={c.id}
                  to={`/kurslar/${c.slug}`}
                  className="badge bg-sand-200 text-lead-600 hover:bg-brick-50 hover:text-brick-700 transition-colors"
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
