import { useState, type FormEvent } from 'react';
import { UserPlus, Search, X } from 'lucide-react';
import { sb, hataMetni } from '../lib/supabase';
import { useSorgu } from '../lib/veri';
import type { Profil, Rol } from '../lib/tipler';
import { Baslik, Yukleniyor, Bos, Hata, Rozet, Tablo, tarih } from '../ortak/ui';

// ─────────────────────────────────────────────────────────────────────────────
// KULLANICI YÖNETİMİ
//
// Admin buradan öğrenci, eğitmen ve yönetici hesabı açar.
//
// ⚠️ HESAP AÇMA SINIRI: Supabase'de başkasının adına hesap açmak `service_role`
//    anahtarı ister ve o anahtar tarayıcıya konulamaz. Bu yüzden şu an hesap
//    `signUp` ile açılıyor; bu, admin'in oturumunu yeni kullanıcıya çevirir.
//    Aşağıdaki `hesapAc` bunu fark edip admin oturumunu geri yüklüyor.
//
//    Doğru çözüm: service_role ile çalışan bir Edge Function. Yapılacaklar
//    listesinde; o gelene kadar bu yol çalışıyor ama admin'in oturumu bir an
//    için değişiyor.
// ─────────────────────────────────────────────────────────────────────────────

const ROL_ETIKET: Record<Rol, string> = {
  admin: 'Yönetici',
  egitmen: 'Eğitmen',
  ogrenci: 'Öğrenci',
};

export default function Ogrenciler() {
  const [arama, setArama] = useState('');
  const [rolSuzgec, setRolSuzgec] = useState<Rol | 'hepsi'>('hepsi');
  const [formAcik, setFormAcik] = useState(false);

  const { veri, yukleniyor, hata, yenile } = useSorgu<Profil[]>(
    () => sb.from('profiller').select('*').order('olusturuldu', { ascending: false }),
    [],
  );

  const liste = (veri ?? []).filter((p) => {
    if (rolSuzgec !== 'hepsi' && p.rol !== rolSuzgec) return false;
    if (!arama.trim()) return true;
    const a = arama.toLocaleLowerCase('tr');
    return (
      p.ad_soyad.toLocaleLowerCase('tr').includes(a) ||
      p.kullanici_adi.toLocaleLowerCase('tr').includes(a) ||
      (p.telefon ?? '').includes(a)
    );
  });

  return (
    <>
      <Baslik
        baslik="Kullanıcılar"
        aciklama="Öğrenci, eğitmen ve yönetici hesapları"
        sag={
          <button className="btn-ana" onClick={() => setFormAcik(true)}>
            <UserPlus className="h-4 w-4" />
            Yeni kullanıcı
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-night-400" />
          <input
            className="girdi pl-10"
            placeholder="Ad, kullanıcı adı veya telefon"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {(['hepsi', 'ogrenci', 'egitmen', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRolSuzgec(r)}
              className={`rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                rolSuzgec === r
                  ? 'bg-night-950 text-white'
                  : 'bg-white text-night-600 ring-1 ring-night-100 hover:text-night-950'
              }`}
            >
              {r === 'hepsi' ? 'Hepsi' : ROL_ETIKET[r]}
            </button>
          ))}
        </div>
      </div>

      {hata && <Hata metin={hata} />}
      {yukleniyor && <Yukleniyor />}

      {!yukleniyor && liste.length === 0 && (
        <Bos
          metin="Kullanıcı bulunamadı"
          ipucu={arama ? 'Arama ölçütünü değiştirin.' : 'Sağ üstten yeni kullanıcı ekleyin.'}
        />
      )}

      {!yukleniyor && liste.length > 0 && (
        <Tablo basliklar={['Ad Soyad', 'Kullanıcı adı', 'Rol', 'Telefon', 'Veli', 'Kayıt']}>
          {liste.map((p) => (
            <tr key={p.id} className="hover:bg-night-50">
              <td className="px-5 py-3.5">
                <span className="font-bold text-night-950">{p.ad_soyad}</span>
                {!p.aktif && <span className="ml-2 text-xs text-brick-600">pasif</span>}
              </td>
              <td className="px-5 py-3.5 font-mono text-xs text-night-600">{p.kullanici_adi}</td>
              <td className="px-5 py-3.5">
                <Rozet renk={p.rol === 'admin' ? 'sari' : p.rol === 'egitmen' ? 'mavi' : 'notr'}>
                  {ROL_ETIKET[p.rol]}
                </Rozet>
              </td>
              <td className="px-5 py-3.5 text-night-600">{p.telefon ?? '—'}</td>
              <td className="px-5 py-3.5 text-night-600">
                {p.veli_adi ? (
                  <>
                    {p.veli_adi}
                    <span className="block text-xs text-night-400">{p.veli_telefon}</span>
                  </>
                ) : (
                  '—'
                )}
              </td>
              <td className="px-5 py-3.5 whitespace-nowrap text-night-500">
                {tarih(p.kayit_tarihi)}
              </td>
            </tr>
          ))}
        </Tablo>
      )}

      {formAcik && (
        <YeniKullanici
          onKapat={() => setFormAcik(false)}
          onEklendi={() => {
            setFormAcik(false);
            yenile();
          }}
        />
      )}
    </>
  );
}

function YeniKullanici({ onKapat, onEklendi }: { onKapat: () => void; onEklendi: () => void }) {
  const [adSoyad, setAdSoyad] = useState('');
  const [kullaniciAdi, setKullaniciAdi] = useState('');
  const [eposta, setEposta] = useState('');
  const [telefon, setTelefon] = useState('');
  const [sifre, setSifre] = useState('');
  const [rol, setRol] = useState<Rol>('ogrenci');
  const [veliAdi, setVeliAdi] = useState('');
  const [veliTel, setVeliTel] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  async function hesapAc(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);

    // Admin'in oturumunu saklıyoruz: signUp yeni kullanıcıyla oturum açtığı için
    // sonrasında geri yüklememiz gerekiyor.
    const { data: mevcut } = await sb.auth.getSession();

    const kullanilacakEposta = eposta.trim() || `${kullaniciAdi.trim().toLowerCase()}@ogrenci.local`;

    const { error } = await sb.auth.signUp({
      email: kullanilacakEposta,
      password: sifre,
      options: {
        data: {
          ad_soyad: adSoyad.trim(),
          kullanici_adi: kullaniciAdi.trim().toLowerCase(),
          rol,
          telefon: telefon.trim() || null,
        },
      },
    });

    if (error) {
      setHata(hataMetni(error));
      setGonderiliyor(false);
      return;
    }

    // Admin oturumunu geri yükle
    if (mevcut.session) {
      await sb.auth.setSession({
        access_token: mevcut.session.access_token,
        refresh_token: mevcut.session.refresh_token,
      });
    }

    // Veli bilgisi profil tetikleyicisinden gelmiyor; ayrıca yazıyoruz.
    if (rol === 'ogrenci' && (veliAdi.trim() || veliTel.trim())) {
      await sb
        .from('profiller')
        .update({ veli_adi: veliAdi.trim() || null, veli_telefon: veliTel.trim() || null })
        .eq('kullanici_adi', kullaniciAdi.trim().toLowerCase());
    }

    setGonderiliyor(false);
    onEklendi();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-night-950/50 p-4">
      <form
        onSubmit={hesapAc}
        className="my-8 w-full max-w-lg rounded-3xl bg-white p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-night-950">Yeni kullanıcı</h2>
            <p className="mt-1 text-sm text-night-500">
              E-posta boş bırakılırsa kullanıcı adından otomatik üretilir.
            </p>
          </div>
          <button
            type="button"
            onClick={onKapat}
            className="rounded-xl p-1.5 text-night-400 hover:bg-night-50 hover:text-night-950"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="etiket">Ad Soyad *</span>
            <input className="girdi" required value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} />
          </label>
          <label>
            <span className="etiket">Kullanıcı adı *</span>
            <input
              className="girdi"
              required
              value={kullaniciAdi}
              onChange={(e) => setKullaniciAdi(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
              placeholder="elify"
            />
          </label>
          <label>
            <span className="etiket">Rol *</span>
            <select className="girdi" value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
              <option value="ogrenci">Öğrenci</option>
              <option value="egitmen">Eğitmen</option>
              <option value="admin">Yönetici</option>
            </select>
          </label>
          <label>
            <span className="etiket">Şifre *</span>
            <input
              className="girdi"
              type="text"
              required
              minLength={6}
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="en az 6 karakter"
            />
          </label>
          <label>
            <span className="etiket">Telefon</span>
            <input className="girdi" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="05XXXXXXXXX" />
          </label>
          <label>
            <span className="etiket">E-posta</span>
            <input className="girdi" type="email" value={eposta} onChange={(e) => setEposta(e.target.value)} placeholder="boş bırakılabilir" />
          </label>

          {rol === 'ogrenci' && (
            <>
              <label>
                <span className="etiket">Veli adı</span>
                <input className="girdi" value={veliAdi} onChange={(e) => setVeliAdi(e.target.value)} />
              </label>
              <label>
                <span className="etiket">Veli telefonu</span>
                <input className="girdi" value={veliTel} onChange={(e) => setVeliTel(e.target.value)} />
              </label>
            </>
          )}
        </div>

        {hata && <div className="mt-5"><Hata metin={hata} /></div>}

        <div className="mt-7 flex gap-3">
          <button type="button" onClick={onKapat} className="btn-ikinci flex-1">
            İptal
          </button>
          <button type="submit" className="btn-ana flex-1" disabled={gonderiliyor}>
            {gonderiliyor ? 'Açılıyor…' : 'Hesabı aç'}
          </button>
        </div>
      </form>
    </div>
  );
}
