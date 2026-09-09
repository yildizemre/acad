import { useState, type FormEvent } from 'react';
import { Award, Plus, X } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Sertifika, Profil, Kurs } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, tarih } from '../ortak/ui';

/**
 * Sertifika verme.
 *
 * ⚠️ Sertifika yalnızca sahibine görünür — RLS bunu garanti ediyor
 *    ("öğrenci kendi sertifikasını görür" politikası). Öğrenci başkasının
 *    belgesini adres değiştirerek bile göremez.
 */
export default function Sertifikalar() {
  const [acik, setAcik] = useState(false);

  const belgeler = useSorgu<(Sertifika & { profiller: Profil; kurslar: Kurs })[]>(
    () => sb.from('sertifikalar').select('*, profiller!inner(*), kurslar!inner(*)')
            .order('verilis', { ascending: false }) as never,
    [],
  );
  const ogrenciler = useSorgu<Profil[]>(
    () => sb.from('profiller').select('*').eq('rol', 'ogrenci').order('ad_soyad'), []);
  const kurslar = useSorgu<Kurs[]>(() => sb.from('kurslar').select('*').order('baslik'), []);

  return (
    <>
      <Baslik
        baslik="Sertifikalar"
        aciklama="Öğrenci ve kurs seçin — belge yalnızca o öğrencinin sayfasında görünür"
        sag={<button className="btn-ana" onClick={() => setAcik(true)}><Plus className="h-4 w-4" /> Sertifika ver</button>}
      />
      {belgeler.hata && <Hata metin={belgeler.hata} />}
      {belgeler.yukleniyor && <Yukleniyor />}
      {belgeler.veri && belgeler.veri.length === 0 && (
        <Bos metin="Henüz sertifika verilmemiş" ipucu="Kursu tamamlayan öğrencilere belge verin." />
      )}
      {belgeler.veri && belgeler.veri.length > 0 && (
        <Tablo basliklar={['Öğrenci', 'Kurs', 'Belge no', 'Tarih']}>
          {belgeler.veri.map((s) => (
            <tr key={s.id!}>
              <td className="px-5 py-3.5 font-bold text-night-950">{s.profiller.ad_soyad}</td>
              <td className="px-5 py-3.5 text-night-600">{s.kurslar.baslik}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-night-600">{s.belge_no}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-500">{tarih(s.verilis)}</td>
            </tr>
          ))}
        </Tablo>
      )}
      {acik && (
        <YeniSertifika
          ogrenciler={ogrenciler.veri ?? []} kurslar={kurslar.veri ?? []}
          onKapat={() => setAcik(false)}
          onEklendi={() => { setAcik(false); belgeler.yenile(); }}
        />
      )}
    </>
  );
}

function YeniSertifika({
  ogrenciler, kurslar, onKapat, onEklendi,
}: { ogrenciler: Profil[]; kurslar: Kurs[]; onKapat: () => void; onEklendi: () => void }) {
  const [ogrenciId, setOgrenciId] = useState('');
  const [kursId, setKursId] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    // Belge numarasını veritabanındaki fonksiyon üretiyor.
    const { data: no, error: noHatasi } = await sb.rpc('sertifika_no_uret' as never);
    if (noHatasi) { setHata(hataMetni(noHatasi)); setGonderiliyor(false); return; }

    const { error } = await sb.from('sertifikalar').insert({
      ogrenci_id: ogrenciId, kurs_id: kursId, belge_no: String(no),
    });
    if (error) { setHata(hataMetni(error)); setGonderiliyor(false); return; }
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form onSubmit={kaydet} className="my-8 w-full max-w-md rounded-3xl bg-white p-7">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-night-950">
            <Award className="h-5 w-5" /> Sertifika ver
          </h2>
          <button type="button" onClick={onKapat} className="rounded-xl p-1.5 text-night-400 hover:bg-night-50" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-4 block">
          <span className="etiket">Öğrenci *</span>
          <select className="girdi" required value={ogrenciId} onChange={(e) => setOgrenciId(e.target.value)}>
            <option value="">— seçin —</option>
            {ogrenciler.map((o) => <option key={o.id} value={o.id}>{o.ad_soyad}</option>)}
          </select>
        </label>
        <label className="mb-5 block">
          <span className="etiket">Kurs *</span>
          <select className="girdi" required value={kursId} onChange={(e) => setKursId(e.target.value)}>
            <option value="">— seçin —</option>
            {kurslar.map((k) => <option key={k.id} value={k.id}>{k.baslik}</option>)}
          </select>
        </label>
        {hata && <Hata metin={hata} />}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">İptal</button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor}>
            {gonderiliyor ? 'Veriliyor…' : 'Sertifikayı ver'}
          </button>
        </div>
      </form>
    </div>
  );
}
