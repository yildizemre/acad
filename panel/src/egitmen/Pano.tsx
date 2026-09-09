import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';
import { sb } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import { useOturum } from '../giris/Oturum';
import type { SinifOzet, Etkinlik, OdevTeslimi } from '../lib/tipler';
import { Baslik, Sayac, Yukleniyor, Bos, Hata, Tablo, tarihSaat, goreceli } from '../ortak/ui';

export default function Pano() {
  const { profil } = useOturum();

  // RLS zaten yalnızca kendi sınıflarını döndürüyor.
  const siniflar = useSorgu<SinifOzet[]>(() => sb.from('sinif_ozet').select('*').order('ad'), []);
  const yaklasan = useSorgu<Etkinlik[]>(
    () => sb.from('takvim').select('*').gte('baslangic', new Date().toISOString())
            .order('baslangic').limit(5),
    [],
  );
  // Değerlendirilmeyi bekleyen teslimler
  const bekleyen = useSorgu<OdevTeslimi[]>(
    () => sb.from('odev_teslimleri').select('*').is('puan', null)
            .order('teslim_tarihi', { ascending: false }),
    [],
  );

  const ogrenciToplam = (siniflar.veri ?? []).reduce((n, s) => n + (s.ogrenci_sayisi ?? 0), 0);

  return (
    <>
      <Baslik baslik={`Merhaba ${profil?.ad_soyad ?? ''}`} aciklama="Sınıflarınızın özeti" />

      {siniflar.hata && <Hata metin={siniflar.hata} />}
      {siniflar.yukleniyor && <Yukleniyor />}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Sayac etiket="Sınıfım" deger={siniflar.veri?.length ?? 0} />
        <Sayac etiket="Öğrencim" deger={ogrenciToplam} />
        <Sayac
          etiket="Bekleyen değerlendirme"
          deger={bekleyen.veri?.length ?? 0}
          alt={bekleyen.veri?.length ? 'Ödevler sayfasından değerlendirin' : undefined}
          renk={bekleyen.veri?.length ? 'bg-marker' : 'bg-white'}
        />
      </div>

      <h2 className="mb-4 text-lg font-extrabold text-night-950">Yaklaşan dersleriniz</h2>
      {yaklasan.veri && yaklasan.veri.length === 0 && (
        <Bos metin="Yaklaşan ders yok" ipucu="Takvim sayfasından ders ekleyebilirsiniz." />
      )}
      {yaklasan.veri && yaklasan.veri.length > 0 && (
        <Tablo basliklar={['Ders', 'Ne zaman', '']}>
          {yaklasan.veri.map((e) => (
            <tr key={e.id}>
              <td className="px-5 py-3.5 font-bold text-night-950">{e.baslik}</td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-600">
                {tarihSaat(e.baslangic)}
                <span className="block text-xs text-night-400">{goreceli(e.baslangic)}</span>
              </td>
              <td className="px-5 py-3.5 text-right">
                {e.zoom_url && (
                  <a href={e.zoom_url} target="_blank" rel="noopener noreferrer"
                     className="inline-flex items-center gap-1.5 text-sm font-bold text-night-950 hover:text-electric-500">
                    <Video className="h-3.5 w-3.5" /> Katıl
                  </a>
                )}
              </td>
            </tr>
          ))}
        </Tablo>
      )}

      <h2 className="mb-4 mt-8 text-lg font-extrabold text-night-950">Sınıflarım</h2>
      {siniflar.veri && siniflar.veri.length === 0 && (
        <Bos metin="Size atanmış sınıf yok" ipucu="Yönetim sizi bir sınıfa atadığında burada görünür." />
      )}
      {siniflar.veri && siniflar.veri.length > 0 && (
        <Tablo basliklar={['Sınıf', 'Öğrenci', 'Ödev', '']}>
          {siniflar.veri.map((s) => (
            <tr key={s.id!} className="hover:bg-night-50">
              <td className="px-5 py-3.5 font-bold text-night-950">{s.ad}</td>
              <td className="px-5 py-3.5 text-night-600">{s.ogrenci_sayisi ?? 0}</td>
              <td className="px-5 py-3.5 text-night-600">{s.odev_sayisi ?? 0}</td>
              <td className="px-5 py-3.5 text-right">
                <Link to={`/egitmen/siniflar/${s.id!}`}
                      className="text-sm font-bold text-night-950 underline decoration-2 underline-offset-4">Aç</Link>
              </td>
            </tr>
          ))}
        </Tablo>
      )}
    </>
  );
}
