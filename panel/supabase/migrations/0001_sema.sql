-- ═══════════════════════════════════════════════════════════════════════════
-- HYPE ACADEMIA — ÖĞRENME YÖNETİM SİSTEMİ (LMS) ŞEMASI
--
-- Üç rol var ve yetkiler bu üçünün etrafında kuruluyor:
--   admin    → her şeyi görür ve yönetir
--   egitmen  → yalnızca KENDİ sınıflarını ve o sınıflardaki öğrencileri görür
--   ogrenci  → yalnızca KENDİ kayıtlarını, ödevlerini, notlarını görür
--
-- Yetki kuralları uygulamada değil, VERİTABANINDA (bkz. 0002_rls.sql) uygulanır.
-- Böylece tarayıcıdaki kodu kurcalayan biri başkasının verisine ulaşamaz.
--
-- Adlandırma: tablolar ve sütunlar Türkçe. Ekibin okuyacağı yer burası;
-- İngilizce/Türkçe karışımı en çok burada kafa karıştırıyor.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Roller ────────────────────────────────────────────────────────────────
create type rol as enum ('admin', 'egitmen', 'ogrenci');
create type kurs_durumu as enum ('taslak', 'yayinda', 'arsiv');
create type materyal_turu as enum ('video', 'ses', 'pdf', 'sunum', 'belge', 'kod', 'baglanti');
create type etkinlik_turu as enum ('canli_ders', 'sinav', 'odev_teslim', 'demo_gunu', 'diger');
create type soru_turu as enum ('coktan_secmeli', 'dogru_yanlis', 'acik_uclu', 'kod');


-- ═══════════════════════════════════════════════════════════════════════════
-- KULLANICILAR
-- ═══════════════════════════════════════════════════════════════════════════

-- auth.users Supabase'in kendi tablosu; parola ve oturum orada durur.
-- Bizim alanlarımız burada.
create table profiller (
  id             uuid primary key references auth.users(id) on delete cascade,
  ad_soyad       text not null,
  kullanici_adi  text unique not null,
  eposta         text not null,
  telefon        text,
  rol            rol not null default 'ogrenci',
  dogum_tarihi   date,
  yetkinlik      text,                       -- baslangic | orta | ileri
  avatar_url     text,
  aktif          boolean not null default true,
  -- Veli bilgisi: öğrenci çocuk olduğu için iletişim velisiyle kuruluyor
  veli_adi       text,
  veli_telefon   text,
  kayit_tarihi   date not null default current_date,
  olusturuldu    timestamptz not null default now()
);

comment on table profiller is 'auth.users kaydının uygulama tarafındaki karşılığı';
comment on column profiller.kullanici_adi is 'Girişte e-posta yerine kullanılabilen kısa ad';


-- ═══════════════════════════════════════════════════════════════════════════
-- KURSLAR VE SINIFLAR
-- ═══════════════════════════════════════════════════════════════════════════

create table kurslar (
  id            uuid primary key default gen_random_uuid(),
  baslik        text not null,
  slug          text unique not null,
  aciklama      text,
  yas_araligi   text,
  seviye        text,
  hafta_sayisi  int  not null default 8,
  haftalik_ders int  not null default 2,
  ders_dakika   int  not null default 60,
  gorsel_url    text,
  durum         kurs_durumu not null default 'taslak',
  olusturuldu   timestamptz not null default now()
);

-- Kursun hafta hafta müfredatı
create table kurs_haftalari (
  id        uuid primary key default gen_random_uuid(),
  kurs_id   uuid not null references kurslar(id) on delete cascade,
  hafta     int  not null,
  baslik    text not null,
  konular   text[] not null default '{}',
  proje     text,
  unique (kurs_id, hafta)
);

-- Sınıf = aynı kursu aynı saatte alan öğrenci grubu.
-- Ödev, takvim ve materyal sınıfa özel atanır; 200 öğrenci böyle bölünür.
create table siniflar (
  id           uuid primary key default gen_random_uuid(),
  ad           text not null,
  kurs_id      uuid references kurslar(id) on delete set null,
  egitmen_id   uuid references profiller(id) on delete set null,
  aciklama     text,
  zoom_url     text,
  kontenjan    int not null default 8,
  aktif        boolean not null default true,
  baslangic    date,
  bitis        date,
  olusturuldu  timestamptz not null default now()
);

create table sinif_ogrencileri (
  sinif_id    uuid not null references siniflar(id) on delete cascade,
  ogrenci_id  uuid not null references profiller(id) on delete cascade,
  eklendi     timestamptz not null default now(),
  primary key (sinif_id, ogrenci_id)
);

-- Öğrencinin bir kursa kaydı. Sınıftan ayrı tutuluyor: öğrenci kursu almış
-- ama henüz sınıfa atanmamış olabilir (ödeme geldi, grup oluşmadı).
create table kayitlar (
  id            uuid primary key default gen_random_uuid(),
  ogrenci_id    uuid not null references profiller(id) on delete cascade,
  kurs_id       uuid not null references kurslar(id) on delete cascade,
  kayit_tarihi  date not null default current_date,
  bitis_tarihi  date,
  ilerleme      numeric(5,2) not null default 0,
  tamamlandi    boolean not null default false,
  -- Ödeme tarafından gelen sipariş numarası (PayTR merchant_oid)
  siparis_no    text,
  unique (ogrenci_id, kurs_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- DERSLER VE MATERYALLER
-- ═══════════════════════════════════════════════════════════════════════════

create table dersler (
  id            uuid primary key default gen_random_uuid(),
  kurs_id       uuid not null references kurslar(id) on delete cascade,
  -- Boşsa kursun bütün sınıflarında geçerli; doluysa yalnızca o sınıfa özel
  sinif_id      uuid references siniflar(id) on delete cascade,
  hafta         int,
  sira          int not null default 0,
  baslik        text not null,
  aciklama      text,
  video_url     text,
  yayinda       boolean not null default true,
  olusturuldu   timestamptz not null default now()
);

-- Eğitmenin ders sonrası yüklediği PDF, sunum, kod dosyası
create table ders_materyalleri (
  id           uuid primary key default gen_random_uuid(),
  ders_id      uuid references dersler(id) on delete cascade,
  sinif_id     uuid references siniflar(id) on delete cascade,
  baslik       text not null,
  aciklama     text,
  tur          materyal_turu not null default 'pdf',
  dosya_yolu   text,          -- Supabase Storage içindeki yol
  dis_baglanti text,
  yukleyen_id  uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now(),
  -- En az birine bağlı olmalı; yetim materyal kimseye görünmez
  constraint materyal_bir_yere_bagli check (ders_id is not null or sinif_id is not null)
);

create table ders_ilerleme (
  ogrenci_id     uuid not null references profiller(id) on delete cascade,
  ders_id        uuid not null references dersler(id) on delete cascade,
  tamamlandi     boolean not null default false,
  yuzde          numeric(5,2) not null default 0,
  gecirilen_sn   int not null default 0,
  son_erisim     timestamptz not null default now(),
  primary key (ogrenci_id, ders_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- TAKVİM
-- ═══════════════════════════════════════════════════════════════════════════

create table takvim (
  id           uuid primary key default gen_random_uuid(),
  sinif_id     uuid references siniflar(id) on delete cascade,
  kurs_id      uuid references kurslar(id) on delete cascade,
  ders_id      uuid references dersler(id) on delete set null,
  baslik       text not null,
  aciklama     text,
  tur          etkinlik_turu not null default 'canli_ders',
  baslangic    timestamptz not null,
  bitis        timestamptz not null,
  zoom_url     text,
  olusturan_id uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now(),
  constraint takvim_bir_yere_bagli check (sinif_id is not null or kurs_id is not null),
  constraint takvim_sure_gecerli check (bitis > baslangic)
);

-- Yoklama
create table katilim (
  etkinlik_id  uuid not null references takvim(id) on delete cascade,
  ogrenci_id   uuid not null references profiller(id) on delete cascade,
  katildi      boolean not null default false,
  not_dusuldu  text,
  isaretleyen  uuid references profiller(id) on delete set null,
  primary key (etkinlik_id, ogrenci_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- ÖDEVLER
-- ═══════════════════════════════════════════════════════════════════════════

create table odevler (
  id           uuid primary key default gen_random_uuid(),
  kurs_id      uuid references kurslar(id) on delete cascade,
  sinif_id     uuid references siniflar(id) on delete cascade,
  ders_id      uuid references dersler(id) on delete set null,
  baslik       text not null,
  aciklama     text,
  ek_dosya     text,
  son_tarih    timestamptz,
  max_puan     int not null default 100,
  yayinda      boolean not null default true,
  olusturan_id uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now(),
  constraint odev_bir_yere_bagli check (kurs_id is not null or sinif_id is not null)
);

create table odev_teslimleri (
  id             uuid primary key default gen_random_uuid(),
  odev_id        uuid not null references odevler(id) on delete cascade,
  ogrenci_id     uuid not null references profiller(id) on delete cascade,
  metin          text,
  dosya_yolu     text,
  teslim_tarihi  timestamptz not null default now(),
  puan           int,
  geri_bildirim  text,
  degerlendiren  uuid references profiller(id) on delete set null,
  degerlendirme_tarihi timestamptz,
  unique (odev_id, ogrenci_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- SINAV VE SORU HAVUZU
-- ═══════════════════════════════════════════════════════════════════════════

create table soru_havuzu (
  id            uuid primary key default gen_random_uuid(),
  kurs_id       uuid references kurslar(id) on delete cascade,
  soru          text not null,
  tur           soru_turu not null default 'coktan_secmeli',
  dogru_cevap   text,               -- açık uçlu / doğru-yanlış için
  puan          int not null default 10,
  etiketler     text[] not null default '{}',
  olusturan_id  uuid references profiller(id) on delete set null,
  olusturuldu   timestamptz not null default now()
);

create table soru_secenekleri (
  id        uuid primary key default gen_random_uuid(),
  soru_id   uuid not null references soru_havuzu(id) on delete cascade,
  metin     text not null,
  dogru_mu  boolean not null default false,
  sira      int not null default 0
);

create table sinavlar (
  id           uuid primary key default gen_random_uuid(),
  kurs_id      uuid references kurslar(id) on delete cascade,
  sinif_id     uuid references siniflar(id) on delete cascade,
  baslik       text not null,
  aciklama     text,
  sure_dakika  int not null default 30,
  gecme_puani  int not null default 60,
  baslangic    timestamptz,
  bitis        timestamptz,
  yayinda      boolean not null default false,
  olusturan_id uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now()
);

-- Sınava alınan sorular. Havuzdan kopyalanır ki havuzdaki soru sonradan
-- değişse bile geçmiş sınavın içeriği bozulmasın.
create table sinav_sorulari (
  id           uuid primary key default gen_random_uuid(),
  sinav_id     uuid not null references sinavlar(id) on delete cascade,
  havuz_id     uuid references soru_havuzu(id) on delete set null,
  soru         text not null,
  tur          soru_turu not null default 'coktan_secmeli',
  dogru_cevap  text,
  puan         int not null default 10,
  sira         int not null default 0
);

create table sinav_secenekleri (
  id        uuid primary key default gen_random_uuid(),
  soru_id   uuid not null references sinav_sorulari(id) on delete cascade,
  metin     text not null,
  dogru_mu  boolean not null default false,
  sira      int not null default 0
);

create table sinav_teslimleri (
  id             uuid primary key default gen_random_uuid(),
  sinav_id       uuid not null references sinavlar(id) on delete cascade,
  ogrenci_id     uuid not null references profiller(id) on delete cascade,
  baslama        timestamptz not null default now(),
  teslim         timestamptz,
  puan           int,
  max_puan       int,
  degerlendirildi boolean not null default false,
  unique (sinav_id, ogrenci_id)
);

create table sinav_cevaplari (
  id          uuid primary key default gen_random_uuid(),
  teslim_id   uuid not null references sinav_teslimleri(id) on delete cascade,
  soru_id     uuid not null references sinav_sorulari(id) on delete cascade,
  secenek_id  uuid references sinav_secenekleri(id) on delete set null,
  metin       text,
  puan        int,
  unique (teslim_id, soru_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- SERTİFİKA
-- ═══════════════════════════════════════════════════════════════════════════

create table sertifikalar (
  id            uuid primary key default gen_random_uuid(),
  ogrenci_id    uuid not null references profiller(id) on delete cascade,
  kurs_id       uuid not null references kurslar(id) on delete cascade,
  belge_no      text unique not null,
  verilis       date not null default current_date,
  dosya_yolu    text,
  veren_id      uuid references profiller(id) on delete set null,
  unique (ogrenci_id, kurs_id)
);


-- ═══════════════════════════════════════════════════════════════════════════
-- İLETİŞİM
-- ═══════════════════════════════════════════════════════════════════════════

create table duyurular (
  id           uuid primary key default gen_random_uuid(),
  baslik       text not null,
  icerik       text not null,
  kurs_id      uuid references kurslar(id) on delete cascade,
  sinif_id     uuid references siniflar(id) on delete cascade,
  -- Hem kurs hem sınıf boşsa duyuru herkese gider
  onemli       boolean not null default false,
  yayinda      boolean not null default true,
  olusturan_id uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now()
);

create table mesajlar (
  id           uuid primary key default gen_random_uuid(),
  gonderen_id  uuid not null references profiller(id) on delete cascade,
  alici_id     uuid not null references profiller(id) on delete cascade,
  konu         text not null,
  icerik       text not null,
  okundu       boolean not null default false,
  olusturuldu  timestamptz not null default now()
);

create table forumlar (
  id           uuid primary key default gen_random_uuid(),
  kurs_id      uuid references kurslar(id) on delete cascade,
  sinif_id     uuid references siniflar(id) on delete cascade,
  baslik       text not null,
  aciklama     text,
  olusturuldu  timestamptz not null default now()
);

create table forum_konulari (
  id           uuid primary key default gen_random_uuid(),
  forum_id     uuid not null references forumlar(id) on delete cascade,
  yazar_id     uuid not null references profiller(id) on delete cascade,
  baslik       text not null,
  icerik       text not null,
  kilitli      boolean not null default false,
  olusturuldu  timestamptz not null default now()
);

create table forum_yanitlari (
  id           uuid primary key default gen_random_uuid(),
  konu_id      uuid not null references forum_konulari(id) on delete cascade,
  yazar_id     uuid not null references profiller(id) on delete cascade,
  icerik       text not null,
  olusturuldu  timestamptz not null default now()
);


-- ═══════════════════════════════════════════════════════════════════════════
-- MEDYA KÜTÜPHANESİ
-- ═══════════════════════════════════════════════════════════════════════════

create table kutuphane (
  id           uuid primary key default gen_random_uuid(),
  baslik       text not null,
  aciklama     text,
  tur          materyal_turu not null default 'pdf',
  kurs_id      uuid references kurslar(id) on delete set null,
  dosya_yolu   text,
  dis_baglanti text,
  boyut_bayt   bigint,
  etiketler    text[] not null default '{}',
  yukleyen_id  uuid references profiller(id) on delete set null,
  olusturuldu  timestamptz not null default now()
);


-- ═══════════════════════════════════════════════════════════════════════════
-- İNDEKSLER
-- Sorguların çoğu "şu öğrencinin", "şu sınıfın" diye filtreliyor.
-- ═══════════════════════════════════════════════════════════════════════════

create index on profiller (rol) where aktif;
create index on siniflar (egitmen_id);
create index on siniflar (kurs_id);
create index on sinif_ogrencileri (ogrenci_id);
create index on kayitlar (ogrenci_id);
create index on kayitlar (kurs_id);
create index on dersler (kurs_id, sira);
create index on dersler (sinif_id);
create index on ders_materyalleri (ders_id);
create index on ders_materyalleri (sinif_id);
create index on ders_ilerleme (ogrenci_id);
create index on takvim (sinif_id, baslangic);
create index on takvim (baslangic);
create index on odevler (sinif_id);
create index on odevler (kurs_id);
create index on odev_teslimleri (ogrenci_id);
create index on odev_teslimleri (odev_id);
create index on sinavlar (sinif_id);
create index on sinav_teslimleri (ogrenci_id);
create index on sertifikalar (ogrenci_id);
create index on mesajlar (alici_id, okundu);
create index on duyurular (sinif_id);
create index on duyurular (kurs_id);
