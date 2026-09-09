import { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu, dosyaBaglantisi } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { OdevTeslimi, Odev, Profil } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, tarihSaat } from '../ortak/ui';

type Teslim = OdevTeslimi & { odevler: Odev; profiller: Profil };

/**
 * Değerlendirme ekranı.
 *
 * RLS sayesinde burada yalnızca eğitmenin KENDİ öğrencilerinin teslimleri
 * geliyor; ayrıca filtre yazmaya gerek yok.
 */
export default function Odevler() {
  const { profil } = useOturum();
  const [sadeceBekleyen, setSadeceBekleyen] = useState(true);

  const teslimler = useSorgu<Teslim[]>(
    () => sb.from('odev_teslimleri').select('*, odevler!inner(*), profiller!inner(*)')
            .order('teslim_tarihi', { ascending: false }) as never,
    [],
  );

  const liste = (teslimler.veri ?? []).filter((t) => (sadeceBekleyen ? t.puan === null : true));

  return (
    <>
      <Baslik baslik="Ödevler" aciklama="Öğrencilerinizin teslimleri" />

      <div className="mb-5 flex gap-1.5">
        {[[true, 'Bekleyenler'], [false, 'Hepsi']].map(([d, ad]) => (
          <button key={String(d)} onClick={() => setSadeceBekleyen(d as boolean)}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
              sadeceBekleyen === d ? 'bg-night-950 text-white' : 'bg-white text-night-600 ring-1 ring-night-100'}`}>
            {ad as string}
          </button>
        ))}
      </div>

      {teslimler.hata && <Hata metin={teslimler.hata} />}
      {teslimler.yukleniyor && <Yukleniyor />}
      {!teslimler.yukleniyor && liste.length === 0 && (
        <Bos metin={sadeceBekleyen ? 'Bekleyen teslim yok' : 'Henüz teslim yok'} />
      )}

      <div className="space-y-4">
        {liste.map((t) => (
          <TeslimKarti key={t.id} teslim={t} degerlendirenId={profil!.id} onKaydedildi={teslimler.yenile} />
        ))}
      </div>
    </>
  );
}

function TeslimKarti({
  teslim, degerlendirenId, onKaydedildi,
}: { teslim: Teslim; degerlendirenId: string; onKaydedildi: () => void }) {
  const [puan, setPuan] = useState<string>(teslim.puan?.toString() ?? '');
  const [geri, setGeri] = useState(teslim.geri_bildirim ?? '');
  const [hata, setHata] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  async function kaydet() {
    setKaydediliyor(true); setHata(null);
    const { error } = await sb.from('odev_teslimleri').update({
      puan: puan === '' ? null : Number(puan),
      geri_bildirim: geri.trim() || null,
      degerlendiren: degerlendirenId,
      degerlendirme_tarihi: new Date().toISOString(),
    }).eq('id', teslim.id);
    if (error) { setHata(hataMetni(error)); setKaydediliyor(false); return; }
    setKaydediliyor(false);
    onKaydedildi();
  }

  async function dosyaAc() {
    if (!teslim.dosya_yolu) return;
    const url = await dosyaBaglantisi('odev-teslim', teslim.dosya_yolu);
    if (url) window.open(url, '_blank', 'noopener');
  }

  return (
    <article className="kart p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <h3 className="font-extrabold text-night-950">{teslim.profiller.ad_soyad}</h3>
        <Rozet renk="mavi">{teslim.odevler.baslik}</Rozet>
        {teslim.puan === null
          ? <Rozet renk="sari">Değerlendirilmedi</Rozet>
          : <Rozet renk="yesil">{teslim.puan} / {teslim.odevler.max_puan}</Rozet>}
        <span className="ml-auto text-xs text-night-400">{tarihSaat(teslim.teslim_tarihi)}</span>
      </div>

      {teslim.metin && (
        <p className="mb-3 whitespace-pre-wrap rounded-xl bg-night-50 p-4 text-sm leading-relaxed text-night-700">
          {teslim.metin}
        </p>
      )}

      {teslim.dosya_yolu && (
        <button onClick={dosyaAc}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500">
          <FileText className="h-4 w-4" /> Teslim edilen dosyayı aç
        </button>
      )}

      <div className="grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end">
        <label>
          <span className="etiket">Puan</span>
          <input className="girdi" type="number" min={0} max={teslim.odevler.max_puan}
                 value={puan} onChange={(e) => setPuan(e.target.value)} />
        </label>
        <label>
          <span className="etiket">Geri bildirim</span>
          <input className="girdi" value={geri} onChange={(e) => setGeri(e.target.value)}
                 placeholder="Neyi iyi yapmış, neye bakmalı?" />
        </label>
        <button onClick={kaydet} className="btn-ana" disabled={kaydediliyor}>
          <Check className="h-4 w-4" />
          {kaydediliyor ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>

      {hata && <div className="mt-3"><Hata metin={hata} /></div>}
    </article>
  );
}
