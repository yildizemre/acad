# Hype Academia — Panel (LMS)

Öğrenci / eğitmen / yönetim paneli. Pazarlama sitesinden **ayrı** bir uygulama:
site prerender edilip SEO'ya göre kuruluyor, panel ise tamamen oturum arkasında
ve arama motorlarına kapalı.

## Yerelde çalıştırma

Docker Desktop açık olmalı.

```bash
cd panel
npm install
npx supabase start      # Postgres + Auth + Storage + Studio (ilk sefer ~5 GB indirir)
npm run dev             # http://localhost:5174
```

`npx supabase start` çıktısındaki `ANON_KEY` değerini `panel/.env` içine yazın
(`.env.example` şablon). Supabase Studio: http://localhost:54323

Şemayı sıfırlayıp demo veriyi yeniden yüklemek için:
```bash
npx supabase db reset
```

## Demo hesaplar

Hepsinin şifresi `demo1234`.

| Kullanıcı adı | Rol | Ne görür |
|---|---|---|
| `admin` | Yönetici | Her şey |
| `ahmetk` | Eğitmen | Yalnızca kendi 2 sınıfı ve 5 öğrencisi |
| `selind` | Eğitmen | Yalnızca kendi 1 sınıfı |
| `elify` | Öğrenci | Yalnızca kendi kursu, ödevi, notu |

## Güvenlik

Yetki kuralları **veritabanında** (`supabase/migrations/0002_rls.sql`), uygulamada
değil. Tarayıcıdaki kodu kurcalayan biri başkasının verisine ulaşamaz — Postgres
satırları zaten döndürmez.

Kuralların gerçekten çalıştığı test edilebilir:

```bash
docker exec -i supabase_db_hype-academia-panel \
  psql -U postgres -d postgres -f - < supabase/rls-testi.sql
```

18 kontrol var; hepsi geçmeli. Örnekler: "eğitmen başkasının öğrencisini
göremez", "öğrenci kendine puan veremez", "öğrenci kendini admin yapamaz",
"öğrenci soru havuzunu göremez".

## Şema değişince

```bash
npx supabase gen types typescript --local > src/lib/veritabani-tipleri.ts
```

Bu dosya **elle yazılmaz**. (Başta elle yazılmıştı; supabase-js'in beklediği
jenerik şekil çok hassas, en ufak sapmada bütün şemayı geçersiz sayıp
insert/update yüklerini `never` yapıyor ve sebebi hiç anlatmıyor.)

## Yapılacaklar

- [ ] **Kullanıcı oluşturma Edge Function'a taşınacak.** Şu an `signUp` ile
      açılıyor; bu, admin oturumunu bir an için yeni kullanıcıya çeviriyor ve
      `enable_signup = true` gerektiriyor — yani panelin adresini bilen biri
      kendine hesap açabilir. Canlıda kapatılmalı, `service_role` ile çalışan
      bir Edge Function yazılmalı.
- [ ] Sınav çözme ekranı (şema hazır: `sinavlar`, `soru_havuzu`, görünümler)
- [ ] Yoklama ekranı (şema hazır: `katilim`)
- [ ] Mesajlar ve forum ekranları (şema hazır)
- [ ] Kurs/ders oluşturma ve düzenleme (şu an yalnızca listeleme)
- [ ] Sertifika PDF üretimi
- [ ] Ödeme → otomatik hesap açma (PayTR bildirimine bağlanacak)

## Bilinen yerel sorun

`supabase/storage-api:v1.72.1` imajı disk dolu hatasından sonra bozuk katmanla
önbelleğe alınmıştı (`/app/package.json` 0 bayt). Çözüm olarak sağlam olan
`v1.71.0` yerelde `v1.72.1` etiketiyle işaretlendi:

```bash
docker tag public.ecr.aws/supabase/storage-api:v1.71.0 \
           public.ecr.aws/supabase/storage-api:v1.72.1
```

Yalnızca bu makineyi ilgilendirir; Supabase bulutunda böyle bir sorun yok.
