import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { sb, hataMetni } from '../lib/supabase';
import type { Profil, Rol } from '../lib/tipler';

// ─────────────────────────────────────────────────────────────────────────────
// OTURUM
//
// Supabase oturumu + profil (rol dahil) tek yerde tutuluyor.
//
// ⚠️ Buradaki rol yalnızca ARAYÜZÜ yönlendirmek içindir — hangi menüyü
//    göstereceğimize karar verir. Güvenliği sağlamaz. Kimin neyi görebileceğine
//    veritabanındaki RLS kuralları karar verir. Yani biri buradaki rolü
//    tarayıcıda "admin" yapsa bile veri gelmez.
// ─────────────────────────────────────────────────────────────────────────────

interface OturumDurumu {
  session: Session | null;
  profil: Profil | null;
  yukleniyor: boolean;
  girisYap: (kimlik: string, sifre: string) => Promise<void>;
  cikisYap: () => Promise<void>;
  profiliYenile: () => Promise<void>;
}

const Baglam = createContext<OturumDurumu | null>(null);

export function OturumSaglayici({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profil, setProfil] = useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  async function profiliCek(kullaniciId: string) {
    const { data, error } = await sb
      .from('profiller')
      .select('*')
      .eq('id', kullaniciId)
      .maybeSingle();

    if (error) {
      console.error('[oturum] profil okunamadı', error);
      setProfil(null);
      return;
    }
    setProfil(data);
  }

  useEffect(() => {
    let iptal = false;

    // Sayfa yenilendiğinde kayıtlı oturumu geri al
    sb.auth.getSession().then(async ({ data }) => {
      if (iptal) return;
      setSession(data.session);
      if (data.session) await profiliCek(data.session.user.id);
      setYukleniyor(false);
    });

    // Giriş/çıkış olduğunda profili tazele
    const { data: abone } = sb.auth.onAuthStateChange(async (_olay, yeni) => {
      setSession(yeni);
      if (yeni) await profiliCek(yeni.user.id);
      else setProfil(null);
    });

    return () => {
      iptal = true;
      abone.subscription.unsubscribe();
    };
  }, []);

  /**
   * Giriş: kullanıcı adı VEYA e-posta kabul eder.
   *
   * Öğrencilerin çoğunun e-postası yok; kullanıcı adıyla giriyorlar. Supabase
   * Auth ise e-posta bekliyor, o yüzden önce kullanıcı adını e-postaya
   * çeviriyoruz.
   *
   * Çeviriyi veritabanındaki `giris_epostasi` fonksiyonu yapıyor. Sabit bir
   * kural ("kullanıcıadı@ogrenci.local") kullanmak yanlıştı: gerçek e-postası
   * olan eğitmen ve yöneticiler o kuralla giriş yapamıyordu.
   */
  async function girisYap(kimlik: string, sifre: string) {
    const temiz = kimlik.trim().toLowerCase();
    let eposta = temiz;

    if (!temiz.includes('@')) {
      const { data, error } = await sb.rpc('giris_epostasi', { p_kullanici_adi: temiz });
      if (error) throw new Error(hataMetni(error));
      if (!data) throw new Error('Kullanıcı adı veya şifre hatalı.');
      eposta = data;
    }

    const { error } = await sb.auth.signInWithPassword({ email: eposta, password: sifre });
    if (error) throw new Error(hataMetni(error));
  }

  async function cikisYap() {
    await sb.auth.signOut();
    setProfil(null);
    setSession(null);
  }

  async function profiliYenile() {
    if (session) await profiliCek(session.user.id);
  }

  const deger = useMemo<OturumDurumu>(
    () => ({ session, profil, yukleniyor, girisYap, cikisYap, profiliYenile }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, profil, yukleniyor],
  );

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useOturum(): OturumDurumu {
  const d = useContext(Baglam);
  if (!d) throw new Error('useOturum, OturumSaglayici içinde kullanılmalı');
  return d;
}

/** Rolün panel kök adresi — giriş sonrası buraya yönlendirilir. */
export function rolKoku(rol: Rol): string {
  if (rol === 'admin') return '/admin';
  if (rol === 'egitmen') return '/egitmen';
  return '/ogrenci';
}
