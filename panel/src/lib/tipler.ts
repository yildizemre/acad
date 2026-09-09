// ─────────────────────────────────────────────────────────────────────────────
// VERİTABANI TİPLERİ
//
// Asıl tipler `veritabani-tipleri.ts` içinde ve o dosya ELLE YAZILMAZ; çalışan
// veritabanından üretilir:
//
//     npx supabase gen types typescript --local > src/lib/veritabani-tipleri.ts
//
// Şemayı değiştirdikten sonra bu komutu tekrar çalıştırın.
//
// (Bu dosya başta elle yazılmıştı ama supabase-js'in beklediği jenerik şekil
//  çok hassas: en ufak sapmada kütüphane bütün şemayı geçersiz sayıp
//  insert/update yüklerini `never` yapıyor ve hata mesajı sebebi anlatmıyor.
//  Üretilen tipe güvenmek hem doğru hem bakımı kolay.)
//
// Aşağıdakiler yalnızca okunur takma adlar — ekranlarda `Profil` yazmak
// `Database['public']['Tables']['profiller']['Row']` yazmaktan iyi.
// ─────────────────────────────────────────────────────────────────────────────

import type { Database } from './veritabani-tipleri';

export type { Database };
/** supabase.ts içindeki createClient bunu bekliyor. */
export type Veritabani = Database;

type Tablolar = Database['public']['Tables'];
type Gorunumler = Database['public']['Views'];
type Sabitler = Database['public']['Enums'];

// ─── Sabit listeler ─────────────────────────────────────────────────────────
export type Rol = Sabitler['rol'];
export type KursDurumu = Sabitler['kurs_durumu'];
export type MateryalTuru = Sabitler['materyal_turu'];
export type EtkinlikTuru = Sabitler['etkinlik_turu'];
export type SoruTuru = Sabitler['soru_turu'];

// ─── Satır tipleri ──────────────────────────────────────────────────────────
export type Profil = Tablolar['profiller']['Row'];
export type Kurs = Tablolar['kurslar']['Row'];
export type KursHaftasi = Tablolar['kurs_haftalari']['Row'];
export type Sinif = Tablolar['siniflar']['Row'];
export type SinifOgrencisi = Tablolar['sinif_ogrencileri']['Row'];
export type Kayit = Tablolar['kayitlar']['Row'];
export type Ders = Tablolar['dersler']['Row'];
export type DersMateryali = Tablolar['ders_materyalleri']['Row'];
export type DersIlerleme = Tablolar['ders_ilerleme']['Row'];
export type Etkinlik = Tablolar['takvim']['Row'];
export type Katilim = Tablolar['katilim']['Row'];
export type Odev = Tablolar['odevler']['Row'];
export type OdevTeslimi = Tablolar['odev_teslimleri']['Row'];
export type Soru = Tablolar['soru_havuzu']['Row'];
export type SoruSecenegi = Tablolar['soru_secenekleri']['Row'];
export type Sinav = Tablolar['sinavlar']['Row'];
export type Sertifika = Tablolar['sertifikalar']['Row'];
export type Duyuru = Tablolar['duyurular']['Row'];
export type Mesaj = Tablolar['mesajlar']['Row'];

/**
 * Sınıf + hesaplanmış sayaçlar (sinif_ozet görünümü).
 *
 * ⚠️ Bütün sütunlar `null` olabilir görünüyor; bu Postgres'in bir görünümde
 *    NOT NULL bilgisini taşımamasından. Pratikte sorgu her zaman değer
 *    döndürür ama tipi zorla sıkılaştırmıyoruz — ekranlarda `?? 0` yazmak,
 *    yanlış bir söz vermekten iyidir.
 */
export type SinifOzet = Gorunumler['sinif_ozet']['Row'];
