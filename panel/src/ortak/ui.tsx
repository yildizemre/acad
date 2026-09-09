import type { ReactNode } from 'react';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Panelin her yerinde tekrar eden küçük parçalar.
// ─────────────────────────────────────────────────────────────────────────────

export function Baslik({
  baslik,
  aciklama,
  sag,
}: {
  baslik: string;
  aciklama?: string;
  sag?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold text-night-950">{baslik}</h1>
        {aciklama && <p className="mt-1.5 text-night-500">{aciklama}</p>}
      </div>
      {sag && <div className="flex shrink-0 flex-wrap gap-2">{sag}</div>}
    </div>
  );
}

export function Yukleniyor({ metin = 'Yükleniyor' }: { metin?: string }) {
  return (
    <div className="flex items-center gap-2.5 py-12 text-night-500">
      <Loader2 className="h-4 w-4 animate-spin" />
      {metin}…
    </div>
  );
}

export function Bos({ metin, ipucu }: { metin: string; ipucu?: string }) {
  return (
    <div className="kart flex flex-col items-center gap-3 px-6 py-14 text-center">
      <Inbox className="h-8 w-8 text-night-300" />
      <p className="font-bold text-night-950">{metin}</p>
      {ipucu && <p className="max-w-sm text-sm text-night-500">{ipucu}</p>}
    </div>
  );
}

export function Hata({ metin }: { metin: string }) {
  return (
    <p className="flex items-start gap-2.5 rounded-xl bg-brick-50 p-4 text-sm leading-relaxed text-brick-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      {metin}
    </p>
  );
}

const ROZET_RENK = {
  notr: 'bg-night-100 text-night-700',
  yesil: 'bg-tint-mint text-night-900',
  sari: 'bg-marker text-night-950',
  mavi: 'bg-tint-sky text-night-900',
  kirmizi: 'bg-brick-50 text-brick-700',
} as const;

export function Rozet({
  children,
  renk = 'notr',
}: {
  children: ReactNode;
  renk?: keyof typeof ROZET_RENK;
}) {
  return <span className={`rozet ${ROZET_RENK[renk]}`}>{children}</span>;
}

/** Yüzdelik ilerleme çubuğu */
export function Ilerleme({ yuzde }: { yuzde: number }) {
  const d = Math.max(0, Math.min(100, yuzde));
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-night-100">
        <div className="h-full rounded-full bg-night-950 transition-all" style={{ width: `${d}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-bold text-night-600">
        %{Math.round(d)}
      </span>
    </div>
  );
}

export function Tablo({ basliklar, children }: { basliklar: string[]; children: ReactNode }) {
  return (
    <div className="kart overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-night-100">
            {basliklar.map((b) => (
              <th key={b} className="whitespace-nowrap px-5 py-3.5 font-bold text-night-500">
                {b}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-night-100">{children}</tbody>
      </table>
    </div>
  );
}

/** Basit sayı kutusu — panolarda kullanılıyor */
export function Sayac({
  etiket,
  deger,
  alt,
  renk = 'bg-white',
}: {
  etiket: string;
  deger: string | number;
  alt?: string;
  renk?: string;
}) {
  return (
    <div className={`rounded-2xl p-5 ring-1 ring-night-100 ${renk}`}>
      <p className="text-sm text-night-500">{etiket}</p>
      <p className="mt-1 text-3xl font-extrabold text-night-950">{deger}</p>
      {alt && <p className="mt-1 text-xs text-night-500">{alt}</p>}
    </div>
  );
}

// ─── Tarih biçimleri ────────────────────────────────────────────────────────

export function tarih(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function tarihSaat(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function saat(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

/** "3 gün sonra" · "2 saat önce" */
export function goreceli(iso: string | null): string {
  if (!iso) return '—';
  const fark = new Date(iso).getTime() - Date.now();
  const dk = Math.round(fark / 60000);
  const bicim = new Intl.RelativeTimeFormat('tr', { numeric: 'auto' });
  if (Math.abs(dk) < 60) return bicim.format(dk, 'minute');
  const saatF = Math.round(dk / 60);
  if (Math.abs(saatF) < 24) return bicim.format(saatF, 'hour');
  return bicim.format(Math.round(saatF / 24), 'day');
}
