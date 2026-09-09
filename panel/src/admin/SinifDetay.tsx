import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, UserMinus, Video } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Sinif, Profil, Kurs } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Tablo, Rozet } from '../ortak/ui';

/**
 * Sınıf yönetimi — asıl iş burada: hangi öğrenci hangi sınıfta.
 *
 * Öğrenciyi sınıfa attığında ilgili kursa kaydı da açılıyor; aksi hâlde
 * öğrenci sınıfta görünür ama "Kurslarım" boş kalırdı.
 */
export default function SinifDetay() {
  const { id } = useParams<{ id: string }>();
  const [islem, setIslem] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  const sinif = useSorgu<Sinif>(
    () => sb.from('siniflar').select('*').eq('id', id!).single(),
    [id],
  );

  const kurs = useSorgu<Kurs | null>(
    async () => {
      if (!sinif.veri?.kurs_id) return { data: null, error: null };
      return sb.from('kurslar').select('*').eq('id', sinif.veri.kurs_id).single();
    },
    [sinif.veri?.kurs_id],
  );

  const uyeler = useSorgu<{ ogrenci_id: string; profiller: Profil }[]>(
    () =>
      sb
        .from('sinif_ogrencileri')
        .select('ogrenci_id, profiller!inner(*)')
        .eq('sinif_id', id!) as never,
    [id],
  );

  const tumOgrenciler = useSorgu<Profil[]>(
    () => sb.from('profiller').select('*').eq('rol', 'ogrenci').order('ad_soyad'),
    [],
  );

  const uyeIdleri = new Set((uyeler.veri ?? []).map((u) => u.ogrenci_id));
  const eklenebilir = (tumOgrenciler.veri ?? []).filter((o) => !uyeIdleri.has(o.id));

  async function ekle(ogrenciId: string) {
    setHata(null);
    setIslem(ogrenciId);

    const { error } = await sb
      .from('sinif_ogrencileri')
      .insert({ sinif_id: id!, ogrenci_id: ogrenciId });

    if (error) {
      setHata(hataMetni(error));
      setIslem(null);
      return;
    }

    // Sınıfın kursu varsa öğrencinin kurs kaydını da aç.
    if (sinif.veri?.kurs_id) {
      const { error: kayitHatasi } = await sb
        .from('kayitlar')
        .insert({ ogrenci_id: ogrenciId, kurs_id: sinif.veri.kurs_id });
      // Zaten kayıtlıysa sorun değil (benzersiz kısıt).
      if (kayitHatasi && !String(kayitHatasi.message).includes('duplicate')) {
        setHata(hataMetni(kayitHatasi));
      }
    }

    setIslem(null);
    uyeler.yenile();
  }

  async function cikar(ogrenciId: string) {
    setHata(null);
    setIslem(ogrenciId);
    const { error } = await sb
      .from('sinif_ogrencileri')
      .delete()
      .eq('sinif_id', id!)
      .eq('ogrenci_id', ogrenciId);
    if (error) setHata(hataMetni(error));
    setIslem(null);
    uyeler.yenile();
  }

  if (sinif.yukleniyor) return <Yukleniyor />;
  if (sinif.hata) return <Hata metin={sinif.hata} />;
  if (!sinif.veri) return <Bos metin="Sınıf bulunamadı" />;

  return (
    <>
      <Link
        to="/admin/siniflar"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-night-500 hover:text-night-950"
      >
        <ArrowLeft className="h-4 w-4" />
        Sınıflar
      </Link>

      <Baslik
        baslik={sinif.veri.ad}
        aciklama={`${kurs.veri?.baslik ?? 'Kurs atanmadı'} · ${uyeIdleri.size}/${sinif.veri.kontenjan} öğrenci`}
        sag={
          sinif.veri.zoom_url ? (
            <a href={sinif.veri.zoom_url} target="_blank" rel="noopener noreferrer" className="btn-ikinci">
              <Video className="h-4 w-4" />
              Zoom
            </a>
          ) : undefined
        }
      />

      {hata && <div className="mb-5"><Hata metin={hata} /></div>}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sınıftaki öğrenciler */}
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-night-950">
            Sınıftaki öğrenciler ({uyeIdleri.size})
          </h2>
          {uyeler.yukleniyor && <Yukleniyor />}
          {uyeler.veri && uyeler.veri.length === 0 && (
            <Bos metin="Bu sınıfta öğrenci yok" ipucu="Sağdaki listeden ekleyin." />
          )}
          {uyeler.veri && uyeler.veri.length > 0 && (
            <Tablo basliklar={['Öğrenci', 'Veli', '']}>
              {uyeler.veri.map((u) => (
                <tr key={u.ogrenci_id}>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-night-950">{u.profiller.ad_soyad}</span>
                    <span className="block font-mono text-xs text-night-400">
                      {u.profiller.kullanici_adi}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-night-600">
                    {u.profiller.veli_adi ?? '—'}
                    {u.profiller.veli_telefon && (
                      <span className="block text-xs text-night-400">{u.profiller.veli_telefon}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => cikar(u.ogrenci_id)}
                      disabled={islem === u.ogrenci_id}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brick-600 hover:text-brick-700 disabled:opacity-50"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                      Çıkar
                    </button>
                  </td>
                </tr>
              ))}
            </Tablo>
          )}
        </section>

        {/* Eklenebilecek öğrenciler */}
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-night-950">
            Eklenebilecek öğrenciler ({eklenebilir.length})
          </h2>
          {tumOgrenciler.yukleniyor && <Yukleniyor />}
          {eklenebilir.length === 0 && !tumOgrenciler.yukleniyor && (
            <Bos
              metin="Eklenecek öğrenci yok"
              ipucu="Kullanıcılar sayfasından yeni öğrenci hesabı açabilirsiniz."
            />
          )}
          {eklenebilir.length > 0 && (
            <Tablo basliklar={['Öğrenci', '']}>
              {eklenebilir.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-night-950">{o.ad_soyad}</span>
                    <span className="block font-mono text-xs text-night-400">{o.kullanici_adi}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => ekle(o.id)}
                      disabled={islem === o.id || uyeIdleri.size >= sinif.veri!.kontenjan}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500 disabled:opacity-40"
                      title={
                        uyeIdleri.size >= sinif.veri!.kontenjan ? 'Kontenjan dolu' : undefined
                      }
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Ekle
                    </button>
                  </td>
                </tr>
              ))}
            </Tablo>
          )}
          {uyeIdleri.size >= sinif.veri.kontenjan && (
            <p className="mt-4">
              <Rozet renk="sari">Kontenjan dolu ({sinif.veri.kontenjan})</Rozet>
            </p>
          )}
        </section>
      </div>
    </>
  );
}
