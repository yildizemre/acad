import { useState, type FormEvent } from 'react';
import { Plus, X, Video } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { Etkinlik, Sinif } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, tarihSaat, goreceli } from '../ortak/ui';

export default function Takvim() {
  const { profil } = useOturum();
  const [acik, setAcik] = useState(false);

  const etkinlikler = useSorgu<Etkinlik[]>(
    () => sb.from('takvim').select('*').order('baslangic', { ascending: true }), []);
  const siniflar = useSorgu<Sinif[]>(() => sb.from('siniflar').select('*').order('ad'), []);

  const simdi = Date.now();
  const gelecek = (etkinlikler.veri ?? []).filter((e) => new Date(e.baslangic).getTime() >= simdi);
  const gecmis = (etkinlikler.veri ?? []).filter((e) => new Date(e.baslangic).getTime() < simdi).reverse();

  const sinifAdi = (id: string | null) => siniflar.veri?.find((s) => s.id === id)?.ad ?? '—';

  return (
    <>
      <Baslik
        baslik="Takvim"
        aciklama="Sınıflarınızın ders programı"
        sag={<button className="btn-ana" onClick={() => setAcik(true)}><Plus className="h-4 w-4" /> Ders ekle</button>}
      />

      {etkinlikler.hata && <Hata metin={etkinlikler.hata} />}
      {etkinlikler.yukleniyor && <Yukleniyor />}

      <h2 className="mb-4 text-lg font-extrabold text-night-950">Yaklaşan ({gelecek.length})</h2>
      {gelecek.length === 0 && <Bos metin="Yaklaşan ders yok" ipucu="Sağ üstten ders ekleyin." />}
      <div className="mb-8 space-y-3">
        {gelecek.map((e) => (
          <article key={e.id} className="kart flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-night-950">{e.baslik}</h3>
              <p className="mt-1 text-sm text-night-500">
                {sinifAdi(e.sinif_id)} · {tarihSaat(e.baslangic)} · {goreceli(e.baslangic)}
              </p>
            </div>
            {e.zoom_url && (
              <a href={e.zoom_url} target="_blank" rel="noopener noreferrer" className="btn-ikinci">
                <Video className="h-4 w-4" /> Katıl
              </a>
            )}
          </article>
        ))}
      </div>

      {gecmis.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-extrabold text-night-950">Geçmiş ({gecmis.length})</h2>
          <div className="space-y-2">
            {gecmis.slice(0, 10).map((e) => (
              <article key={e.id} className="kart flex flex-wrap items-center gap-3 p-4 opacity-70">
                <span className="font-bold text-night-950">{e.baslik}</span>
                <Rozet>{sinifAdi(e.sinif_id)}</Rozet>
                <span className="ml-auto text-sm text-night-500">{tarihSaat(e.baslangic)}</span>
              </article>
            ))}
          </div>
        </>
      )}

      {acik && (
        <YeniEtkinlik
          siniflar={siniflar.veri ?? []} olusturanId={profil!.id}
          onKapat={() => setAcik(false)}
          onEklendi={() => { setAcik(false); etkinlikler.yenile(); }}
        />
      )}
    </>
  );
}

function YeniEtkinlik({
  siniflar, olusturanId, onKapat, onEklendi,
}: { siniflar: Sinif[]; olusturanId: string; onKapat: () => void; onEklendi: () => void }) {
  const [baslik, setBaslik] = useState('');
  const [sinifId, setSinifId] = useState(siniflar[0]?.id ?? '');
  const [baslangic, setBaslangic] = useState('');
  const [dakika, setDakika] = useState(60);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true); setHata(null);
    const bas = new Date(baslangic);
    const bit = new Date(bas.getTime() + dakika * 60000);
    const sinif = siniflar.find((s) => s.id === sinifId);

    const { error } = await sb.from('takvim').insert({
      sinif_id: sinifId, kurs_id: sinif?.kurs_id ?? null,
      baslik: baslik.trim(), tur: 'canli_ders',
      baslangic: bas.toISOString(), bitis: bit.toISOString(),
      zoom_url: sinif?.zoom_url ?? null, olusturan_id: olusturanId,
    });
    if (error) { setHata(hataMetni(error)); setGonderiliyor(false); return; }
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form onSubmit={kaydet} className="my-8 w-full max-w-md rounded-3xl bg-white p-7">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-extrabold text-night-950">Ders ekle</h2>
          <button type="button" onClick={onKapat} className="rounded-xl p-1.5 text-night-400 hover:bg-night-50" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-4 block">
          <span className="etiket">Başlık *</span>
          <input className="girdi" required value={baslik} onChange={(e) => setBaslik(e.target.value)}
                 placeholder="Hafta 5 — Listeler" />
        </label>
        <label className="mb-4 block">
          <span className="etiket">Sınıf *</span>
          <select className="girdi" required value={sinifId} onChange={(e) => setSinifId(e.target.value)}>
            {siniflar.map((s) => <option key={s.id!} value={s.id}>{s.ad}</option>)}
          </select>
          <span className="mt-1.5 block text-xs text-night-500">
            Zoom bağlantısı sınıfın kayıtlı bağlantısından alınır.
          </span>
        </label>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="etiket">Başlangıç *</span>
            <input className="girdi" type="datetime-local" required value={baslangic}
                   onChange={(e) => setBaslangic(e.target.value)} />
          </label>
          <label>
            <span className="etiket">Süre (dk)</span>
            <input className="girdi" type="number" min={15} max={300} step={15} value={dakika}
                   onChange={(e) => setDakika(Number(e.target.value))} />
          </label>
        </div>
        {hata && <Hata metin={hata} />}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">İptal</button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor || !sinifId}>
            {gonderiliyor ? 'Kaydediliyor…' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}
