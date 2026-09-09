import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  ClipboardList, Megaphone, Award, FolderOpen, HelpCircle,
} from 'lucide-react';
import { OturumSaglayici, useOturum, rolKoku } from './giris/Oturum';
import Kabuk, { RolKapisi, YuklemeEkrani, type MenuOgesi } from './ortak/Kabuk';
import GirisSayfasi from './giris/GirisSayfasi';

// Her panel ayrı pakete bölünüyor: öğrenci, yönetim ekranlarının kodunu indirmesin.
const AdminPano       = lazy(() => import('./admin/Pano'));
const AdminOgrenciler = lazy(() => import('./admin/Ogrenciler'));
const AdminSiniflar   = lazy(() => import('./admin/Siniflar'));
const AdminSinifDetay = lazy(() => import('./admin/SinifDetay'));
const AdminKurslar    = lazy(() => import('./admin/Kurslar'));
const AdminDuyurular  = lazy(() => import('./admin/Duyurular'));
const AdminSertifika  = lazy(() => import('./admin/Sertifikalar'));

const EgitmenPano       = lazy(() => import('./egitmen/Pano'));
const EgitmenSiniflar   = lazy(() => import('./egitmen/Siniflar'));
const EgitmenSinifDetay = lazy(() => import('./egitmen/SinifDetay'));
const EgitmenOdevler    = lazy(() => import('./egitmen/Odevler'));
const EgitmenTakvim     = lazy(() => import('./egitmen/Takvim'));

const OgrenciPano      = lazy(() => import('./ogrenci/Pano'));
const OgrenciKurslarim = lazy(() => import('./ogrenci/Kurslarim'));
const OgrenciOdevlerim = lazy(() => import('./ogrenci/Odevlerim'));
const OgrenciTakvimim  = lazy(() => import('./ogrenci/Takvimim'));
const OgrenciBelgeler  = lazy(() => import('./ogrenci/Sertifikalarim'));

const ik = 'h-4 w-4';

const ADMIN_MENU: MenuOgesi[] = [
  { yol: '/admin', ad: 'Pano', ikon: <LayoutDashboard className={ik} /> },
  { yol: '/admin/ogrenciler', ad: 'Kullanıcılar', ikon: <Users className={ik} /> },
  { yol: '/admin/siniflar', ad: 'Sınıflar', ikon: <GraduationCap className={ik} />, kok: true },
  { yol: '/admin/kurslar', ad: 'Kurslar', ikon: <BookOpen className={ik} /> },
  { yol: '/admin/duyurular', ad: 'Duyurular', ikon: <Megaphone className={ik} /> },
  { yol: '/admin/sertifikalar', ad: 'Sertifikalar', ikon: <Award className={ik} /> },
];

const EGITMEN_MENU: MenuOgesi[] = [
  { yol: '/egitmen', ad: 'Pano', ikon: <LayoutDashboard className={ik} /> },
  { yol: '/egitmen/siniflar', ad: 'Sınıflarım', ikon: <GraduationCap className={ik} />, kok: true },
  { yol: '/egitmen/odevler', ad: 'Ödevler', ikon: <ClipboardList className={ik} /> },
  { yol: '/egitmen/takvim', ad: 'Takvim', ikon: <CalendarDays className={ik} /> },
];

const OGRENCI_MENU: MenuOgesi[] = [
  { yol: '/ogrenci', ad: 'Panom', ikon: <LayoutDashboard className={ik} /> },
  { yol: '/ogrenci/kurslarim', ad: 'Kurslarım', ikon: <FolderOpen className={ik} /> },
  { yol: '/ogrenci/odevlerim', ad: 'Ödevlerim', ikon: <ClipboardList className={ik} /> },
  { yol: '/ogrenci/takvimim', ad: 'Takvimim', ikon: <CalendarDays className={ik} /> },
  { yol: '/ogrenci/sertifikalarim', ad: 'Sertifikalarım', ikon: <Award className={ik} /> },
];

/** Girişteyse kendi paneline, değilse giriş ekranına. */
function Kok() {
  const { session, profil, yukleniyor } = useOturum();
  if (yukleniyor) return <YuklemeEkrani />;
  if (!session || !profil) return <Navigate to="/giris" replace />;
  return <Navigate to={rolKoku(profil.rol)} replace />;
}

export default function App() {
  return (
    <OturumSaglayici>
      <Suspense fallback={<YuklemeEkrani />}>
        <Routes>
          <Route path="/" element={<Kok />} />
          <Route path="/giris" element={<GirisSayfasi />} />

          {/* ─── Yönetim ─── */}
          <Route element={<RolKapisi izinli={['admin']} />}>
            <Route path="/admin" element={<Kabuk menu={ADMIN_MENU} />}>
              <Route index element={<AdminPano />} />
              <Route path="ogrenciler" element={<AdminOgrenciler />} />
              <Route path="siniflar" element={<AdminSiniflar />} />
              <Route path="siniflar/:id" element={<AdminSinifDetay />} />
              <Route path="kurslar" element={<AdminKurslar />} />
              <Route path="duyurular" element={<AdminDuyurular />} />
              <Route path="sertifikalar" element={<AdminSertifika />} />
            </Route>
          </Route>

          {/* ─── Eğitmen ─── */}
          <Route element={<RolKapisi izinli={['egitmen']} />}>
            <Route path="/egitmen" element={<Kabuk menu={EGITMEN_MENU} />}>
              <Route index element={<EgitmenPano />} />
              <Route path="siniflar" element={<EgitmenSiniflar />} />
              <Route path="siniflar/:id" element={<EgitmenSinifDetay />} />
              <Route path="odevler" element={<EgitmenOdevler />} />
              <Route path="takvim" element={<EgitmenTakvim />} />
            </Route>
          </Route>

          {/* ─── Öğrenci ─── */}
          <Route element={<RolKapisi izinli={['ogrenci']} />}>
            <Route path="/ogrenci" element={<Kabuk menu={OGRENCI_MENU} />}>
              <Route index element={<OgrenciPano />} />
              <Route path="kurslarim" element={<OgrenciKurslarim />} />
              <Route path="odevlerim" element={<OgrenciOdevlerim />} />
              <Route path="takvimim" element={<OgrenciTakvimim />} />
              <Route path="sertifikalarim" element={<OgrenciBelgeler />} />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
                <HelpCircle className="h-8 w-8 text-night-300" />
                <p className="font-bold text-night-950">Sayfa bulunamadı</p>
                <a href="/" className="btn-ikinci">
                  Panele dön
                </a>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </OturumSaglayici>
  );
}
