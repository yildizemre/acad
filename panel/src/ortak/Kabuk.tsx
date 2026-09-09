import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Loader2 } from 'lucide-react';
import { useOturum, rolKoku } from '../giris/Oturum';
import type { Rol } from '../lib/tipler';

// ─────────────────────────────────────────────────────────────────────────────
// PANEL KABUĞU — kenar menü + üst şerit + içerik
//
// Üç rol aynı kabuğu kullanır; değişen yalnızca menü maddeleri.
// ─────────────────────────────────────────────────────────────────────────────

export interface MenuOgesi {
  yol: string;
  ad: string;
  ikon: ReactNode;
  /** Alt yolları da aynı maddeyi işaretlesin (örn. /admin/siniflar/abc) */
  kok?: boolean;
}

export function YuklemeEkrani({ metin = 'Yükleniyor' }: { metin?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-night-50">
      <div className="flex items-center gap-3 text-night-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {metin}…
      </div>
    </div>
  );
}

/**
 * Rol koruması.
 *
 * Arayüzü yanlış panele girmekten korur. Asıl veri güvenliği RLS'te —
 * burası yalnızca kullanıcıyı doğru yere yönlendirir.
 */
export function RolKapisi({ izinli }: { izinli: Rol[] }) {
  const { session, profil, yukleniyor } = useOturum();
  const konum = useLocation();

  if (yukleniyor) return <YuklemeEkrani />;
  if (!session) return <Navigate to="/giris" replace state={{ nereden: konum.pathname }} />;
  if (!profil) return <YuklemeEkrani metin="Profil okunuyor" />;
  if (!izinli.includes(profil.rol)) return <Navigate to={rolKoku(profil.rol)} replace />;

  return <Outlet />;
}

const ROL_ADI: Record<Rol, string> = {
  admin: 'Yönetim',
  egitmen: 'Eğitmen',
  ogrenci: 'Öğrenci',
};

export default function Kabuk({ menu }: { menu: MenuOgesi[] }) {
  const { profil, cikisYap } = useOturum();
  const [mobilAcik, setMobilAcik] = useState(false);

  const menuIcerik = (
    <nav className="flex flex-col gap-1">
      {menu.map((m) => (
        <NavLink
          key={m.yol}
          to={m.yol}
          end={!m.kok}
          onClick={() => setMobilAcik(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-night-950 text-white'
                : 'text-night-600 hover:bg-night-100 hover:text-night-950'
            }`
          }
        >
          {m.ikon}
          {m.ad}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen lg:flex">
      {/* Kenar menü — masaüstü */}
      <aside className="hidden w-64 shrink-0 border-r border-night-100 bg-white lg:flex lg:flex-col">
        <div className="border-b border-night-100 p-5">
          <img src="/logo.png" alt="Hype Academia" className="h-8 w-auto" />
        </div>
        <div className="flex-1 overflow-y-auto p-3">{menuIcerik}</div>
        <KullaniciKarti profil={profil} onCikis={cikisYap} />
      </aside>

      {/* Üst şerit — mobil */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-night-100 bg-white px-4 py-3 lg:hidden">
        <img src="/logo.png" alt="Hype Academia" className="h-7 w-auto" />
        <button
          onClick={() => setMobilAcik((v) => !v)}
          className="rounded-xl p-2 text-night-950 hover:bg-night-50"
          aria-label={mobilAcik ? 'Menüyü kapat' : 'Menüyü aç'}
          aria-expanded={mobilAcik}
        >
          {mobilAcik ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {mobilAcik && (
        <div className="border-b border-night-100 bg-white p-3 lg:hidden">
          {menuIcerik}
          <KullaniciKarti profil={profil} onCikis={cikisYap} />
        </div>
      )}

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}

function KullaniciKarti({
  profil,
  onCikis,
}: {
  profil: ReturnType<typeof useOturum>['profil'];
  onCikis: () => void;
}) {
  if (!profil) return null;
  return (
    <div className="border-t border-night-100 p-4">
      <div className="mb-3 min-w-0">
        <p className="truncate text-sm font-bold text-night-950">{profil.ad_soyad}</p>
        <p className="truncate text-xs text-night-500">{ROL_ADI[profil.rol]}</p>
      </div>
      <button
        onClick={onCikis}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-night-600 transition-colors hover:bg-night-100 hover:text-night-950"
      >
        <LogOut className="h-4 w-4" />
        Çıkış
      </button>
    </div>
  );
}
