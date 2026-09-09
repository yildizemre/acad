import { useCallback, useEffect, useState } from 'react';
import { sb, hataMetni } from './supabase';

// ─────────────────────────────────────────────────────────────────────────────
// VERİ ÇEKME
//
// Panelin her ekranı aynı üç şeyi istiyor: veri, yükleniyor mu, hata var mı.
// Her ekranda ayrı ayrı useEffect yazmak yerine tek yerde topluyoruz.
//
// Not: Sorgular RLS altında çalışıyor. "Bana ait olanları getir" diye ayrıca
// filtrelemeye gerek yok — veritabanı zaten yalnızca izinli satırları döndürür.
// Yine de okunabilirlik için bazı sorgularda açık filtre bırakıldı.
// ─────────────────────────────────────────────────────────────────────────────

export interface SorguDurumu<T> {
  veri: T | null;
  yukleniyor: boolean;
  hata: string | null;
  yenile: () => void;
}

export function useSorgu<T>(
  calistir: () => PromiseLike<{ data: T | null; error: unknown }>,
  bagimliliklar: unknown[] = [],
): SorguDurumu<T> {
  const [veri, setVeri] = useState<T | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);
  const [sayac, setSayac] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cagir = useCallback(calistir, bagimliliklar);

  useEffect(() => {
    let iptal = false;
    setYukleniyor(true);
    setHata(null);

    cagir().then(({ data, error }) => {
      if (iptal) return;
      if (error) setHata(hataMetni(error));
      else setVeri(data);
      setYukleniyor(false);
    });

    return () => {
      iptal = true;
    };
  }, [cagir, sayac]);

  return { veri, yukleniyor, hata, yenile: () => setSayac((s) => s + 1) };
}

/** Depoya dosya yükler ve yolunu döner. */
export async function dosyaYukle(
  kova: 'materyaller' | 'odev-teslim' | 'sertifika',
  yol: string,
  dosya: File,
): Promise<string> {
  const { error } = await sb.storage.from(kova).upload(yol, dosya, { upsert: true });
  if (error) throw new Error(hataMetni(error));
  return yol;
}

/**
 * Özel dosya için süreli indirme bağlantısı.
 * Kovalar private; adresi bilen birinin indirebilmesi kabul edilemez.
 */
export async function dosyaBaglantisi(
  kova: 'materyaller' | 'odev-teslim' | 'sertifika',
  yol: string,
  saniye = 3600,
): Promise<string | null> {
  const { data, error } = await sb.storage.from(kova).createSignedUrl(yol, saniye);
  if (error) {
    console.error('[dosya] imzalı bağlantı alınamadı', error);
    return null;
  }
  return data.signedUrl;
}

/** "12,5 MB" */
export function boyut(bayt: number): string {
  if (bayt < 1024) return `${bayt} B`;
  if (bayt < 1024 * 1024) return `${(bayt / 1024).toFixed(0)} KB`;
  return `${(bayt / 1024 / 1024).toFixed(1)} MB`;
}
