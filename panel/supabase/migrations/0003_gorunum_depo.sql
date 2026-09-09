-- ═══════════════════════════════════════════════════════════════════════════
-- GÖRÜNÜMLER, DOSYA DEPOSU VE HESAPLAMALAR
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Öğrenciye açık sınav soruları ─────────────────────────────────────────
-- sinav_sorulari tablosunda `dogru_cevap` sütunu var. Öğrenci sınavı çözerken
-- soruları görmeli ama cevabı görmemeli. Tabloyu doğrudan açmak yerine
-- cevapsız bir görünüm veriyoruz.
create view sinav_sorulari_ogrenci
with (security_invoker = off) as
  select q.id, q.sinav_id, q.soru, q.tur, q.puan, q.sira
  from sinav_sorulari q
  join sinavlar s on s.id = q.sinav_id
  where s.yayinda
    and (
      (s.sinif_id is not null and sinifimda_miyim(s.sinif_id))
      or (s.kurs_id is not null and kursum_mu(s.kurs_id))
    );

create view sinav_secenekleri_ogrenci
with (security_invoker = off) as
  select o.id, o.soru_id, o.metin, o.sira
  from sinav_secenekleri o
  where exists (select 1 from sinav_sorulari_ogrenci q where q.id = o.soru_id);

comment on view sinav_sorulari_ogrenci is
  'Sınav soruları — dogru_cevap sütunu YOK. Öğrenci tarafı bunu kullanır.';


-- ─── Kurs ilerlemesini otomatik hesapla ────────────────────────────────────
-- Öğrenci bir dersi tamamladığında kayıttaki yüzde kendiliğinden güncellensin;
-- uygulamanın bunu hatırlamasına gerek kalmasın.
create or replace function kurs_ilerlemesini_guncelle()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_kurs uuid;
  v_toplam int;
  v_biten int;
begin
  select kurs_id into v_kurs from dersler where id = new.ders_id;
  if v_kurs is null then return new; end if;

  select count(*) into v_toplam
  from dersler where kurs_id = v_kurs and yayinda;

  select count(*) into v_biten
  from ders_ilerleme di
  join dersler d on d.id = di.ders_id
  where di.ogrenci_id = new.ogrenci_id and d.kurs_id = v_kurs and di.tamamlandi;

  update kayitlar
  set ilerleme = case when v_toplam = 0 then 0
                      else round(v_biten::numeric * 100 / v_toplam, 2) end,
      tamamlandi = (v_toplam > 0 and v_biten >= v_toplam)
  where ogrenci_id = new.ogrenci_id and kurs_id = v_kurs;

  return new;
end;
$$;

create trigger ders_ilerlemesi_degisince
  after insert or update on ders_ilerleme
  for each row execute function kurs_ilerlemesini_guncelle();


-- ─── Sertifika numarası ────────────────────────────────────────────────────
create or replace function sertifika_no_uret()
returns text
language sql volatile
as $$
  select 'HA-' || to_char(now(), 'YYYY') || '-' ||
         upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
$$;


-- ─── Eğitmenin panosu için özet ────────────────────────────────────────────
-- Sınıf listesinde "kaç öğrenci, kaç bekleyen ödev" görünsün diye.
create view sinif_ozet
with (security_invoker = on) as
  select
    s.id,
    s.ad,
    s.kurs_id,
    s.egitmen_id,
    s.zoom_url,
    s.kontenjan,
    s.aktif,
    (select count(*) from sinif_ogrencileri so where so.sinif_id = s.id) as ogrenci_sayisi,
    (select count(*) from odevler o where o.sinif_id = s.id and o.yayinda) as odev_sayisi,
    (select min(t.baslangic) from takvim t
      where t.sinif_id = s.id and t.baslangic > now()) as sonraki_ders
  from siniflar s;


-- ═══════════════════════════════════════════════════════════════════════════
-- DOSYA DEPOSU
--
-- Üç kova:
--   materyaller    → eğitmenin yüklediği PDF/sunum (sınıfa özel)
--   odev-teslim    → öğrencinin yüklediği ödev dosyası
--   sertifika      → üretilen sertifika PDF'i
--
-- Üçü de PRIVATE. Erişim imzalı ve süreli bağlantıyla veriliyor; dosya
-- adresini bilen birinin indirebilmesi kabul edilemez (çocuk çalışmaları).
-- ═══════════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('materyaller', 'materyaller', false),
       ('odev-teslim', 'odev-teslim', false),
       ('sertifika',   'sertifika',   false)
on conflict (id) do nothing;

-- Materyal: personel yükler, sınıftaki öğrenci okur.
-- Dosya yolu düzeni: materyaller/<sinif_id>/<dosya>
create policy "materyal okuma" on storage.objects
  for select using (
    bucket_id = 'materyaller' and (
      admin_mi()
      or sinifim_mi((storage.foldername(name))[1]::uuid)
      or sinifimda_miyim((storage.foldername(name))[1]::uuid)
    )
  );

create policy "materyal yükleme" on storage.objects
  for insert with check (
    bucket_id = 'materyaller' and (
      admin_mi() or sinifim_mi((storage.foldername(name))[1]::uuid)
    )
  );

create policy "materyal silme" on storage.objects
  for delete using (
    bucket_id = 'materyaller' and (
      admin_mi() or sinifim_mi((storage.foldername(name))[1]::uuid)
    )
  );

-- Ödev teslimi: yol düzeni odev-teslim/<ogrenci_id>/<odev_id>/<dosya>
-- Öğrenci yalnızca KENDİ klasörüne yazar ve kendi dosyasını okur.
create policy "ödev teslimi okuma" on storage.objects
  for select using (
    bucket_id = 'odev-teslim' and (
      (storage.foldername(name))[1] = auth.uid()::text
      or admin_mi()
      or (egitmen_mi() and ogrencim_mi((storage.foldername(name))[1]::uuid))
    )
  );

create policy "ödev teslimi yükleme" on storage.objects
  for insert with check (
    bucket_id = 'odev-teslim'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "ödev teslimi güncelleme" on storage.objects
  for update using (
    bucket_id = 'odev-teslim'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Sertifika: yol düzeni sertifika/<ogrenci_id>/<dosya>
create policy "sertifika okuma" on storage.objects
  for select using (
    bucket_id = 'sertifika' and (
      (storage.foldername(name))[1] = auth.uid()::text or admin_mi()
    )
  );

create policy "sertifika yükleme" on storage.objects
  for insert with check (bucket_id = 'sertifika' and admin_mi());
