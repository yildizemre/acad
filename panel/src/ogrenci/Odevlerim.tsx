import { useState, type FormEvent } from 'react';
import { Upload, FileText, Check } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu, dosyaYukle, dosyaBaglantisi } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { Odev, OdevTeslimi } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, tarihSaat, goreceli } from '../ortak/ui';

/**
 * Öğrencinin ödev teslim ekranı.
 *
 * Dosya `odev-teslim/<ogrenci_id>/<odev_id>/…` yoluna gidiyor; depo politikası
 * öğrencinin yalnızca kendi klasörüne yazmasına izin veriyor.
 *
 * ⚠️ Öğrenci teslimini güncelleyebilir ama PUANA dokunamaz — veritabanındaki
 *    `teslim_puani_korumasi` tetikleyicisi engelliyor.
 */
export default function Odevlerim() {
  const odevler = useSorgu<Odev[]>(
    () => sb.from('odevler').select('*').eq('yayinda', true).order('son_tarih', { nullsFirst: false }),
    [],
  );
  const teslimler = useSorgu<OdevTeslimi[]>(() => sb.from('odev_teslimleri').select('*'), []);

  const teslimMap = new Map((teslimler.veri ?? []).map((t) => [t.odev_id, t]));

  return (
    <>
      <Baslik baslik="Ödevlerim" aciklama="Teslim et, eğitmen notunu gör" />
      {odevler.hata && <Hata metin={odevler.hata} />}
      {odevler.yukleniyor && <Yukleniyor />}
      {odevler.veri?.length === 0 && (
        <Bos metin="Henüz ödev yok" ipucu="Eğitmenin ödev verdiğinde burada görünecek." />
      )}

      <div className="space-y-4">
        {(odevler.veri ?? []).map((o) => (
          <OdevKarti
            key={o.id}
            odev={o}
            teslim={teslimMap.get(o.id) ?? null}
            onDegisti={() => {
              teslimler.yenile();
            }}
          />
        ))}
      </div>
    </>
  );
}

function OdevKarti({
  odev,
  teslim,
  onDegisti,
}: {
  odev: Odev;
  teslim: OdevTeslimi | null;
  onDegisti: () => void;
}) {
  const { profil } = useOturum();
  const [metin, setMetin] = useState(teslim?.metin ?? '');
  const [dosya, setDosya] = useState<File | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const gecti = odev.son_tarih ? new Date(odev.son_tarih).getTime() < Date.now() : false;
  const degerlendirildi = teslim?.puan !== null && teslim?.puan !== undefined;

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      let yol = teslim?.dosya_yolu ?? null;
      if (dosya) {
        // Yol düzeni depo politikasıyla eşleşmeli
        yol = `${profil!.id}/${odev.id}/${Date.now()}-${dosya.name}`;
        await dosyaYukle('odev-teslim', yol, dosya);
      }

      const govde = { metin: metin.trim() || null, dosya_yolu: yol };

      const { error } = teslim
        ? await sb.from('odev_teslimleri').update(govde).eq('id', teslim.id)
        : await sb.from('odev_teslimleri').insert({
            odev_id: odev.id,
            ogrenci_id: profil!.id,
            ...govde,
          });

      if (error) throw new Error(hataMetni(error));
      setDosya(null);
      onDegisti();
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Gönderilemedi');
    } finally {
      setGonderiliyor(false);
    }
  }

  async function dosyaAc() {
    if (!teslim?.dosya_yolu) return;
    const url = await dosyaBaglantisi('odev-teslim', teslim.dosya_yolu);
    if (url) window.open(url, '_blank', 'noopener');
  }

  return (
    <article className="kart p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <h3 className="text-lg font-extrabold text-night-950">{odev.baslik}</h3>
        {degerlendirildi && (
          <Rozet renk="yesil">
            {teslim!.puan} / {odev.max_puan}
          </Rozet>
        )}
        {!degerlendirildi && teslim && <Rozet renk="mavi">Teslim edildi</Rozet>}
        {!teslim && gecti && <Rozet renk="kirmizi">Süresi geçti</Rozet>}
        {!teslim && !gecti && <Rozet renk="sari">Bekliyor</Rozet>}
      </div>

      {odev.aciklama && (
        <p className="mb-4 whitespace-pre-wrap leading-relaxed text-night-600">{odev.aciklama}</p>
      )}

      {odev.son_tarih && (
        <p className="mb-5 text-sm text-night-500">
          Son teslim: {tarihSaat(odev.son_tarih)} · {goreceli(odev.son_tarih)}
        </p>
      )}

      {/* Eğitmen notu */}
      {teslim?.geri_bildirim && (
        <div className="mb-5 rounded-xl bg-tint-mint p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-night-600">
            Eğitmen notu
          </p>
          <p className="leading-relaxed text-night-800">{teslim.geri_bildirim}</p>
        </div>
      )}

      {degerlendirildi ? (
        <div className="flex flex-wrap items-center gap-4">
          <p className="flex items-center gap-2 text-sm font-bold text-night-950">
            <Check className="h-4 w-4" />
            Bu ödev değerlendirildi
          </p>
          {teslim?.dosya_yolu && (
            <button
              onClick={dosyaAc}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500"
            >
              <FileText className="h-4 w-4" />
              Gönderdiğim dosya
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={gonder}>
          <label className="mb-4 block">
            <span className="etiket">Açıklaman</span>
            <textarea
              className="girdi"
              rows={3}
              value={metin}
              onChange={(e) => setMetin(e.target.value)}
              placeholder="Ne yaptığını kısaca anlat"
            />
          </label>

          <label className="mb-4 block">
            <span className="etiket">Dosya {teslim?.dosya_yolu && '(yenisini seçersen eskisi değişir)'}</span>
            <input
              type="file"
              className="girdi py-2"
              onChange={(e) => setDosya(e.target.files?.[0] ?? null)}
            />
          </label>

          {teslim?.dosya_yolu && (
            <button
              type="button"
              onClick={dosyaAc}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500"
            >
              <FileText className="h-4 w-4" />
              Şu an yüklü olan dosya
            </button>
          )}

          {hata && <div className="mb-4"><Hata metin={hata} /></div>}

          <button type="submit" className="btn-ana" disabled={gonderiliyor}>
            <Upload className="h-4 w-4" />
            {gonderiliyor ? 'Gönderiliyor…' : teslim ? 'Teslimi güncelle' : 'Teslim et'}
          </button>
        </form>
      )}
    </article>
  );
}
