-- ═══════════════════════════════════════════════════════════════════════════
-- KULLANICI ADIYLA GİRİŞ
--
-- Öğrencilerin çoğunun e-postası yok; sisteme kullanıcı adıyla giriyorlar.
-- Supabase Auth ise e-posta bekliyor.
--
-- İlk denemede kullanıcı adını sabit bir alan adına çevirmiştim
-- (kullanici_adi + '@ogrenci.local') ama bu yalnızca öğrenciler için doğruydu;
-- gerçek e-postası olan eğitmen ve yöneticiler giriş yapamıyordu.
--
-- Doğru çözüm: kullanıcı adından e-postayı veritabanına sordurmak. Oturum
-- açılmadan profiller tablosu okunamayacağı için `security definer` bir
-- fonksiyon gerekiyor.
--
-- ⚠️ Bu fonksiyon YALNIZCA e-posta döndürür — ad, telefon, rol sızdırmaz.
--    Var olmayan kullanıcı için null döner. Bir kullanıcı adının kayıtlı olup
--    olmadığını doğrular; bu, giriş ekranı olan her sistemde zaten böyledir.
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function giris_epostasi(p_kullanici_adi text)
returns text
language sql stable security definer set search_path = public
as $$
  select eposta from profiller
  where kullanici_adi = lower(trim(p_kullanici_adi)) and aktif
  limit 1
$$;

revoke all on function giris_epostasi(text) from public;
grant execute on function giris_epostasi(text) to anon, authenticated;
