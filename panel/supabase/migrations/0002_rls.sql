-- ═══════════════════════════════════════════════════════════════════════════
-- SATIR DÜZEYİ GÜVENLİK (RLS)
--
-- Bu dosya panelin güvenlik temeli. Kurallar burada, veritabanında uygulanıyor;
-- tarayıcıdaki kodda değil. Birisi konsolu açıp sorguyu değiştirse bile
-- başkasının verisine ulaşamaz — Postgres satırları zaten döndürmez.
--
-- Üç seviye:
--   admin    → her şey
--   egitmen  → yalnızca KENDİ sınıfları ve o sınıflardaki öğrenciler
--   ogrenci  → yalnızca KENDİ verisi
--
-- ⚠️ Yardımcı fonksiyonlar `security definer`: politikanın içinden profiller
--    tablosunu okumak gerekiyor ve bu, profiller üzerindeki politikayı tekrar
--    tetikleyip sonsuz döngü yapardı. `security definer` bunu keser.
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Yardımcılar ───────────────────────────────────────────────────────────

create or replace function benim_rolum()
returns rol
language sql stable security definer set search_path = public
as $$ select rol from profiller where id = auth.uid() $$;

create or replace function admin_mi()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(benim_rolum() = 'admin', false) $$;

create or replace function egitmen_mi()
returns boolean
language sql stable security definer set search_path = public
as $$ select coalesce(benim_rolum() = 'egitmen', false) $$;

/** Bu sınıf bana mı ait? (eğitmen) */
create or replace function sinifim_mi(p_sinif uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from siniflar where id = p_sinif and egitmen_id = auth.uid()
  )
$$;

/** Bu öğrenci benim sınıflarımdan birinde mi? (eğitmen) */
create or replace function ogrencim_mi(p_ogrenci uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from sinif_ogrencileri so
    join siniflar s on s.id = so.sinif_id
    where so.ogrenci_id = p_ogrenci and s.egitmen_id = auth.uid()
  )
$$;

/** Bu sınıfa kayıtlı mıyım? (öğrenci) */
create or replace function sinifimda_miyim(p_sinif uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from sinif_ogrencileri
    where sinif_id = p_sinif and ogrenci_id = auth.uid()
  )
$$;

/** Bu kursa kayıtlı mıyım? (öğrenci) */
create or replace function kursum_mu(p_kurs uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from kayitlar where kurs_id = p_kurs and ogrenci_id = auth.uid()
  )
$$;

/** Eğitmen bu kursu bir sınıfı üzerinden veriyor mu? */
create or replace function kursu_veriyor_muyum(p_kurs uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from siniflar where kurs_id = p_kurs and egitmen_id = auth.uid()
  )
$$;


-- ─── Yeni kullanıcı kaydolduğunda profil aç ────────────────────────────────
-- Admin panelden kullanıcı oluşturduğunda auth.users'a satır düşer; profil
-- kaydı bu tetikleyiciyle otomatik açılır.
create or replace function profil_olustur()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into profiller (id, ad_soyad, kullanici_adi, eposta, rol, telefon)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'ad_soyad', 'İsimsiz'),
    coalesce(new.raw_user_meta_data ->> 'kullanici_adi', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'rol')::rol, 'ogrenci'),
    new.raw_user_meta_data ->> 'telefon'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger auth_kullanici_olusunca
  after insert on auth.users
  for each row execute function profil_olustur();


-- ═══════════════════════════════════════════════════════════════════════════
-- RLS'i AÇ
-- ═══════════════════════════════════════════════════════════════════════════

alter table profiller           enable row level security;
alter table kurslar             enable row level security;
alter table kurs_haftalari      enable row level security;
alter table siniflar            enable row level security;
alter table sinif_ogrencileri   enable row level security;
alter table kayitlar            enable row level security;
alter table dersler             enable row level security;
alter table ders_materyalleri   enable row level security;
alter table ders_ilerleme       enable row level security;
alter table takvim              enable row level security;
alter table katilim             enable row level security;
alter table odevler             enable row level security;
alter table odev_teslimleri     enable row level security;
alter table soru_havuzu         enable row level security;
alter table soru_secenekleri    enable row level security;
alter table sinavlar            enable row level security;
alter table sinav_sorulari      enable row level security;
alter table sinav_secenekleri   enable row level security;
alter table sinav_teslimleri    enable row level security;
alter table sinav_cevaplari     enable row level security;
alter table sertifikalar        enable row level security;
alter table duyurular           enable row level security;
alter table mesajlar            enable row level security;
alter table forumlar            enable row level security;
alter table forum_konulari      enable row level security;
alter table forum_yanitlari     enable row level security;
alter table kutuphane           enable row level security;


-- ═══════════════════════════════════════════════════════════════════════════
-- PROFİLLER
-- ═══════════════════════════════════════════════════════════════════════════

create policy "kendi profilimi görürüm" on profiller
  for select using (id = auth.uid());

create policy "admin tüm profilleri görür" on profiller
  for select using (admin_mi());

create policy "eğitmen kendi öğrencilerini görür" on profiller
  for select using (egitmen_mi() and ogrencim_mi(id));

-- Öğrenci ve eğitmen kendi profilini güncelleyebilir ama ROLÜNÜ değiştiremez.
-- Rol değişimi yalnızca adminde (aşağıdaki ayrı politika).
create policy "kendi profilimi güncellerim" on profiller
  for update using (id = auth.uid())
  with check (id = auth.uid() and rol = benim_rolum());

create policy "admin profilleri yönetir" on profiller
  for all using (admin_mi()) with check (admin_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- KURSLAR
-- ═══════════════════════════════════════════════════════════════════════════

create policy "yayındaki kurslar herkese görünür" on kurslar
  for select using (durum = 'yayinda' or admin_mi() or kursu_veriyor_muyum(id));

create policy "admin kursları yönetir" on kurslar
  for all using (admin_mi()) with check (admin_mi());

create policy "kurs haftaları kursla aynı" on kurs_haftalari
  for select using (
    admin_mi() or kursu_veriyor_muyum(kurs_id) or kursum_mu(kurs_id)
    or exists (select 1 from kurslar k where k.id = kurs_id and k.durum = 'yayinda')
  );

create policy "admin kurs haftalarını yönetir" on kurs_haftalari
  for all using (admin_mi()) with check (admin_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- SINIFLAR
-- ═══════════════════════════════════════════════════════════════════════════

create policy "admin tüm sınıfları görür" on siniflar
  for select using (admin_mi());

create policy "eğitmen kendi sınıflarını görür" on siniflar
  for select using (egitmen_id = auth.uid());

create policy "öğrenci kendi sınıfını görür" on siniflar
  for select using (sinifimda_miyim(id));

create policy "admin sınıfları yönetir" on siniflar
  for all using (admin_mi()) with check (admin_mi());

-- Sınıf mevcudu
create policy "admin sınıf mevcudunu görür" on sinif_ogrencileri
  for select using (admin_mi());

create policy "eğitmen kendi sınıfının mevcudunu görür" on sinif_ogrencileri
  for select using (sinifim_mi(sinif_id));

create policy "öğrenci kendi üyeliğini görür" on sinif_ogrencileri
  for select using (ogrenci_id = auth.uid());

create policy "admin sınıfa öğrenci atar" on sinif_ogrencileri
  for all using (admin_mi()) with check (admin_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- KAYITLAR (öğrenci ↔ kurs)
-- ═══════════════════════════════════════════════════════════════════════════

create policy "öğrenci kendi kayıtlarını görür" on kayitlar
  for select using (ogrenci_id = auth.uid());

create policy "admin tüm kayıtları görür" on kayitlar
  for select using (admin_mi());

create policy "eğitmen öğrencisinin kaydını görür" on kayitlar
  for select using (egitmen_mi() and ogrencim_mi(ogrenci_id));

create policy "admin kayıtları yönetir" on kayitlar
  for all using (admin_mi()) with check (admin_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- DERSLER VE MATERYALLER
-- ═══════════════════════════════════════════════════════════════════════════

create policy "ders görünürlüğü" on dersler
  for select using (
    admin_mi()
    or kursu_veriyor_muyum(kurs_id)
    or (sinif_id is not null and sinifim_mi(sinif_id))
    or (yayinda and (
          (sinif_id is not null and sinifimda_miyim(sinif_id))
          or (sinif_id is null and kursum_mu(kurs_id))
       ))
  );

create policy "admin dersleri yönetir" on dersler
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi kursunun derslerini yönetir" on dersler
  for all using (kursu_veriyor_muyum(kurs_id)) with check (kursu_veriyor_muyum(kurs_id));

create policy "materyal görünürlüğü" on ders_materyalleri
  for select using (
    admin_mi()
    or (sinif_id is not null and (sinifim_mi(sinif_id) or sinifimda_miyim(sinif_id)))
    or (ders_id is not null and exists (
          select 1 from dersler d where d.id = ders_id and (
            kursu_veriyor_muyum(d.kurs_id)
            or (d.sinif_id is not null and sinifimda_miyim(d.sinif_id))
            or (d.sinif_id is null and kursum_mu(d.kurs_id))
          )
       ))
  );

create policy "admin materyalleri yönetir" on ders_materyalleri
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi sınıfına materyal yükler" on ders_materyalleri
  for all using (sinif_id is not null and sinifim_mi(sinif_id))
  with check (sinif_id is not null and sinifim_mi(sinif_id));

-- İlerleme: öğrenci kendi ilerlemesini yazar, eğitmen ve admin okur
create policy "öğrenci kendi ilerlemesini yönetir" on ders_ilerleme
  for all using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());

create policy "admin ilerlemeyi görür" on ders_ilerleme
  for select using (admin_mi());

create policy "eğitmen öğrencisinin ilerlemesini görür" on ders_ilerleme
  for select using (egitmen_mi() and ogrencim_mi(ogrenci_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- TAKVİM VE YOKLAMA
-- ═══════════════════════════════════════════════════════════════════════════

create policy "takvim görünürlüğü" on takvim
  for select using (
    admin_mi()
    or (sinif_id is not null and (sinifim_mi(sinif_id) or sinifimda_miyim(sinif_id)))
    or (kurs_id is not null and (kursu_veriyor_muyum(kurs_id) or kursum_mu(kurs_id)))
  );

create policy "admin takvimi yönetir" on takvim
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi sınıfının takvimini yönetir" on takvim
  for all using (sinif_id is not null and sinifim_mi(sinif_id))
  with check (sinif_id is not null and sinifim_mi(sinif_id));

create policy "yoklama görünürlüğü" on katilim
  for select using (
    ogrenci_id = auth.uid() or admin_mi()
    or (egitmen_mi() and ogrencim_mi(ogrenci_id))
  );

create policy "admin yoklamayı yönetir" on katilim
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen yoklama alır" on katilim
  for all using (egitmen_mi() and ogrencim_mi(ogrenci_id))
  with check (egitmen_mi() and ogrencim_mi(ogrenci_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- ÖDEVLER
-- ═══════════════════════════════════════════════════════════════════════════

create policy "ödev görünürlüğü" on odevler
  for select using (
    admin_mi()
    or (sinif_id is not null and (sinifim_mi(sinif_id) or (yayinda and sinifimda_miyim(sinif_id))))
    or (kurs_id is not null and (kursu_veriyor_muyum(kurs_id) or (yayinda and kursum_mu(kurs_id))))
  );

create policy "admin ödevleri yönetir" on odevler
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi sınıfına ödev verir" on odevler
  for all using (sinif_id is not null and sinifim_mi(sinif_id))
  with check (sinif_id is not null and sinifim_mi(sinif_id));

-- Teslim: öğrenci kendi teslimini görür ve yükler
create policy "öğrenci kendi teslimini görür" on odev_teslimleri
  for select using (ogrenci_id = auth.uid());

create policy "öğrenci ödev teslim eder" on odev_teslimleri
  for insert with check (ogrenci_id = auth.uid());

-- ⚠️ Öğrenci teslimi güncelleyebilir ama PUANA ve GERİ BİLDİRİME dokunamaz.
--    Bu ikisi ayrı bir tetikleyiciyle korunuyor (aşağıda).
create policy "öğrenci teslimini günceller" on odev_teslimleri
  for update using (ogrenci_id = auth.uid()) with check (ogrenci_id = auth.uid());

create policy "admin teslimleri yönetir" on odev_teslimleri
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen öğrencisinin teslimini değerlendirir" on odev_teslimleri
  for all using (egitmen_mi() and ogrencim_mi(ogrenci_id))
  with check (egitmen_mi() and ogrencim_mi(ogrenci_id));

-- Öğrenci kendine puan veremesin: puan/geri bildirim yalnızca eğitmen veya
-- admin tarafından değiştirilebilir. Politikalar satırı korur, bu tetikleyici
-- SÜTUNU korur.
create or replace function teslim_puani_koru()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if admin_mi() or egitmen_mi() then
    return new;
  end if;
  if new.puan is distinct from old.puan
     or new.geri_bildirim is distinct from old.geri_bildirim
     or new.degerlendiren is distinct from old.degerlendiren then
    raise exception 'Puan ve geri bildirim yalnızca eğitmen tarafından değiştirilebilir';
  end if;
  return new;
end;
$$;

create trigger teslim_puani_korumasi
  before update on odev_teslimleri
  for each row execute function teslim_puani_koru();


-- ═══════════════════════════════════════════════════════════════════════════
-- SINAVLAR
-- ═══════════════════════════════════════════════════════════════════════════

create policy "soru havuzu personele açık" on soru_havuzu
  for select using (admin_mi() or egitmen_mi());

create policy "admin soru havuzunu yönetir" on soru_havuzu
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen soru ekler" on soru_havuzu
  for all using (egitmen_mi() and olusturan_id = auth.uid())
  with check (egitmen_mi() and olusturan_id = auth.uid());

create policy "soru seçenekleri personele açık" on soru_secenekleri
  for select using (admin_mi() or egitmen_mi());

create policy "personel soru seçeneklerini yönetir" on soru_secenekleri
  for all using (admin_mi() or egitmen_mi()) with check (admin_mi() or egitmen_mi());

create policy "sınav görünürlüğü" on sinavlar
  for select using (
    admin_mi()
    or (sinif_id is not null and (sinifim_mi(sinif_id) or (yayinda and sinifimda_miyim(sinif_id))))
    or (kurs_id is not null and (kursu_veriyor_muyum(kurs_id) or (yayinda and kursum_mu(kurs_id))))
  );

create policy "admin sınavları yönetir" on sinavlar
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi sınıfına sınav açar" on sinavlar
  for all using (sinif_id is not null and sinifim_mi(sinif_id))
  with check (sinif_id is not null and sinifim_mi(sinif_id));

-- ⚠️ Sınav sorularında `dogru_cevap` sütunu var. Öğrenci sınavı görebilmeli
--    ama doğru cevabı GÖRMEMELİ. Bu yüzden öğrenci bu tabloyu doğrudan
--    okumaz; 0003 içindeki `sinav_sorulari_ogrenci` görünümünü kullanır.
create policy "sınav soruları personele açık" on sinav_sorulari
  for select using (
    admin_mi() or exists (
      select 1 from sinavlar s where s.id = sinav_id and (
        (s.sinif_id is not null and sinifim_mi(s.sinif_id))
        or (s.kurs_id is not null and kursu_veriyor_muyum(s.kurs_id))
      )
    )
  );

create policy "personel sınav sorularını yönetir" on sinav_sorulari
  for all using (admin_mi() or egitmen_mi()) with check (admin_mi() or egitmen_mi());

create policy "sınav seçenekleri personele açık" on sinav_secenekleri
  for select using (admin_mi() or egitmen_mi());

create policy "personel sınav seçeneklerini yönetir" on sinav_secenekleri
  for all using (admin_mi() or egitmen_mi()) with check (admin_mi() or egitmen_mi());

create policy "öğrenci kendi sınav teslimini görür" on sinav_teslimleri
  for select using (ogrenci_id = auth.uid());

create policy "öğrenci sınava girer" on sinav_teslimleri
  for insert with check (ogrenci_id = auth.uid());

create policy "admin sınav teslimlerini yönetir" on sinav_teslimleri
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen öğrencisinin sınavını görür" on sinav_teslimleri
  for all using (egitmen_mi() and ogrencim_mi(ogrenci_id))
  with check (egitmen_mi() and ogrencim_mi(ogrenci_id));

create policy "öğrenci kendi cevaplarını yönetir" on sinav_cevaplari
  for all using (exists (
    select 1 from sinav_teslimleri t where t.id = teslim_id and t.ogrenci_id = auth.uid()
  ))
  with check (exists (
    select 1 from sinav_teslimleri t where t.id = teslim_id and t.ogrenci_id = auth.uid()
  ));

create policy "personel cevapları görür" on sinav_cevaplari
  for select using (admin_mi() or egitmen_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- SERTİFİKA
-- ═══════════════════════════════════════════════════════════════════════════

-- Öğrenci YALNIZCA kendi sertifikasını görür; başkasınınkini göremez.
create policy "öğrenci kendi sertifikasını görür" on sertifikalar
  for select using (ogrenci_id = auth.uid());

create policy "admin sertifikaları yönetir" on sertifikalar
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen öğrencisinin sertifikasını görür" on sertifikalar
  for select using (egitmen_mi() and ogrencim_mi(ogrenci_id));


-- ═══════════════════════════════════════════════════════════════════════════
-- İLETİŞİM
-- ═══════════════════════════════════════════════════════════════════════════

create policy "duyuru görünürlüğü" on duyurular
  for select using (
    admin_mi()
    or (yayinda and sinif_id is null and kurs_id is null)
    or (yayinda and sinif_id is not null and (sinifimda_miyim(sinif_id) or sinifim_mi(sinif_id)))
    or (yayinda and kurs_id is not null and (kursum_mu(kurs_id) or kursu_veriyor_muyum(kurs_id)))
  );

create policy "admin duyuruları yönetir" on duyurular
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kendi sınıfına duyuru yapar" on duyurular
  for all using (sinif_id is not null and sinifim_mi(sinif_id))
  with check (sinif_id is not null and sinifim_mi(sinif_id));

create policy "mesajlarımı görürüm" on mesajlar
  for select using (gonderen_id = auth.uid() or alici_id = auth.uid());

create policy "mesaj gönderirim" on mesajlar
  for insert with check (gonderen_id = auth.uid());

create policy "aldığım mesajı okundu işaretlerim" on mesajlar
  for update using (alici_id = auth.uid()) with check (alici_id = auth.uid());

create policy "forum görünürlüğü" on forumlar
  for select using (
    admin_mi()
    or (sinif_id is not null and (sinifimda_miyim(sinif_id) or sinifim_mi(sinif_id)))
    or (kurs_id is not null and (kursum_mu(kurs_id) or kursu_veriyor_muyum(kurs_id)))
  );

create policy "admin forumları yönetir" on forumlar
  for all using (admin_mi()) with check (admin_mi());

create policy "forum konuları forumla aynı" on forum_konulari
  for select using (exists (select 1 from forumlar f where f.id = forum_id));

create policy "kendi konumu açarım" on forum_konulari
  for insert with check (yazar_id = auth.uid());

create policy "kendi konumu düzenlerim" on forum_konulari
  for update using (yazar_id = auth.uid() or admin_mi());

create policy "forum yanıtları görünür" on forum_yanitlari
  for select using (exists (select 1 from forum_konulari k where k.id = konu_id));

create policy "yanıt yazarım" on forum_yanitlari
  for insert with check (yazar_id = auth.uid());

create policy "kendi yanıtımı düzenlerim" on forum_yanitlari
  for update using (yazar_id = auth.uid() or admin_mi());


-- ═══════════════════════════════════════════════════════════════════════════
-- KÜTÜPHANE
-- ═══════════════════════════════════════════════════════════════════════════

create policy "kütüphane personele açık" on kutuphane
  for select using (admin_mi() or egitmen_mi());

create policy "admin kütüphaneyi yönetir" on kutuphane
  for all using (admin_mi()) with check (admin_mi());

create policy "eğitmen kütüphaneye yükler" on kutuphane
  for insert with check (egitmen_mi() and yukleyen_id = auth.uid());
