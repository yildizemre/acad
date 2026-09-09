import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { SinifOzet, Kurs, Profil } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, tarihSaat } from '../ortak/ui';

export default function Siniflar() {
  const [formAcik, setFormAcik] = useState(false);

  const siniflar = useSorgu<SinifOzet[]>(
    () => sb.from('sinif_ozet').select('*').order('ad'),
    [],
  );
  const kurslar = useSorgu<Kurs[]>(() => sb.from('kurslar').select('*').order('baslik'), []);
  const egitmenler = useSorgu<Profil[]>(
    () => sb.from('profiller').select('*').eq('rol', 'egitmen').order('ad_soyad'),
    [],
  );

  const kursAdi = (id: string | null) =>
    kurslar.veri?.find((k) => k.id === id)?.baslik ?? '—';
  const egitmenAdi = (id: string | null) =>
    egitmenler.veri?.find((e) => e.id === id)?.ad_soyad ?? '— atanmadı';

  return (
    <>
      <Baslik
        baslik="Sınıflar"
        aciklama="Öğrencileri sınıflara ayırın; ödev, takvim ve materyal sınıfa özel atanır"
        sag={
          <button className="btn-ana" onClick={() => setFormAcik(true)}>
            <Plus className="h-4 w-4" />
            Yeni sınıf
          </button>
        }
      />

      {siniflar.hata && <Hata metin={siniflar.hata} />}
      {siniflar.yukleniyor && <Yukleniyor />}

      {siniflar.veri && siniflar.veri.length === 0 && (
        <Bos
          metin="Henüz sınıf yok"
          ipucu="Sınıf oluşturup öğrencileri atayın; eğitmen yalnızca kendi sınıfını görür."
        />
      )}

      {siniflar.veri && siniflar.veri.length > 0 && (
        <Tablo basliklar={['Sınıf', 'Kurs', 'Eğitmen', 'Öğrenci', 'Sonraki ders', '']}>
          {siniflar.veri.map((s) => (
            <tr key={s.id!} className="hover:bg-night-50">
              <td className="px-5 py-3.5 font-bold text-night-950">{s.ad}</td>
              <td className="px-5 py-3.5 text-night-600">{kursAdi(s.kurs_id)}</td>
              <td className="px-5 py-3.5 text-night-600">{egitmenAdi(s.egitmen_id)}</td>
              <td className="px-5 py-3.5 text-night-600">
                {s.ogrenci_sayisi ?? 0} / {s.kontenjan ?? 0}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">
                {tarihSaat(s.sonraki_ders)}
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  to={`/admin/siniflar/${s.id!}`}
                  className="text-sm font-bold text-night-950 underline decoration-2 underline-offset-4"
                >
                  Yönet
                </Link>
              </td>
            </tr>
          ))}
        </Tablo>
      )}

      {formAcik && (
        <YeniSinif
          kurslar={kurslar.veri ?? []}
          egitmenler={egitmenler.veri ?? []}
          onKapat={() => setFormAcik(false)}
          onEklendi={() => {
            setFormAcik(false);
            siniflar.yenile();
          }}
        />
      )}
    </>
  );
}

function YeniSinif({
  kurslar,
  egitmenler,
  onKapat,
  onEklendi,
}: {
  kurslar: Kurs[];
  egitmenler: Profil[];
  onKapat: () => void;
  onEklendi: () => void;
}) {
  const [ad, setAd] = useState('');
  const [kursId, setKursId] = useState('');
  const [egitmenId, setEgitmenId] = useState('');
  const [zoom, setZoom] = useState('');
  const [kontenjan, setKontenjan] = useState(8);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    const { error } = await sb.from('siniflar').insert({
      ad: ad.trim(),
      kurs_id: kursId || null,
      egitmen_id: egitmenId || null,
      zoom_url: zoom.trim() || null,
      kontenjan,
    });
    if (error) {
      setHata(hataMetni(error));
      setGonderiliyor(false);
      return;
    }
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form onSubmit={kaydet} className="my-8 w-full max-w-md rounded-3xl bg-white p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="text-xl font-extrabold text-night-950">Yeni sınıf</h2>
          <button type="button" onClick={onKapat} className="rounded-xl p-1.5 text-night-400 hover:bg-night-50" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="etiket">Sınıf adı *</span>
          <input
            className="girdi"
            required
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder="Scratch A — Salı/Perşembe 17:00"
          />
        </label>

        <label className="mb-4 block">
          <span className="etiket">Kurs</span>
          <select className="girdi" value={kursId} onChange={(e) => setKursId(e.target.value)}>
            <option value="">— seçilmedi —</option>
            {kurslar.map((k) => (
              <option key={k.id} value={k.id}>{k.baslik}</option>
            ))}
          </select>
        </label>

        <label className="mb-4 block">
          <span className="etiket">Eğitmen</span>
          <select className="girdi" value={egitmenId} onChange={(e) => setEgitmenId(e.target.value)}>
            <option value="">— atanmadı —</option>
            {egitmenler.map((e) => (
              <option key={e.id} value={e.id}>{e.ad_soyad}</option>
            ))}
          </select>
          <span className="mt-1.5 block text-xs text-night-500">
            Eğitmen yalnızca kendisine atanan sınıfları görebilir.
          </span>
        </label>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="etiket">Kontenjan</span>
            <input
              className="girdi"
              type="number"
              min={1}
              max={50}
              value={kontenjan}
              onChange={(e) => setKontenjan(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="mb-5 block">
          <span className="etiket">Zoom bağlantısı</span>
          <input className="girdi" value={zoom} onChange={(e) => setZoom(e.target.value)} placeholder="https://zoom.us/j/…" />
        </label>

        {hata && <Hata metin={hata} />}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">İptal</button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor}>
            {gonderiliyor ? 'Kaydediliyor…' : 'Sınıfı oluştur'}
          </button>
        </div>
      </form>
    </div>
  );
}
