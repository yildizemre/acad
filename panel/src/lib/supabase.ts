import { createClient } from '@supabase/supabase-js';
import type { Veritabani } from './tipler';

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE İSTEMCİSİ
//
// Buradaki anahtar "anon" anahtarıdır ve tarayıcıya gitmesi normaldir; tek
// başına hiçbir yetki vermez. Kimin neyi görebileceğine veritabanındaki RLS
// kuralları karar verir (bkz. supabase/migrations/0002_rls.sql).
//
// ⚠️ `service_role` anahtarı BURAYA veya herhangi bir VITE_ değişkenine
//    YAZILMAZ. O anahtar RLS'i tamamen atlar; tarayıcıya sızarsa bütün öğrenci
//    verisi açığa çıkar.
// ─────────────────────────────────────────────────────────────────────────────

const url = import.meta.env.VITE_SUPABASE_URL;
const anonAnahtar = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonAnahtar) {
  throw new Error(
    'VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanımlı değil. ' +
      'panel/.env dosyasını oluşturun (örnek: .env.example).',
  );
}

export const sb = createClient<Veritabani>(url, anonAnahtar, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'hype-panel-oturum',
  },
});

/**
 * Supabase hatalarını okunur Türkçeye çevirir.
 * Ham İngilizce hata mesajını veliye/öğrenciye göstermek istemiyoruz.
 */
export function hataMetni(e: unknown): string {
  if (!e) return 'Bilinmeyen bir hata oluştu.';
  const mesaj = typeof e === 'string' ? e : ((e as { message?: string }).message ?? '');

  if (mesaj.includes('Invalid login credentials')) {
    return 'Kullanıcı adı veya şifre hatalı.';
  }
  if (mesaj.includes('Email not confirmed')) {
    return 'Hesabınız henüz onaylanmamış. Kayıt ekibimizle iletişime geçin.';
  }
  if (mesaj.includes('row-level security') || mesaj.includes('violates row-level')) {
    return 'Bu işlem için yetkiniz yok.';
  }
  if (mesaj.includes('duplicate key') && mesaj.includes('kullanici_adi')) {
    return 'Bu kullanıcı adı zaten kullanılıyor.';
  }
  if (mesaj.includes('duplicate key')) {
    return 'Bu kayıt zaten var.';
  }
  if (mesaj.includes('Failed to fetch')) {
    return 'Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.';
  }
  return mesaj || 'Beklenmeyen bir hata oluştu.';
}
