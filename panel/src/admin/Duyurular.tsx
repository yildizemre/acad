import { useState, type FormEvent } from 'react';
import { Plus, X } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Duyuru, Sinif } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, tarihSaat } from '../ortak/ui';

export default function Duyurular() {
  const [acik, setAcik] = useState(false);
  const duyurular = useSorgu<Duyuru[]>(
    () => sb.from('duyurular').select('*').order('olusturuldu', { ascending: false }),
    [],
  );
  const siniflar = useSorgu<Sinif[]>(() => sb.from('siniflar').select('*').order('ad'), []);

  const sinifAdi = (id: string | null) =>
    id ? (siniflar.veri?.find((s) => s.id === id)?.ad ?? 'Sınıf') : 'Herkese';

  return (
    <>
      <Baslik
        baslik="Duyurular"
        aciklama="Sınıfa özel veya herkese açık"
        sag={
          <button className="btn-ana" onClick={() => setAcik(true)}>
            <Plus className="h-4 w-4" /> Yeni duyuru
          </button>
        }
      />
      {duyurular.hata && <Hata metin={duyurular.hata} />}
      {duyurular.yukleniyor && <Yukleniyor />}
      {duyurular.veri && duyurular.veri.length === 0 && <Bos metin="Henüz duyuru yok" />}

      <div className="space-y-3">
        {(duyurular.veri ?? []).map((d) => (
          <article key={d.id} className="kart p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2.5">
              <h3 className="font-extrabold text-night-950">{d.baslik}</h3>
              {d.onemli && <Rozet renk="kirmizi">Önemli</Rozet>}
              <Rozet renk="mavi">{sinifAdi(d.sinif_id)}</Rozet>
              {!d.yayinda && <Rozet>Yayında değil</Rozet>}
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-night-600">{d.icerik}</p>
            <p className="mt-3 text-xs text-night-400">{tarihSaat(d.olusturuldu)}</p>
          </article>
        ))}
      </div>

      {acik && (
        <YeniDuyuru
          siniflar={siniflar.veri ?? []}
          onKapat={() => setAcik(false)}
          onEklendi={() => { setAcik(false); duyurular.yenile(); }}
        />
      )}
    </>
  );
}

function YeniDuyuru({
  siniflar, onKapat, onEklendi,
}: { siniflar: Sinif[]; onKapat: () => void; onEklendi: () => void }) {
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [sinifId, setSinifId] = useState('');
  const [onemli, setOnemli] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    const { error } = await sb.from('duyurular').insert({
      baslik: baslik.trim(),
      icerik: icerik.trim(),
      sinif_id: sinifId || null,
      onemli,
    });
    if (error) { setHata(hataMetni(error)); setGonderiliyor(false); return; }
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form onSubmit={kaydet} className="my-8 w-full max-w-md rounded-3xl bg-white p-7">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-extrabold text-night-950">Yeni duyuru</h2>
          <button type="button" onClick={onKapat} className="rounded-xl p-1.5 text-night-400 hover:bg-night-50" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-4 block">
          <span className="etiket">Başlık *</span>
          <input className="girdi" required value={baslik} onChange={(e) => setBaslik(e.target.value)} />
        </label>
        <label className="mb-4 block">
          <span className="etiket">İçerik *</span>
          <textarea className="girdi" rows={5} required value={icerik} onChange={(e) => setIcerik(e.target.value)} />
        </label>
        <label className="mb-4 block">
          <span className="etiket">Kime</span>
          <select className="girdi" value={sinifId} onChange={(e) => setSinifId(e.target.value)}>
            <option value="">Herkese</option>
            {siniflar.map((s) => <option key={s.id!} value={s.id}>{s.ad}</option>)}
          </select>
        </label>
        <label className="mb-5 flex cursor-pointer items-center gap-2.5">
          <input type="checkbox" className="h-4 w-4" checked={onemli} onChange={(e) => setOnemli(e.target.checked)} />
          <span className="text-sm text-night-700">Önemli olarak işaretle</span>
        </label>
        {hata && <Hata metin={hata} />}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">İptal</button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor}>
            {gonderiliyor ? 'Kaydediliyor…' : 'Yayınla'}
          </button>
        </div>
      </form>
    </div>
  );
}
