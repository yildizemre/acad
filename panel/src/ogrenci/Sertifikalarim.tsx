import { Award, Download } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useSorgu, dosyaBaglantisi } from '../lib/veri';
import type { Sertifika, Kurs } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, tarih } from '../ortak/ui';

/**
 * Öğrencinin sertifikaları.
 *
 * ⚠️ RLS gereği burada YALNIZCA bu öğrencinin belgeleri gelir. Başkasının
 *    sertifikası, adres değiştirilse bile görünmez.
 */
export default function Sertifikalarim() {
  const { veri, yukleniyor, hata } = useSorgu<(Sertifika & { kurslar: Kurs })[]>(
    () => sb.from('sertifikalar').select('*, kurslar!inner(*)').order('verilis', { ascending: false }) as never,
    [],
  );

  async function indir(yol: string | null) {
    if (!yol) return;
    const url = await dosyaBaglantisi('sertifika', yol);
    if (url) window.open(url, '_blank', 'noopener');
  }

  return (
    <>
      <Baslik baslik="Sertifikalarım" aciklama="Tamamladığın kursların belgeleri" />
      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}
      {veri?.length === 0 && (
        <Bos
          metin="Henüz sertifikan yok"
          ipucu="Kursu tamamladığında belgen burada görünecek."
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {(veri ?? []).map((s) => (
          <article key={s.id!} className="kart p-6">
            <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-marker text-night-950">
              <Award className="h-6 w-6" />
            </span>
            <h3 className="mb-1 text-lg font-extrabold text-night-950">{s.kurslar.baslik}</h3>
            <p className="mb-1 text-sm text-night-500">{tarih(s.verilis)} tarihinde verildi</p>
            <p className="mb-5 font-mono text-xs text-night-400">{s.belge_no}</p>

            {s.dosya_yolu ? (
              <button onClick={() => indir(s.dosya_yolu)} className="btn-ikinci">
                <Download className="h-4 w-4" />
                Belgeyi indir
              </button>
            ) : (
              <p className="text-xs text-night-500">
                Belge dosyası hazırlanıyor. Numaranla doğrulama yapılabilir.
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
