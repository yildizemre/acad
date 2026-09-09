import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { useOturum, rolKoku } from './Oturum';

/**
 * Giriş ekranı.
 *
 * Kullanıcı adı veya e-posta kabul eder — öğrencilerin çoğunun e-postası
 * olmadığı için kullanıcı adıyla giriş şart.
 */
export default function GirisSayfasi() {
  const { girisYap, session, profil, yukleniyor } = useOturum();
  const [kimlik, setKimlik] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Zaten girmişse kendi paneline gönder
  if (!yukleniyor && session && profil) {
    return <Navigate to={rolKoku(profil.rol)} replace />;
  }

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      await girisYap(kimlik, sifre);
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Giriş yapılamadı.');
      setGonderiliyor(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night-950 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Hype Academia" className="mx-auto mb-6 h-12 w-auto" />
          <h1 className="text-2xl font-extrabold text-white">Panel girişi</h1>
          <p className="mt-2 text-sm text-night-400">
            Öğrenci, eğitmen ve yönetim paneli
          </p>
        </div>

        <form onSubmit={gonder} className="rounded-3xl bg-white p-7">
          <label className="mb-4 block">
            <span className="etiket">Kullanıcı adı veya e-posta</span>
            <input
              className="girdi"
              value={kimlik}
              onChange={(e) => setKimlik(e.target.value)}
              autoComplete="username"
              autoFocus
              required
              placeholder="ornek: elify"
            />
          </label>

          <label className="mb-5 block">
            <span className="etiket">Şifre</span>
            <input
              className="girdi"
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {hata && (
            <p className="mb-5 flex items-start gap-2.5 rounded-xl bg-brick-50 p-3.5 text-sm text-brick-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {hata}
            </p>
          )}

          <button type="submit" className="btn-ana w-full" disabled={gonderiliyor}>
            {gonderiliyor ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Giriş yapılıyor…
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Giriş yap
              </>
            )}
          </button>

          <p className="mt-5 text-center text-xs leading-relaxed text-night-500">
            Şifrenizi bilmiyorsanız kayıt ekibimizle iletişime geçin.
            <br />
            Hesaplar yönetim tarafından açılır.
          </p>
        </form>
      </div>
    </div>
  );
}
