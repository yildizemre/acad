import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { STUDENT_VIDEOS, type StudentVideo } from '../../data/videos';

/**
 * Öğrenci ekran kayıtlarından oluşan ızgara.
 *
 * İki görünümü var:
 *  · "compact" — ana sayfadaki 3x3 duvar. Kare üzerinde sadece program adı yazar.
 *  · "card"    — kayıt + altında adı, ne olduğu ve ekranda görünen teknik ayrıntı.
 *
 * PERFORMANS
 * ----------
 * Dokuz videoyu birden indirip oynatmak sayfayı bitirir. Bu yüzden:
 *  · `preload="none"` — dosya, kare ekrana girene kadar inmez
 *  · ekrandan çıkan video duraklatılır, kaynak boşa akmaz
 *  · kullanıcı "hareketi azalt" demişse veya veri tasarrufu açıksa hiçbiri
 *    kendiliğinden oynamaz; kapak görseli durur, isteyen elle başlatır
 *  · ses izi kayıtlardan tamamen silinmiştir (bkz. scripts/videolar.py)
 *
 * Toplam yük: dokuz video + dokuz kapak ≈ 1 MB.
 */

/** Tarayıcı ya da kullanıcı kendiliğinden oynatmayı istemiyor mu? */
function otomatikKapali(): boolean {
  if (typeof window === 'undefined') return true;
  const az = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(az || conn?.saveData);
}

interface OynaticiProps {
  video: StudentVideo;
  autoplay: boolean;
  /** Karenin üstünde program adı yazsın mı? (compact görünümde yazar) */
  etiket: boolean;
  /** Telefonda kareler çok küçüldüğü için yazı ve düğme küçülür/gizlenir */
  kucuk?: boolean;
  /**
   * Sayfanın en üstündeki duvar için: kaynağı beklemeden bağla. Ziyaretçi
   * sayfayı açar açmaz kareler dönüyor olsun diye.
   */
  eager?: boolean;
  radius: string;
}

function Oynatici({ video, autoplay, etiket, kucuk = false, eager = false, radius }: OynaticiProps) {
  const ref = useRef<HTMLVideoElement>(null);
  /** Kaynak <video> etiketine bağlandı mı? */
  const [baglandi, setBaglandi] = useState(eager);
  /** Şu anda ekranda mı? — ekrandan çıkınca durdururuz */
  const [ekranda, setEkranda] = useState(false);
  const [oynuyor, setOynuyor] = useState(false);
  /** Ziyaretçi elle durdurduysa kendiliğinden yeniden başlatmayız */
  const elleDurduruldu = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setBaglandi(true);
      setEkranda(true);
      return;
    }

    // Sayfanın tepesindeki duvar zaten görünür; gözlemciyi beklemeden başlat.
    if (eager) setEkranda(true);

    // İki ayrı gözlemci:
    //  · yükleyici — kare ekrana 300 piksel kala kaynağı bağlar, böylece
    //    ziyaretçi oraya geldiğinde video zaten dönüyor olur
    //  · oynatıcı  — kare gerçekten görünürken oynatır, çıkınca durdurur
    const yukleyici = new IntersectionObserver(
      ([giris]) => {
        if (giris.isIntersecting) {
          setBaglandi(true);
          yukleyici.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    const oynatici = new IntersectionObserver(
      ([giris]) => setEkranda(giris.isIntersecting),
      { threshold: 0.1 },
    );

    yukleyici.observe(el);
    oynatici.observe(el);
    return () => {
      yukleyici.disconnect();
      oynatici.disconnect();
    };
  }, [eager]);

  // Oynatma kararı ayrı bir etkide veriliyor: `src` DOM'a işlendikten SONRA
  // çalışsın diye. Aynı anda hem kaynağı bağlayıp hem play() çağırırsak
  // tarayıcı henüz kaynağı görmediği için isteği reddediyor.
  useEffect(() => {
    const el = ref.current;
    if (!el || !baglandi) return;

    const dene = () => {
      if (document.hidden) return;
      if (ekranda && autoplay && !elleDurduruldu.current) el.play().catch(() => undefined);
      else if (!ekranda) el.pause();
    };

    dene();
    // Sekme arka plandayken tarayıcı oynatmayı reddeder; geri dönünce tekrar dene.
    document.addEventListener('visibilitychange', dene);
    return () => document.removeEventListener('visibilitychange', dene);
  }, [baglandi, ekranda, autoplay]);

  function degistir() {
    const el = ref.current;
    if (!el) return;
    setBaglandi(true);
    if (el.paused) {
      elleDurduruldu.current = false;
      el.play().catch(() => undefined);
    } else {
      elleDurduruldu.current = true;
      el.pause();
    }
  }

  return (
    <div className={`group relative overflow-hidden bg-night-900 ${radius}`}>
      <video
        ref={ref}
        // Kaynak ancak kare ekrana girdiğinde bağlanır.
        src={baglandi ? `/videos/${video.id}.mp4` : undefined}
        // Kaynak bağlandığı anda tarayıcı kendiliğinden başlatsın — etkideki
        // play() çağrısı buna ek güvence.
        autoPlay={autoplay}
        poster={`/videos/${video.id}.jpg`}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${video.title} — ${video.tool} ile yapılmış öğrenci çalışmasının ekran kaydı`}
        onLoadedData={(e) => {
          // Bazı tarayıcılar kaynak inmeden önceki play() isteğini yutuyor;
          // video hazır olduğunda bir kez daha deniyoruz.
          if (autoplay && ekranda && !elleDurduruldu.current) {
            (e.currentTarget as HTMLVideoElement).play().catch(() => undefined);
          }
        }}
        onPlay={() => setOynuyor(true)}
        onPause={() => setOynuyor(false)}
        className="block w-full aspect-video object-cover"
      />

      {etiket && (
        <p
          className={`pointer-events-none absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-8
                      bg-gradient-to-t from-night-950/90 to-transparent
                      text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-marker
                      ${kucuk ? 'hidden sm:block' : ''}`}
        >
          {video.tool}
        </p>
      )}

      {/* Elle başlat / durdur — otomatik oynatma kapalıysa tek yol budur */}
      <button
        type="button"
        onClick={degistir}
        aria-label={`${video.title} kaydını ${oynuyor ? 'durdur' : 'oynat'}`}
        className={`absolute inset-0 flex items-start justify-end ${kucuk ? 'p-1.5 sm:p-2.5' : 'p-2.5'}`}
      >
        <span
          className={`inline-flex items-center justify-center rounded-full
                      bg-white/90 text-night-950 shadow-lift transition-opacity
                      ${kucuk ? 'h-6 w-6 sm:h-8 sm:w-8' : 'h-8 w-8'}
                      ${oynuyor ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
        >
          {oynuyor ? (
            <Pause className={kucuk ? 'h-2.5 w-2.5 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5'} />
          ) : (
            <Play className={`fill-current ${kucuk ? 'h-2.5 w-2.5 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5'}`} />
          )}
        </span>
      </button>
    </div>
  );
}

interface Props {
  /**
   * "compact": ana sayfadaki 3x3 duvar — telefonda da 3 sütun kalır.
   * "card":    kaydın altında adı ve açıklaması olan kartlar.
   */
  variant?: 'compact' | 'card';
  /** Kaç kayıt gösterilsin */
  count?: number;
  /** Belirli kayıtlar — verilirse count yok sayılır */
  ids?: string[];
  /** "card" görünümünde ekranda görünen teknik ayrıntı da yazılsın mı? */
  detail?: boolean;
  className?: string;
}

export default function VideoWall({
  variant = 'compact',
  count = 9,
  ids,
  detail = false,
  className = '',
}: Props) {
  const [autoplay, setAutoplay] = useState(false);

  // Tercihi ilk boyamadan sonra okuyoruz; önceden üretilen HTML ile
  // tarayıcıdaki ilk hâl aynı kalsın diye.
  useEffect(() => setAutoplay(!otomatikKapali()), []);

  const liste = ids
    ? (ids.map((id) => STUDENT_VIDEOS.find((v) => v.id === id)).filter(Boolean) as StudentVideo[])
    : STUDENT_VIDEOS.slice(0, count);

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-3 gap-1.5 md:gap-3 ${className}`}>
        {liste.map((v) => (
          <Oynatici
            key={v.id}
            video={v}
            autoplay={autoplay}
            etiket
            kucuk
            eager
            radius="rounded-lg sm:rounded-xl md:rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${className}`}>
      {liste.map((v) => (
        <figure key={v.id} className="flex flex-col h-full rounded-3xl bg-white ring-1 ring-night-100 overflow-hidden">
          <Oynatici video={v} autoplay={autoplay} etiket={false} radius="" />
          <figcaption className="flex flex-col flex-1 p-5">
            <span className="badge-neutral self-start">{v.tool}</span>
            <h3 className="mt-3 text-lg font-extrabold text-night-950">{v.title}</h3>
            <p className="mt-2 text-night-600 leading-relaxed">{v.blurb}</p>
            {detail && (
              <p className="mt-4 pt-4 border-t border-night-100 text-sm text-night-500 leading-relaxed">
                {v.detail}
              </p>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
