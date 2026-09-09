-- ═══════════════════════════════════════════════════════════════════════════
-- RLS TESTİ
--
-- Panelin güvenliği bu kurallara dayanıyor, o yüzden iddia etmek yetmez —
-- kanıtlamak gerekir. Her kontrol bir kullanıcı kimliğine bürünüp o kişinin
-- NE GÖREBİLDİĞİNİ ve daha önemlisi NE GÖREMEDİĞİNİ ölçer.
--
-- Çalıştırmak için:
--   docker exec -i supabase_db_hype-academia-panel \
--     psql -U postgres -d postgres -f - < supabase/rls-testi.sql
-- ═══════════════════════════════════════════════════════════════════════════

\set ON_ERROR_STOP on
\pset pager off

create or replace function test_kimlik(p_id uuid) returns void
language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims',
    json_build_object('sub', p_id::text, 'role', 'authenticated')::text, true);
end $$;

create or replace function test_sonuc(p_ad text, p_gecti boolean) returns text
language sql as $$
  select case when p_gecti then '  GECTI  ' else '  KALDI  ' end || p_ad
$$;

create temp table sonuclar (satir text, gecti boolean);
-- Test sonuclarini kimlige burunmusken de yazabilmek icin. Bu gecici tablo
-- yalnizca test oturumunda var; RLS'i etkilemez.
grant insert, select on sonuclar to authenticated;

do $$
declare
  admin_id   uuid := '11111111-1111-1111-1111-111111111111';
  ahmet_id   uuid := '22222222-2222-2222-2222-222222222221';  -- egitmen (Scratch A + Python A)
  selin_id   uuid := '22222222-2222-2222-2222-222222222222';  -- egitmen (Scratch B)
  elif_id    uuid := '33333333-3333-3333-3333-333333333331';  -- ogrenci, Scratch A
  deniz_id   uuid := '33333333-3333-3333-3333-333333333336';  -- ogrenci, Scratch B
  n int;
  g boolean;
begin
  -- ── ADMİN ────────────────────────────────────────────────────────────────
  perform test_kimlik(admin_id);
  select count(*) into n from profiller;
  insert into sonuclar values (test_sonuc('admin 9 kullanicinin hepsini gorur ('||n||')', n = 9), n = 9);

  select count(*) into n from siniflar;
  insert into sonuclar values (test_sonuc('admin 3 sinifin hepsini gorur ('||n||')', n = 3), n = 3);

  -- ── EGITMEN: AHMET ───────────────────────────────────────────────────────
  perform test_kimlik(ahmet_id);
  select count(*) into n from siniflar;
  insert into sonuclar values (test_sonuc('Ahmet YALNIZCA kendi 2 sinifini gorur ('||n||')', n = 2), n = 2);

  -- Ahmet'in ogrencileri: Elif, Can, Zeynep (Scratch A) + Arda, Mert (Python A) = 5
  -- Artı kendi profili = 6
  select count(*) into n from profiller;
  insert into sonuclar values (test_sonuc('Ahmet 5 ogrencisi + kendisi = 6 profil gorur ('||n||')', n = 6), n = 6);

  -- Selin'in ogrencisi Deniz'i GOREMEMELI
  select count(*) into n from profiller where id = deniz_id;
  insert into sonuclar values (test_sonuc('Ahmet, Selin''in ogrencisini GOREMEZ', n = 0), n = 0);

  -- Selin'in sinifini GOREMEMELI
  select count(*) into n from siniflar where egitmen_id = selin_id;
  insert into sonuclar values (test_sonuc('Ahmet, Selin''in sinifini GOREMEZ', n = 0), n = 0);

  -- ── EGITMEN: SELIN ───────────────────────────────────────────────────────
  perform test_kimlik(selin_id);
  select count(*) into n from siniflar;
  insert into sonuclar values (test_sonuc('Selin yalnizca 1 sinifini gorur ('||n||')', n = 1), n = 1);

  select count(*) into n from odev_teslimleri;
  insert into sonuclar values (test_sonuc('Selin baska sinifin odev teslimini GOREMEZ ('||n||')', n = 0), n = 0);

  -- ── OGRENCI: ELIF ────────────────────────────────────────────────────────
  perform test_kimlik(elif_id);
  select count(*) into n from profiller;
  insert into sonuclar values (test_sonuc('Elif YALNIZCA kendi profilini gorur ('||n||')', n = 1), n = 1);

  select count(*) into n from siniflar;
  insert into sonuclar values (test_sonuc('Elif yalnizca kendi sinifini gorur ('||n||')', n = 1), n = 1);

  select count(*) into n from odev_teslimleri;
  insert into sonuclar values (test_sonuc('Elif yalnizca KENDI teslimini gorur ('||n||')', n = 1), n = 1);

  select count(*) into n from kayitlar;
  insert into sonuclar values (test_sonuc('Elif yalnizca kendi kaydini gorur ('||n||')', n = 1), n = 1);

  -- Baska ogrencinin sertifikasini goremez
  select count(*) into n from sertifikalar where ogrenci_id <> elif_id;
  insert into sonuclar values (test_sonuc('Elif baskasinin sertifikasini GOREMEZ', n = 0), n = 0);

  -- ── OGRENCI KENDINE PUAN VEREMEZ ─────────────────────────────────────────
  begin
    update odev_teslimleri set puan = 100 where ogrenci_id = elif_id;
    insert into sonuclar values (test_sonuc('Ogrenci kendine puan VEREMEZ', false), false);
  exception when others then
    insert into sonuclar values (test_sonuc('Ogrenci kendine puan VEREMEZ (engellendi)', true), true);
  end;

  -- ── OGRENCI KENDINI ADMIN YAPAMAZ ────────────────────────────────────────
  -- RLS bunu ya sessizce yok sayar ya da hata firlatir; ikisi de kabul.
  -- Onemli olan rolun DEGISMEMESI.
  perform test_kimlik(elif_id);
  begin
    update profiller set rol = 'admin' where id = elif_id;
  exception when others then
    null;  -- with check reddetti, beklenen davranis
  end;
  perform set_config('role', 'postgres', true);
  select rol = 'ogrenci' into g from profiller where id = elif_id;
  insert into sonuclar values (test_sonuc('Ogrenci kendini admin YAPAMAZ', coalesce(g, false)), coalesce(g, false));

  -- ── OGRENCI SINAV CEVABINI GOREMEZ ───────────────────────────────────────
  perform test_kimlik(elif_id);
  select count(*) into n from soru_havuzu;
  insert into sonuclar values (test_sonuc('Ogrenci soru havuzunu GOREMEZ ('||n||')', n = 0), n = 0);

  -- ── OGRENCI BASKA SINIFA ODEV EKLEYEMEZ ──────────────────────────────────
  begin
    insert into odevler (baslik, sinif_id) values ('sahte', 'b0000000-0000-0000-0000-000000000001');
    insert into sonuclar values (test_sonuc('Ogrenci odev OLUSTURAMAZ', false), false);
  exception when others then
    insert into sonuclar values (test_sonuc('Ogrenci odev OLUSTURAMAZ (engellendi)', true), true);
  end;

  -- ── ILERLEME TETIKLEYICISI ───────────────────────────────────────────────
  -- Elif Scratch'te 3 dersten 2'sini bitirdi → %66.67 olmali
  perform set_config('role', 'postgres', true);
  select ilerleme between 66 and 67 into g
  from kayitlar where ogrenci_id = elif_id;
  insert into sonuclar values (test_sonuc('Kurs ilerlemesi otomatik hesaplandi (%66.67)', coalesce(g,false)), coalesce(g,false));
end $$;

\echo ''
\echo '════════════ RLS TEST SONUCLARI ════════════'
select satir from sonuclar;
\echo ''
select case when count(*) filter (where not gecti) = 0
            then 'TUMU GECTI: ' || count(*)::text || ' kontrol'
            else (count(*) filter (where not gecti))::text || ' KONTROL BASARISIZ' end as ozet
from sonuclar;
