-- ═══════════════════════════════════════════════════════════════════════════
-- DEMO VERİ — yalnızca yerel geliştirme
--
-- `npx supabase db reset` her çalıştığında bu dosya yeniden yüklenir.
-- Üç rolün de gerçek veriyle test edilebilmesi için asgari ama tutarlı bir
-- kurgu: 1 admin, 2 eğitmen, 6 öğrenci, 2 kurs, 3 sınıf, dersler, ödevler.
--
-- ⚠️ CANLIYA ASLA YÜKLENMEZ. Parolalar herkesçe bilinen demo parolalarıdır.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Kullanıcılar ──────────────────────────────────────────────────────────
-- auth.users'a doğrudan yazıyoruz; profiller tetikleyiciyle otomatik açılıyor.
-- Parola: hepsi "demo1234"

create or replace function demo_kullanici(
  p_id uuid, p_eposta text, p_ad text, p_kullanici text, p_rol text, p_tel text
) returns void
language plpgsql as $$
begin
  -- ⚠️ Jeton sütunları BOŞ METİN olmalı, NULL değil.
  --    GoTrue bu sütunları string olarak okuyor; NULL bırakılırsa girişte
  --    "Database error querying schema" hatası veriyor ve sebebi hiç belli
  --    olmuyor. (Bir kez bu tuzağa düştük.)
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    email_change_token_current, phone_change, phone_change_token,
    reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000', p_id, 'authenticated', 'authenticated',
    p_eposta, crypt('demo1234', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('ad_soyad', p_ad, 'kullanici_adi', p_kullanici, 'rol', p_rol, 'telefon', p_tel),
    '', '', '', '', '', '', '', ''
  );
  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), p_id, p_id::text,
    jsonb_build_object('sub', p_id::text, 'email', p_eposta),
    'email', now(), now(), now()
  );
end;
$$;

select demo_kullanici('11111111-1111-1111-1111-111111111111', 'admin@hypeacademia.com',   'Emre Yıldız',    'admin',   'admin',   '05418629190');
select demo_kullanici('22222222-2222-2222-2222-222222222221', 'ahmet@hypeacademia.com',   'Ahmet Kaya',     'ahmetk',  'egitmen', '05321112233');
select demo_kullanici('22222222-2222-2222-2222-222222222222', 'selin@hypeacademia.com',   'Selin Demir',    'selind',  'egitmen', '05324445566');
select demo_kullanici('33333333-3333-3333-3333-333333333331', 'elif@ogrenci.local',       'Elif Yılmaz',    'elify',   'ogrenci', '05551112233');
select demo_kullanici('33333333-3333-3333-3333-333333333332', 'can@ogrenci.local',        'Can Demir',      'cand',    'ogrenci', '05551112234');
select demo_kullanici('33333333-3333-3333-3333-333333333333', 'arda@ogrenci.local',       'Arda Şahin',     'ardas',   'ogrenci', '05551112235');
select demo_kullanici('33333333-3333-3333-3333-333333333334', 'zeynep@ogrenci.local',     'Zeynep Ak',      'zeynepa', 'ogrenci', '05551112236');
select demo_kullanici('33333333-3333-3333-3333-333333333335', 'mert@ogrenci.local',       'Mert Öz',        'merto',   'ogrenci', '05551112237');
select demo_kullanici('33333333-3333-3333-3333-333333333336', 'deniz@ogrenci.local',      'Deniz Kurt',     'denizk',  'ogrenci', '05551112238');

drop function demo_kullanici(uuid, text, text, text, text, text);

-- Veli bilgisi
update profiller set veli_adi = 'Ayşe Yılmaz',  veli_telefon = '05551110001', dogum_tarihi = '2014-03-12' where kullanici_adi = 'elify';
update profiller set veli_adi = 'Murat Demir',  veli_telefon = '05551110002', dogum_tarihi = '2013-07-02' where kullanici_adi = 'cand';
update profiller set veli_adi = 'Hakan Şahin',  veli_telefon = '05551110003', dogum_tarihi = '2012-11-25' where kullanici_adi = 'ardas';
update profiller set veli_adi = 'Nur Ak',       veli_telefon = '05551110004', dogum_tarihi = '2015-01-08' where kullanici_adi = 'zeynepa';
update profiller set veli_adi = 'Kemal Öz',     veli_telefon = '05551110005', dogum_tarihi = '2011-05-19' where kullanici_adi = 'merto';
update profiller set veli_adi = 'Sibel Kurt',   veli_telefon = '05551110006', dogum_tarihi = '2013-09-30' where kullanici_adi = 'denizk';


-- ─── Kurslar ───────────────────────────────────────────────────────────────
insert into kurslar (id, baslik, slug, aciklama, yas_araligi, seviye, hafta_sayisi, durum) values
  ('a0000000-0000-0000-0000-000000000001', 'Scratch ile Oyun Geliştirme', 'scratch',
   'Blok tabanlı kodlamayla ilk oyununu yapar.', '8–12 Yaş', 'Başlangıç', 8, 'yayinda'),
  ('a0000000-0000-0000-0000-000000000002', 'Python ile Programlama', 'python',
   'Gerçek bir programlama diline geçiş.', '11–15 Yaş', 'Orta', 8, 'yayinda');

insert into kurs_haftalari (kurs_id, hafta, baslik, konular, proje) values
  ('a0000000-0000-0000-0000-000000000001', 1, 'Scratch ile Tanışma', array['Arayüz','İlk karakter','Hareket blokları'], 'Yürüyen kedi'),
  ('a0000000-0000-0000-0000-000000000001', 2, 'Döngüler', array['Tekrar blokları','Sonsuz döngü'], 'Dans eden karakter'),
  ('a0000000-0000-0000-0000-000000000001', 3, 'Koşullar', array['Eğer-ise','Çarpışma algılama'], 'Engelden kaçan top'),
  ('a0000000-0000-0000-0000-000000000002', 1, 'Python Kurulumu', array['Editör','İlk program','print'], 'Merhaba dünya'),
  ('a0000000-0000-0000-0000-000000000002', 2, 'Değişkenler', array['Sayı ve metin','input'], 'Yaş hesaplayıcı');


-- ─── Sınıflar ──────────────────────────────────────────────────────────────
insert into siniflar (id, ad, kurs_id, egitmen_id, zoom_url, kontenjan, baslangic, bitis) values
  ('b0000000-0000-0000-0000-000000000001', 'Scratch A — Salı/Perşembe 17:00',
   'a0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222221',
   'https://zoom.us/j/000000001', 8, current_date - 14, current_date + 42),
  ('b0000000-0000-0000-0000-000000000002', 'Scratch B — Cumartesi 11:00',
   'a0000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'https://zoom.us/j/000000002', 8, current_date - 7, current_date + 49),
  ('b0000000-0000-0000-0000-000000000003', 'Python A — Pazartesi/Çarşamba 18:00',
   'a0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222221',
   'https://zoom.us/j/000000003', 8, current_date - 21, current_date + 35);

insert into sinif_ogrencileri (sinif_id, ogrenci_id) values
  ('b0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333331'),
  ('b0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333332'),
  ('b0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333334'),
  ('b0000000-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333336'),
  ('b0000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333'),
  ('b0000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333335');

insert into kayitlar (ogrenci_id, kurs_id, siparis_no) values
  ('33333333-3333-3333-3333-333333333331', 'a0000000-0000-0000-0000-000000000001', 'HADEMO0001'),
  ('33333333-3333-3333-3333-333333333332', 'a0000000-0000-0000-0000-000000000001', 'HADEMO0002'),
  ('33333333-3333-3333-3333-333333333334', 'a0000000-0000-0000-0000-000000000001', 'HADEMO0003'),
  ('33333333-3333-3333-3333-333333333336', 'a0000000-0000-0000-0000-000000000001', 'HADEMO0004'),
  ('33333333-3333-3333-3333-333333333333', 'a0000000-0000-0000-0000-000000000002', 'HADEMO0005'),
  ('33333333-3333-3333-3333-333333333335', 'a0000000-0000-0000-0000-000000000002', 'HADEMO0006');


-- ─── Dersler ───────────────────────────────────────────────────────────────
insert into dersler (id, kurs_id, hafta, sira, baslik, aciklama) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 1, 1, 'Scratch arayüzü ve ilk karakter', 'Sahne, kukla ve blok paleti.'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 2, 2, 'Döngülerle hareket', 'Tekrar bloğu ile sürekli hareket.'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 3, 3, 'Koşullar ve çarpışma', 'Eğer-ise blokları.'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 1, 1, 'Python kurulumu ve print', 'Editör kurulumu, ilk satır.'),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 2, 2, 'Değişkenler ve input', 'Kullanıcıdan veri almak.');

-- Elif ilk iki dersi bitirdi (ilerleme tetikleyicisi test edilsin)
insert into ders_ilerleme (ogrenci_id, ders_id, tamamlandi, yuzde) values
  ('33333333-3333-3333-3333-333333333331', 'c0000000-0000-0000-0000-000000000001', true, 100),
  ('33333333-3333-3333-3333-333333333331', 'c0000000-0000-0000-0000-000000000002', true, 100),
  ('33333333-3333-3333-3333-333333333332', 'c0000000-0000-0000-0000-000000000001', true, 100);


-- ─── Takvim ────────────────────────────────────────────────────────────────
insert into takvim (sinif_id, kurs_id, baslik, tur, baslangic, bitis, zoom_url) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Hafta 4 — Değişkenlerle skor', 'canli_ders',
   date_trunc('hour', now()) + interval '1 day', date_trunc('hour', now()) + interval '1 day 1 hour',
   'https://zoom.us/j/000000001'),
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Hafta 4 — İkinci ders', 'canli_ders',
   date_trunc('hour', now()) + interval '3 days', date_trunc('hour', now()) + interval '3 days 1 hour',
   'https://zoom.us/j/000000001'),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002',
   'Hafta 5 — Listeler', 'canli_ders',
   date_trunc('hour', now()) + interval '2 days', date_trunc('hour', now()) + interval '2 days 1 hour',
   'https://zoom.us/j/000000003');


-- ─── Ödevler ───────────────────────────────────────────────────────────────
insert into odevler (id, kurs_id, sinif_id, ders_id, baslik, aciklama, son_tarih, max_puan, olusturan_id) values
  ('d0000000-0000-0000-0000-000000000001',
   'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'c0000000-0000-0000-0000-000000000002',
   'Dans eden karakter', 'Derste yaptığımız döngüyü kullanarak kendi karakterini dans ettir. Projeni .sb3 olarak yükle.',
   now() + interval '5 days', 100, '22222222-2222-2222-2222-222222222221'),
  ('d0000000-0000-0000-0000-000000000002',
   'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003',
   'c0000000-0000-0000-0000-000000000005',
   'Yaş hesaplayıcı', 'Kullanıcıdan doğum yılını alıp yaşını yazan program.',
   now() + interval '3 days', 100, '22222222-2222-2222-2222-222222222221');

-- Bir teslim yapılmış ve değerlendirilmiş, biri değerlendirme bekliyor
insert into odev_teslimleri (odev_id, ogrenci_id, metin, puan, geri_bildirim, degerlendiren, degerlendirme_tarihi) values
  ('d0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333331',
   'Karakterimi 8 adımda döndürdüm.', 90, 'Çok iyi. Döngü sayısını değiştirerek hızı ayarlamayı da dene.',
   '22222222-2222-2222-2222-222222222221', now() - interval '1 day');

insert into odev_teslimleri (odev_id, ogrenci_id, metin) values
  ('d0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333332',
   'Yaptım ama karakter bazen duruyor.');


-- ─── Soru havuzu ───────────────────────────────────────────────────────────
insert into soru_havuzu (id, kurs_id, soru, tur, puan, etiketler, olusturan_id) values
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Scratch''te bir bloğu sürekli tekrar etmek için hangi blok kullanılır?',
   'coktan_secmeli', 10, array['döngü','temel'], '22222222-2222-2222-2222-222222222221');

insert into soru_secenekleri (soru_id, metin, dogru_mu, sira) values
  ('e0000000-0000-0000-0000-000000000001', 'Sürekli tekrarla', true, 1),
  ('e0000000-0000-0000-0000-000000000001', 'Eğer-ise', false, 2),
  ('e0000000-0000-0000-0000-000000000001', '10 adım git', false, 3),
  ('e0000000-0000-0000-0000-000000000001', 'Bekle 1 saniye', false, 4);


-- ─── Duyuru ────────────────────────────────────────────────────────────────
insert into duyurular (baslik, icerik, sinif_id, onemli, olusturan_id) values
  ('Bu hafta ders saati değişti',
   'Salı dersimiz bu haftaya özel 18:00''de başlayacak. Zoom bağlantısı aynı.',
   'b0000000-0000-0000-0000-000000000001', true, '22222222-2222-2222-2222-222222222221'),
  ('Demo Günü tarihi belli oldu',
   'Dönem sonu Demo Günü 15 Kasım Cumartesi 14:00''te. Ailelerinizi davet edebilirsiniz.',
   null, false, '11111111-1111-1111-1111-111111111111');
