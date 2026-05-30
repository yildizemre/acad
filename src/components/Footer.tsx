import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Linkedin, ArrowRight, CheckCircle2, BadgeCheck } from 'lucide-react';
import Modal from './Modal';

type ModalKey =
  | 'hakkimizda' | 'egitmenler' | 'basin' | 'kariyer' | 'blog' | 'sss'
  | 'nasil-calisir' | 'odeme' | 'iptal' | 'gizlilik' | 'kosullar' | 'kvkk';

const PHONE = '905418629190';
const WA_URL = `https://wa.me/${PHONE}`;
const IG_URL = 'https://instagram.com/hypeacademia';

// ─── Modal content ────────────────────────────────────────────────────────────

function modalFor(key: ModalKey): { title: string; body: JSX.Element } {
  switch (key) {
    case 'hakkimizda':
      return {
        title: 'Hakkımızda',
        body: (
          <div className="space-y-4">
            <p>
              <strong>Hype Academia</strong>, 2020 yılında <strong>Gebze Teknik Üniversitesi</strong> bünyesinde
              kurulan bir teknoloji eğitim platformudur. Kurucu ekibimiz; bilgisayarla görü (computer vision),
              derin öğrenme ve görüntü işleme alanlarında Türkiye'nin önde gelen sanayi kuruluşlarına yapay zeka
              çözümleri geliştirmektedir.
            </p>
            <p>
              Yıllar içinde edindiğimiz endüstriyel birikimi genç nesle aktarmak amacıyla Hype Academia'yı
              hayata geçirdik. Çocuklarınıza yalnızca kod yazmayı değil, gerçek dünya problemlerini
              çözmeyi öğretiyoruz.
            </p>
            <h3 className="font-bold text-brand-navy text-base mt-2">Misyon</h3>
            <p>
              Sektörel yetkinliği genç nesle aktarmak; problem çözen, yaratıcı ve özgüvenli dijital
              liderler yetiştirmek.
            </p>
            <h3 className="font-bold text-brand-navy text-base">Vizyon</h3>
            <p>
              Türkiye'yi teknoloji ihraç eden bir ülkeye dönüştürecek nesli yetiştirmek ve ülkemizin
              global teknoloji ekosistemindeki payını artırmak.
            </p>
            <h3 className="font-bold text-brand-navy text-base">Değerlerimiz</h3>
            <ul className="space-y-2">
              {['Merak ve Özgürlük', 'Uygulamalı Öğrenme', 'Gerçek Projeler', 'Sektörel Yetkinlik', 'Şeffaf İletişim'].map((v) => (
                <li key={v} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-blue-700 text-sm">
                Verilen tüm sertifikalar Türk Hükümeti E-Devlet sistemi üzerinden doğrulanabilmektedir.
              </p>
            </div>
          </div>
        ),
      };

    case 'egitmenler':
      return {
        title: 'Eğitmenlerimiz',
        body: (
          <div className="space-y-5">
            <p>
              Tüm eğitmenlerimiz, aktif olarak endüstride çalışan veya akademik kariyerleri olan
              uzman mühendislerdir. Pedagojik formasyon eğitimi almış olan ekibimiz, teknik yetkinliği
              çocuk dostu bir öğrenme deneyimiyle buluşturur.
            </p>
            {[
              { name: 'Müh. Ahmet K.', title: 'Bilgisayarla Görü Uzmanı', exp: '8 yıl sektör deneyimi — Görüntü işleme ve derin öğrenme alanında büyük sanayi projelerinde yer aldı.', courses: 'Python, Yapay Zeka & ML' },
              { name: 'Müh. Zeynep T.', title: 'Full-Stack Yazılım Mühendisi', exp: '6 yıl deneyim — Fintech ve e-ticaret şirketlerinde web uygulamaları geliştirdi.', courses: 'Web Tasarım & Geliştirme' },
              { name: 'Müh. Can M.', title: 'Yapay Zeka Araştırmacısı', exp: 'Gebze Teknik Üniversitesi\'nde araştırma görevlisi, makine öğrenmesi üzerine yayınları var.', courses: 'Yapay Zeka & ML, Python' },
              { name: 'Müh. Elif S.', title: 'Robotik & Gömülü Sistemler Uzmanı', exp: '5 yıl deneyim — IoT ve robotik projelerinde endüstriyel otomasyon sistemleri geliştirdi.', courses: 'Arduino & Robotik' },
              { name: 'Müh. Burak D.', title: 'Oyun Geliştirici', exp: '7 yıl deneyim — Unity ve Unreal Engine ile mobil ve PC oyunları geliştirdi.', courses: 'Unity Oyun Geliştirme, Scratch' },
            ].map((t) => (
              <div key={t.name} className="border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center shrink-0 font-bold text-brand-green text-sm">
                    {t.name.split(' ')[1][0]}
                  </div>
                  <div>
                    <div className="font-bold text-brand-navy text-sm">{t.name}</div>
                    <div className="text-brand-green text-xs font-medium mb-1">{t.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed mb-1">{t.exp}</p>
                    <div className="text-xs text-gray-400">Verdiği kurslar: <span className="text-brand-navy font-medium">{t.courses}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'basin':
      return {
        title: 'Basın & Medya',
        body: (
          <div className="space-y-4">
            <p>
              Hype Academia ile ilgili basın haberleri, röportajlar veya medya işbirlikleri için
              aşağıdaki iletişim bilgilerini kullanabilirsiniz.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div className="font-bold text-brand-navy text-sm">Basın İletişim</div>
              <p className="text-sm flex items-center gap-2"><Mail className="w-4 h-4 text-brand-green" /> basin@hypeacademia.com</p>
              <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-brand-green" /> +90 541 862 91 90</p>
            </div>
            <p className="text-sm text-gray-500">
              Basın açıklamaları, logo dosyaları ve görsel materyaller için e-posta ile talep oluşturabilirsiniz.
              Taleplerinize en geç 24 saat içinde dönüş sağlanır.
            </p>
          </div>
        ),
      };

    case 'kariyer':
      return {
        title: 'Kariyer',
        body: (
          <div className="space-y-5">
            <p>
              Hype Academia bünyesinde çalışmak ve genç nesle ilham vermek ister misiniz?
              Açık pozisyonlarımıza göz atın.
            </p>
            {[
              { pos: 'Online Eğitmen — Python & Yapay Zeka', type: 'Tam Zamanlı / Part-Time', detail: 'Python veya ML alanında en az 3 yıl deneyim. Pedagojik formasyon veya eğitim deneyimi tercih sebebi.' },
              { pos: 'Online Eğitmen — Web Geliştirme', type: 'Part-Time', detail: 'HTML, CSS, JavaScript ve tercihen React bilgisi. Online ders verme deneyimi artı.' },
              { pos: 'Online Eğitmen — Robotik & Arduino', type: 'Part-Time', detail: 'Gömülü sistemler veya elektronik alanında deneyim. Öğrencilerle iletişim kurma becerisi.' },
              { pos: 'Öğrenci Koordinatörü', type: 'Tam Zamanlı', detail: 'Öğrenci-veli iletişimini yönetir, kayıt süreçlerini koordine eder. CRM deneyimi tercih sebebi.' },
              { pos: 'Sosyal Medya & İçerik Uzmanı', type: 'Part-Time', detail: 'Instagram, TikTok ve YouTube için içerik üretimi. Video düzenleme ve grafik tasarım bilgisi.' },
            ].map((j) => (
              <div key={j.pos} className="border border-gray-100 rounded-2xl p-4">
                <div className="font-bold text-brand-navy text-sm mb-1">{j.pos}</div>
                <span className="text-xs font-semibold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">{j.type}</span>
                <p className="text-gray-500 text-xs mt-2">{j.detail}</p>
              </div>
            ))}
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-medium text-brand-navy mb-1">Başvuru için</p>
              <p className="text-sm text-gray-500">kariyer@hypeacademia.com adresine CV ve kısa bir tanıtım metni gönderin.</p>
            </div>
          </div>
        ),
      };

    case 'blog':
      return {
        title: 'Blog',
        body: (
          <div className="space-y-4">
            <p className="text-gray-500">
              Blog sayfamız çok yakında aktif oluyor! Teknoloji, eğitim ve çocuk gelişimi üzerine
              içerikler hazırlıyoruz.
            </p>
            <p className="text-gray-500">Güncel içerikler için Instagram sayfamızı takip edebilirsiniz:</p>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-pink-600 font-semibold text-sm hover:underline"
            >
              <Instagram className="w-4 h-4" /> instagram.com/hypeacademia
            </a>
          </div>
        ),
      };

    case 'sss':
      return {
        title: 'Sık Sorulan Sorular',
        body: (
          <div className="space-y-5">
            {[
              {
                q: 'Kurslar online mı yoksa yüz yüze mi?',
                a: 'Tüm kurslarımız canlı (live), birebir veya küçük gruplar hâlinde (maksimum 8 öğrenci) online olarak gerçekleştirilmektedir. Zoom veya Google Meet üzerinden yürütülür.',
              },
              {
                q: 'Çocuğumun önceden kodlama bilgisi gerekiyor mu?',
                a: 'Hayır. Başlangıç kurslarımız (Scratch, Arduino) daha önce hiç kod yazmamış çocuklar için özel olarak tasarlanmıştır.',
              },
              {
                q: 'E-Devlet onaylı sertifika nedir?',
                a: 'Kurslarımızı tamamlayan öğrenciler, Türk hükümeti\'nin e-Devlet sistemi üzerinden doğrulanabilir resmi bir tamamlama sertifikası alır. Bu sertifika öğrenci portfolyosu için değer taşır.',
              },
              {
                q: 'Grup dersleri kaç kişilik?',
                a: 'Maksimum 8 öğrenci. Her öğrenciye bireysel ilgi gösterebilmek için grupları kasıtlı olarak küçük tutuyoruz.',
              },
              {
                q: 'Deneme dersini nasıl alabilirim?',
                a: 'Web sitemizdeki formu doldurun ya da WhatsApp hattımıza (0541 862 91 90) mesaj atın. 48 saat içinde sizi arayarak ücretsiz deneme dersini programlıyoruz.',
              },
              {
                q: 'Hangi ülkelerde ders veriyorsunuz?',
                a: 'Derslerimiz tamamen online olduğu için dünyada Türkçe bilen her ülkeden katılım mümkündür.',
              },
              {
                q: 'Teknik ekipman gerekiyor mu?',
                a: 'Kamera ve mikrofon olan bir bilgisayar veya tablet yeterlidir. Arduino kursunda donanım seti kargoya verilmektedir.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="font-semibold text-brand-navy text-sm mb-1.5">{q}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        ),
      };

    case 'nasil-calisir':
      return {
        title: 'Nasıl Çalışır?',
        body: (
          <div className="space-y-5">
            {[
              { n: '01', title: 'Ücretsiz Danışma', desc: 'Uzman eğitmen danışmanlarımız çocuğunuzla tanışır, ilgi alanlarını ve hedeflerini dinler. En uygun programı birlikte belirleriz.' },
              { n: '02', title: 'Ücretsiz Deneme Dersi', desc: '1 saatlik tamamen ücretsiz deneme dersiyle platformumuzu ve eğitim metodumuzu deneyimleyin. Herhangi bir yükümlülük yoktur.' },
              { n: '03', title: 'Kayıt & Ödeme', desc: 'Programı seçin, ödeme planınızı belirleyin. Peşin veya taksit seçenekleri mevcuttur.' },
              { n: '04', title: 'Öğrenme Yolculuğu', desc: 'Canlı dersler, interaktif ödevler ve proje çalışmalarıyla öğrenme süreci başlar. Her ders raporlanır ve aile ile paylaşılır.' },
              { n: '05', title: 'Sertifika & Demo Günü', desc: 'Kurs sonunda öğrenci geliştirdiği projeyi sunar ve E-Devlet onaylı tamamlama sertifikasını alır.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4">
                <div className="w-10 h-10 bg-brand-green text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  {n}
                </div>
                <div>
                  <div className="font-bold text-brand-navy text-sm mb-1">{title}</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      };

    case 'odeme':
      return {
        title: 'Ödeme Seçenekleri',
        body: (
          <div className="space-y-5">
            {[
              { title: 'Peşin Ödeme', badge: 'En Avantajlı', detail: 'Kurs ücretini tek seferinde ödeyerek %10 indirimden yararlanabilirsiniz.' },
              { title: 'Taksitli Ödeme', badge: 'Esnek', detail: 'Anlaşmalı bankalar aracılığıyla kredi kartınıza 3, 6 veya 9 taksit seçeneği (faizsiz).' },
              { title: 'Kurs Paketi', badge: 'İndirimli', detail: '2 veya daha fazla kurs satın alındığında %15 paket indirimi uygulanır.' },
              { title: 'Kardeş İndirimi', badge: '%15 İndirim', detail: 'Aynı aileden ikinci öğrenci için %15 indirim hakkı tanınır.' },
              { title: 'Burs Programı', badge: 'Sosyal Sorumluluk', detail: 'Üstün başarılı ve maddi imkânı kısıtlı öğrencilere tam veya kısmi burs desteği sağlanmaktadır. Detaylar için bizimle iletişime geçin.' },
            ].map(({ title, badge, detail }) => (
              <div key={title} className="border border-gray-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-brand-navy text-sm">{title}</span>
                  <span className="text-xs font-semibold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">{badge}</span>
                </div>
                <p className="text-gray-500 text-sm">{detail}</p>
              </div>
            ))}
            <p className="text-xs text-gray-400">
              Fiyatlar hakkında detaylı bilgi almak için WhatsApp hattımızla iletişime geçebilirsiniz.
            </p>
          </div>
        ),
      };

    case 'iptal':
      return {
        title: 'İptal & İade Politikası',
        body: (
          <div className="space-y-4">
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="font-bold text-brand-navy text-sm mb-1">Ders Başlamadan İptal</div>
              <p className="text-gray-500 text-sm">İlk ders başlamadan yapılan iptallerde ödemenin tamamı iade edilir.</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="font-bold text-brand-navy text-sm mb-1">İlk 2 Ders İçinde İptal</div>
              <p className="text-gray-500 text-sm">İlk iki ders içinde iptal talebinde bulunulursa ödemenin tamamı iade edilir.</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="font-bold text-brand-navy text-sm mb-1">2. Dersten Sonra İptal</div>
              <p className="text-gray-500 text-sm">2. dersten sonra yapılan iptallerde ücret iadesi yapılmaz; ancak ders erteleme veya başka bir kursa geçiş hakkı tanınır.</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4">
              <div className="font-bold text-brand-navy text-sm mb-1">Teknik Sorun Kaynaklı İptal</div>
              <p className="text-gray-500 text-sm">Platformumuzdan kaynaklanan teknik aksaklıklar nedeniyle yapılan iptallerde alternatif ders saati sunulur veya tam iade yapılır.</p>
            </div>
            <p className="text-xs text-gray-400">İptal talepleri en geç 48 saat öncesinden yazılı olarak iletilmelidir.</p>
          </div>
        ),
      };

    case 'gizlilik':
      return {
        title: 'Gizlilik Politikası',
        body: (
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>Son güncelleme: Ocak 2025</p>
            <p>Hype Academia olarak kişisel verilerinizin güvenliğine büyük önem veriyoruz. Bu politika, hangi verileri topladığımızı, nasıl kullandığımızı ve haklarınızı açıklamaktadır.</p>
            <h3 className="font-bold text-brand-navy">Toplanan Veriler</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Ad, soyad ve iletişim bilgileri (telefon, e-posta)</li>
              <li>Öğrenci yaşı ve eğitim tercihleri</li>
              <li>Ders katılım ve ilerleme verileri</li>
              <li>Platform kullanım istatistikleri</li>
            </ul>
            <h3 className="font-bold text-brand-navy">Verilerin Kullanımı</h3>
            <p>Toplanan veriler yalnızca eğitim hizmetlerinin sunumu, iletişim ve hizmet geliştirme amacıyla kullanılmaktadır. Verileriniz üçüncü taraflarla paylaşılmaz.</p>
            <h3 className="font-bold text-brand-navy">Haklarınız</h3>
            <p>6698 sayılı KVKK kapsamında verilerinize erişim, düzeltme, silme ve itiraz hakkına sahipsiniz. Talepler için: kvkk@hypeacademia.com</p>
          </div>
        ),
      };

    case 'kosullar':
      return {
        title: 'Kullanım Koşulları',
        body: (
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>Son güncelleme: Ocak 2025</p>
            <p>Hype Academia platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>
            <h3 className="font-bold text-brand-navy">Hizmet Kapsamı</h3>
            <p>Hype Academia, 8–17 yaş arasındaki çocuklara yönelik online teknoloji eğitimi hizmetleri sunar. Dersler canlı video konferans yoluyla gerçekleştirilir.</p>
            <h3 className="font-bold text-brand-navy">Kullanıcı Yükümlülükleri</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Platformun yasal amaçlarla kullanılması</li>
              <li>Başka kullanıcılara zarar verecek davranışlardan kaçınılması</li>
              <li>Ders materyallerinin ticari amaçla kullanılmaması</li>
            </ul>
            <h3 className="font-bold text-brand-navy">Fikri Mülkiyet</h3>
            <p>Tüm ders içerikleri, materyaller ve platform tasarımı Hype Academia'ya aittir. İzinsiz çoğaltılamaz veya dağıtılamaz.</p>
            <h3 className="font-bold text-brand-navy">Değişiklikler</h3>
            <p>Kullanım koşulları önceden bildirim yapılmaksızın güncellenebilir. Güncel versiyona web sitemizden ulaşabilirsiniz.</p>
          </div>
        ),
      };

    case 'kvkk':
      return {
        title: 'KVKK Aydınlatma Metni',
        body: (
          <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla
              Hype Academia olarak kişisel verilerinizi aşağıda açıklanan amaç ve yöntemlerle
              işlemekteyiz.
            </p>
            <h3 className="font-bold text-brand-navy">Veri Sorumlusu</h3>
            <p>Hype Academia — Gebze Teknik Üniversitesi, Gebze, Kocaeli</p>
            <h3 className="font-bold text-brand-navy">İşlenen Kişisel Veriler</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Kimlik bilgileri (ad, soyad)</li>
              <li>İletişim bilgileri (telefon, e-posta)</li>
              <li>Eğitim ve ilerleme verileri</li>
            </ul>
            <h3 className="font-bold text-brand-navy">İşleme Amaçları</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Eğitim hizmetlerinin sunulması ve koordinasyonu</li>
              <li>Sözleşme ilişkisinin yürütülmesi</li>
              <li>Veli bilgilendirme raporlarının hazırlanması</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
            <h3 className="font-bold text-brand-navy">Haklarınız (KVKK Madde 11)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenen veriler hakkında bilgi talep etme</li>
              <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
              <li>İşlemenin kısıtlanmasını talep etme</li>
              <li>Veri taşınabilirliği hakkı</li>
            </ul>
            <p>Talepleriniz için: <strong className="text-brand-navy">kvkk@hypeacademia.com</strong></p>
          </div>
        ),
      };

    default:
      return { title: '', body: <></> };
  }
}

// ─── Footer links data ────────────────────────────────────────────────────────

const kurslar: { label: string }[] = [
  { label: 'Scratch ile Oyun Geliştirme' },
  { label: 'Python Programlama' },
  { label: 'Web Tasarım & Geliştirme' },
  { label: 'Unity Oyun Geliştirme' },
  { label: 'Yapay Zeka & ML' },
  { label: 'Arduino & Robotik' },
];

const kurumsal: { label: string; key: ModalKey }[] = [
  { label: 'Hakkımızda', key: 'hakkimizda' },
  { label: 'Eğitmenlerimiz', key: 'egitmenler' },
  { label: 'Basın & Medya', key: 'basin' },
  { label: 'Kariyer', key: 'kariyer' },
  { label: 'Blog', key: 'blog' },
  { label: 'SSS', key: 'sss' },
];

const destek: { label: string; key: ModalKey }[] = [
  { label: 'Nasıl Çalışır?', key: 'nasil-calisir' },
  { label: 'Ödeme Seçenekleri', key: 'odeme' },
  { label: 'İptal & İade', key: 'iptal' },
  { label: 'Gizlilik Politikası', key: 'gizlilik' },
  { label: 'Kullanım Koşulları', key: 'kosullar' },
  { label: 'KVKK', key: 'kvkk' },
];

const socials = [
  { icon: Instagram, label: 'Instagram', href: IG_URL },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);

  const open = (key: ModalKey) => setActiveModal(key);
  const close = () => setActiveModal(null);

  const modal = activeModal ? modalFor(activeModal) : null;

  return (
    <>
      {modal && (
        <Modal title={modal.title} onClose={close}>
          {modal.body}
        </Modal>
      )}

      <footer id="iletisim" className="bg-brand-navy text-white">
        {/* CTA strip */}
        <div className="border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-14">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Çocuğunuzun Potansiyelini Keşfedin
                </h3>
                <p className="text-white/60">
                  Ücretsiz deneme dersine kayıt olun — 48 saat içinde sizi arayalım.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="tel"
                  placeholder="Telefon numaranız"
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-green transition-colors w-full sm:w-60"
                />
                <button className="btn-primary whitespace-nowrap !py-3">
                  Kayıt Ol
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <a href="#" className="inline-block mb-5 hover:opacity-90 transition-opacity">
                <div className="bg-white rounded-2xl px-4 py-2.5 inline-block shadow-md">
                  <img
                    src="/logo.png"
                    alt="Hype Academia"
                    className="h-32 w-auto"
                  />
                </div>
              </a>
              <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
                2020'den beri Gebze Teknik Üniversitesi bünyesinde, 8–17 yaş arası
                çocuklara teknoloji ve yazılım eğitimi veriyoruz.
              </p>

              <div className="space-y-3 text-sm text-white/60">
                <a
                  href={`mailto:info@hypeacademia.com`}
                  className="flex items-center gap-3 hover:text-brand-green transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-green shrink-0" />
                  info@hypeacademia.com
                </a>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-brand-green transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-green shrink-0" />
                  +90 541 862 91 90
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span>Gebze Teknik Üniversitesi,<br />Gebze, Kocaeli</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {socials.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-green transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Kurslar */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
                Kurslar
              </h4>
              <ul className="space-y-2.5">
                {kurslar.map(({ label }) => (
                  <li key={label}>
                    <button
                      onClick={() => document.querySelector('#kurslar')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-white/60 text-sm hover:text-brand-green transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
                Kurumsal
              </h4>
              <ul className="space-y-2.5">
                {kurumsal.map(({ label, key }) => (
                  <li key={label}>
                    <button
                      onClick={() => open(key)}
                      className="text-white/60 text-sm hover:text-brand-green transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destek */}
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-widest text-white/40 mb-4">
                Destek
              </h4>
              <ul className="space-y-2.5">
                {destek.map(({ label, key }) => (
                  <li key={label}>
                    <button
                      onClick={() => open(key)}
                      className="text-white/60 text-sm hover:text-brand-green transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Hype Academia. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-5">
              <button onClick={() => open('gizlilik')} className="text-white/40 text-xs hover:text-white/70 transition-colors">Gizlilik</button>
              <button onClick={() => open('kosullar')} className="text-white/40 text-xs hover:text-white/70 transition-colors">Koşullar</button>
              <button onClick={() => open('kvkk')} className="text-white/40 text-xs hover:text-white/70 transition-colors">KVKK</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
