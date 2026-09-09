import { Link } from 'react-router-dom';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import { Baslik, Sayac, Yukleniyor, Hata, Tablo, tarihSaat, Bos } from '../ortak/ui';
import type { SinifOzet, Etkinlik } from '../lib/tipler';

interface Ozet {
  ogrenci: number;
  egitmen: number;
  sinif: number;
  kurs: number;
}

export default function Pano() {
  const { veri, yukleniyor, hata } = useSorgu<Ozet>(async () => {
    // Sayımları tek tek çekiyoruz; head+count ile satır gövdesi inmiyor.
    const say = async (tablo: 'profiller' | 'siniflar' | 'kurslar', filtre?: [string, string]) => {
      let s = sb.from(tablo).select('*', { count: 'exact', head: true });
      if (filtre) s = s.eq(filtre[0], filtre[1]);
      const { count } = await s;
      return count ?? 0;
    };
    const [ogrenci, egitmen, sinif, kurs] = await Promise.all([
      say('profiller', ['rol', 'ogrenci']),
      say('profiller', ['rol', 'egitmen']),
      say('siniflar'),
      say('kurslar'),
    ]);
    return { data: { ogrenci, egitmen, sinif, kurs }, error: null };
  }, []);

  const siniflar = useSorgu<SinifOzet[]>(
    () => sb.from('sinif_ozet').select('*').order('ad'),
    [],
  );

  const yaklasan = useSorgu<Etkinlik[]>(
    () =>
      sb
        .from('takvim')
        .select('*')
        .gte('baslangic', new Date().toISOString())
        .order('baslangic')
        .limit(6),
    [],
  );

  return (
    <>
      <Baslik baslik="Pano" aciklama="Akademinin genel durumu" />

      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}

      {veri && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Sayac etiket="Öğrenci" deger={veri.ogrenci} />
          <Sayac etiket="Eğitmen" deger={veri.egitmen} />
          <Sayac etiket="Sınıf" deger={veri.sinif} />
          <Sayac etiket="Kurs" deger={veri.kurs} />
        </div>
      )}

      <h2 className="mb-4 text-lg font-extrabold text-night-950">Sınıflar</h2>
      {siniflar.yukleniyor && <Yukleniyor />}
      {siniflar.veri && siniflar.veri.length === 0 && (
        <Bos metin="Henüz sınıf yok" ipucu="Sınıflar sayfasından ilk sınıfı oluşturun." />
      )}
      {siniflar.veri && siniflar.veri.length > 0 && (
        <Tablo basliklar={['Sınıf', 'Öğrenci', 'Ödev', 'Sonraki ders', '']}>
          {siniflar.veri.map((s) => (
            <tr key={s.id!} className="hover:bg-night-50">
              <td className="px-5 py-3.5 font-bold text-night-950">{s.ad}</td>
              <td className="px-5 py-3.5 text-night-600">
                {s.ogrenci_sayisi ?? 0} / {s.kontenjan ?? 0}
              </td>
              <td className="px-5 py-3.5 text-night-600">{s.odev_sayisi ?? 0}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">
                {tarihSaat(s.sonraki_ders)}
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  to={`/admin/siniflar/${s.id!}`}
                  className="text-sm font-bold text-night-950 underline decoration-2 underline-offset-4"
                >
                  Aç
                </Link>
              </td>
            </tr>
          ))}
        </Tablo>
      )}

      <h2 className="mb-4 mt-8 text-lg font-extrabold text-night-950">Yaklaşan dersler</h2>
      {yaklasan.veri && yaklasan.veri.length === 0 && (
        <Bos metin="Yaklaşan ders yok" ipucu="Eğitmenler kendi sınıflarına ders programı ekler." />
      )}
      {yaklasan.veri && yaklasan.veri.length > 0 && (
        <Tablo basliklar={['Başlık', 'Ne zaman']}>
          {yaklasan.veri.map((e) => (
            <tr key={e.id}>
              <td className="px-5 py-3.5 font-bold text-night-950">{e.baslik}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">
                {tarihSaat(e.baslangic)}
              </td>
            </tr>
          ))}
        </Tablo>
      )}
    </>
  );
}
