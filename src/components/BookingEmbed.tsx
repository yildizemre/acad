import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { track } from '../lib/analytics';
import { CAL_LINK } from '../lib/booking';

/**
 * Cal.com takvimi. .env dosyasına VITE_CAL_LINK eklenmediği sürece hiçbir şey
 * render etmez ve hiçbir dış istek yapmaz — site bugünkü form akışıyla çalışır.
 *
 *   VITE_CAL_LINK=hypeacademia/deneme-dersi
 *
 * Kurulum: cal.com üzerinde "Deneme Dersi" adında 60 dakikalık bir etkinlik
 * açın, takviminizi bağlayın, bağlantıdaki kullanıcı/etkinlik kısmını yukarıya yazın.
 */

export default function BookingEmbed() {
  const [loaded, setLoaded] = useState(false);
  if (!CAL_LINK) return null;

  const src = `https://cal.com/${CAL_LINK}?embed=true&theme=light&hideEventTypeDetails=false`;

  return (
    <div className="rounded-2xl bg-night-50 overflow-hidden bg-white">
      {!loaded && (
        <div className="flex flex-col items-center justify-center gap-3 h-[640px] text-night-500">
          <CalendarDays className="w-6 h-6 text-night-400" />
          <span className="text-sm">Takvim yükleniyor…</span>
        </div>
      )}
      <iframe
        src={src}
        title="Ücretsiz deneme dersi takvimi"
        className={`w-full ${loaded ? 'h-[640px]' : 'h-0'}`}
        onLoad={() => {
          setLoaded(true);
          track('kurs_goruntulendi', { kaynak: 'takvim' });
        }}
      />
    </div>
  );
}
