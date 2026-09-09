import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Video, FileText, Plus, X } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu, dosyaYukle, dosyaBaglantisi } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { Sinif, Profil, DersMateryali, Odev } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, Rozet, tarihSaat } from '../ortak/ui';

/**
 * Eğitmenin sınıf ekranı: öğrenciler, materyal yükleme, ödev verme.
 *
 * "Hoca ders sonrası PDF yüklesin" isteği burada karşılanıyor — dosya
 * `materyaller/<sinif_id>/…` yoluna gidiyor ve depo politikası yalnızca o
 * sınıfın eğitmenine yazma, o sınıfın öğrencilerine okuma izni veriyor.
 */
export default function SinifDetay() {
  const { id } = useParams<{ id: string }>();
  const { profil } = useOturum();
  const [sekme, setSekme] = useState<'ogrenciler' | 'materyal' | 'odev'>('ogrenciler');

  const sinif = useSorgu<Sinif>(() => sb.from('siniflar').select('*').eq('id', id!).single(), [id]);

  const uyeler = useSorgu<{ ogrenci_id: string; profiller: Profil }[]>(
    () => sb.from('sinif_ogrencileri').select('ogrenci_id, profiller!inner(*)').eq('sinif_id', id!) as never,
    [id],
  );

  const materyaller = useSorgu<DersMateryali[]>(
    () => sb.from('ders_materyalleri').select('*').eq('sinif_id', id!)
            .order('olusturuldu', { ascending: false }),
    [id],
  );

  const odevler = useSorgu<Odev[]>(
    () => sb.from('odevler').select('*').eq('sinif_id', id!)
            .order('olusturuldu', { ascending: false }),
    [id],
  );

  if (sinif.yukleniyor) return <Yukleniyor />;
  if (sinif.hata) return <Hata metin={sinif.hata} />;
  if (!sinif.veri) return <Bos metin="Sınıf bulunamadı" ipucu="Bu sınıf size atanmamış olabilir." />;

  const sekmeler = [
    ['ogrenciler', `Öğrenciler (${uyeler.veri?.length ?? 0})`],
    ['materyal', `Materyaller (${materyaller.veri?.length ?? 0})`],
    ['odev', `Ödevler (${odevler.veri?.length ?? 0})`],
  ] as const;

  return (
    <>
      <Link to="/egitmen/siniflar" className="mb-6 inline-flex items-center gap-1.5 text-sm text-night-500 hover:text-night-950">
        <ArrowLeft className="h-4 w-4" /> Sınıflarım
      </Link>

      <Baslik
        baslik={sinif.veri.ad}
        aciklama={`${uyeler.veri?.length ?? 0} öğrenci`}
        sag={
          sinif.veri.zoom_url ? (
            <a href={sinif.veri.zoom_url} target="_blank" rel="noopener noreferrer" className="btn-ikinci">
              <Video className="h-4 w-4" /> Zoom
            </a>
          ) : undefined
        }
      />

      <div className="mb-6 flex flex-wrap gap-1.5">
        {sekmeler.map(([k, ad]) => (
          <button
            key={k}
            onClick={() => setSekme(k)}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              sekme === k ? 'bg-night-950 text-white' : 'bg-white text-night-600 ring-1 ring-night-100'
            }`}
          >
            {ad}
          </button>
        ))}
      </div>

      {sekme === 'ogrenciler' && (
        <>
          {uyeler.yukleniyor && <Yukleniyor />}
          {uyeler.veri?.length === 0 && <Bos metin="Sınıfta öğrenci yok" ipucu="Yönetim öğrenci atadığında burada görünür." />}
          {uyeler.veri && uyeler.veri.length > 0 && (
            <Tablo basliklar={['Öğrenci', 'Kullanıcı adı', 'Veli']}>
              {uyeler.veri.map((u) => (
                <tr key={u.ogrenci_id}>
                  <td className="px-5 py-3.5 font-bold text-night-950">{u.profiller.ad_soyad}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-night-600">{u.profiller.kullanici_adi}</td>
                  <td className="px-5 py-3.5 text-night-600">
                    {u.profiller.veli_adi ?? '—'}
                    {u.profiller.veli_telefon && <span className="block text-xs text-night-400">{u.profiller.veli_telefon}</span>}
                  </td>
                </tr>
              ))}
            </Tablo>
          )}
        </>
      )}

      {sekme === 'materyal' && (
        <MateryalBolumu sinifId={id!} yukleyenId={profil!.id} liste={materyaller.veri ?? []} onDegisti={materyaller.yenile} />
      )}

      {sekme === 'odev' && (
        <OdevBolumu sinifId={id!} kursId={sinif.veri.kurs_id} olusturanId={profil!.id} liste={odevler.veri ?? []} onDegisti={odevler.yenile} />
      )}
    </>
  );
}

// ─── Materyaller ────────────────────────────────────────────────────────────

function MateryalBolumu({
  sinifId, yukleyenId, liste, onDegisti,
}: { sinifId: string; yukleyenId: string; liste: DersMateryali[]; onDegisti: () => void }) {
  const [baslik, setBaslik] = useState('');
  const [dosya, setDosya] = useState<File | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);

  async function yukle(e: FormEvent) {
    e.preventDefault();
    if (!dosya) return;
    setHata(null);
    setYukleniyor(true);
    try {
      // Yol düzeni depo politikasıyla eşleşmeli: materyaller/<sinif_id>/<dosya>
      const yol = `${sinifId}/${Date.now()}-${dosya.name}`;
      await dosyaYukle('materyaller', yol, dosya);

      const uzanti = dosya.name.split('.').pop()?.toLowerCase() ?? '';
      const tur = uzanti === 'pdf' ? 'pdf'
        : ['ppt', 'pptx'].includes(uzanti) ? 'sunum'
        : ['mp4', 'mov', 'webm'].includes(uzanti) ? 'video'
        : ['py', 'js', 'sb3'].includes(uzanti) ? 'kod' : 'belge';

      const { error } = await sb.from('ders_materyalleri').insert({
        sinif_id: sinifId, baslik: baslik.trim() || dosya.name,
        tur, dosya_yolu: yol, yukleyen_id: yukleyenId,
      });
      if (error) throw new Error(hataMetni(error));

      setBaslik(''); setDosya(null);
      onDegisti();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  async function ac(yol: string | null) {
    if (!yol) return;
    const url = await dosyaBaglantisi('materyaller', yol);
    if (url) window.open(url, '_blank', 'noopener');
  }

  return (
    <>
      <form onSubmit={yukle} className="kart mb-6 p-5">
        <h3 className="mb-4 font-extrabold text-night-950">Ders sonrası materyal yükle</h3>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <label>
            <span className="etiket">Başlık</span>
            <input className="girdi" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Hafta 4 — ders notları" />
          </label>
          <label>
            <span className="etiket">Dosya *</span>
            <input type="file" required className="girdi py-2" onChange={(e) => setDosya(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {hata && <div className="mt-4"><Hata metin={hata} /></div>}
        <button type="submit" className="btn-ana mt-4" disabled={yukleniyor || !dosya}>
          <Upload className="h-4 w-4" />
          {yukleniyor ? 'Yükleniyor…' : 'Yükle'}
        </button>
      </form>

      {liste.length === 0 && <Bos metin="Henüz materyal yok" ipucu="Ders sonrası PDF, sunum veya kod dosyası yükleyin." />}
      {liste.length > 0 && (
        <Tablo basliklar={['Materyal', 'Tür', 'Tarih', '']}>
          {liste.map((m) => (
            <tr key={m.id}>
              <td className="px-5 py-3.5 font-bold text-night-950">{m.baslik}</td>
              <td className="px-5 py-3.5"><Rozet renk="mavi">{m.tur}</Rozet></td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-500">{tarihSaat(m.olusturuldu)}</td>
              <td className="px-5 py-3.5 text-right">
                <button onClick={() => ac(m.dosya_yolu)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500">
                  <FileText className="h-3.5 w-3.5" /> Aç
                </button>
              </td>
            </tr>
          ))}
        </Tablo>
      )}
    </>
  );
}

// ─── Ödevler ────────────────────────────────────────────────────────────────

function OdevBolumu({
  sinifId, kursId, olusturanId, liste, onDegisti,
}: { sinifId: string; kursId: string | null; olusturanId: string; liste: Odev[]; onDegisti: () => void }) {
  const [acik, setAcik] = useState(false);

  return (
    <>
      <div className="mb-5">
        <button className="btn-ana" onClick={() => setAcik(true)}>
          <Plus className="h-4 w-4" /> Yeni ödev
        </button>
      </div>

      {liste.length === 0 && <Bos metin="Bu sınıfa ödev verilmemiş" />}
      {liste.length > 0 && (
        <Tablo basliklar={['Ödev', 'Son tarih', 'Puan', 'Durum']}>
          {liste.map((o) => (
            <tr key={o.id}>
              <td className="px-5 py-3.5">
                <span className="font-bold text-night-950">{o.baslik}</span>
                {o.aciklama && <span className="block max-w-md text-xs text-night-500">{o.aciklama}</span>}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">{tarihSaat(o.son_tarih)}</td>
              <td className="px-5 py-3.5 text-night-600">{o.max_puan}</td>
              <td className="px-5 py-3.5">
                <Rozet renk={o.yayinda ? 'yesil' : 'notr'}>{o.yayinda ? 'Yayında' : 'Taslak'}</Rozet>
              </td>
            </tr>
          ))}
        </Tablo>
      )}

      {acik && (
        <YeniOdev
          sinifId={sinifId} kursId={kursId} olusturanId={olusturanId}
          onKapat={() => setAcik(false)}
          onEklendi={() => { setAcik(false); onDegisti(); }}
        />
      )}
    </>
  );
}

function YeniOdev({
  sinifId, kursId, olusturanId, onKapat, onEklendi,
}: { sinifId: string; kursId: string | null; olusturanId: string; onKapat: () => void; onEklendi: () => void }) {
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [sonTarih, setSonTarih] = useState('');
  const [maxPuan, setMaxPuan] = useState(100);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function kaydet(e: FormEvent) {
    e.preventDefault();
    setGonderiliyor(true); setHata(null);
    const { error } = await sb.from('odevler').insert({
      sinif_id: sinifId, kurs_id: kursId, baslik: baslik.trim(),
      aciklama: aciklama.trim() || null,
      son_tarih: sonTarih ? new Date(sonTarih).toISOString() : null,
      max_puan: maxPuan, olusturan_id: olusturanId,
    });
    if (error) { setHata(hataMetni(error)); setGonderiliyor(false); return; }
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form onSubmit={kaydet} className="my-8 w-full max-w-md rounded-3xl bg-white p-7">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-extrabold text-night-950">Yeni ödev</h2>
          <button type="button" onClick={onKapat} className="rounded-xl p-1.5 text-night-400 hover:bg-night-50" aria-label="Kapat">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-4 block">
          <span className="etiket">Başlık *</span>
          <input className="girdi" required value={baslik} onChange={(e) => setBaslik(e.target.value)} />
        </label>
        <label className="mb-4 block">
          <span className="etiket">Açıklama</span>
          <textarea className="girdi" rows={4} value={aciklama} onChange={(e) => setAciklama(e.target.value)}
                    placeholder="Öğrenciden ne bekliyorsunuz?" />
        </label>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="etiket">Son teslim</span>
            <input className="girdi" type="datetime-local" value={sonTarih} onChange={(e) => setSonTarih(e.target.value)} />
          </label>
          <label>
            <span className="etiket">Tam puan</span>
            <input className="girdi" type="number" min={1} max={1000} value={maxPuan}
                   onChange={(e) => setMaxPuan(Number(e.target.value))} />
          </label>
        </div>
        {hata && <Hata metin={hata} />}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">İptal</button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor}>
            {gonderiliyor ? 'Kaydediliyor…' : 'Ödevi ver'}
          </button>
        </div>
      </form>
    </div>
  );
}
