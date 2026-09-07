// ─────────────────────────────────────────────────────────────────────────────
// TİCARİ SÖZLEŞMELER
//
// iyzico sanal POS başvurusunun zorunlu tuttuğu metinler:
//   · Ön Bilgilendirme Formu
//   · Mesafeli Satış Sözleşmesi
//   · Teslimat ve İade Şartları
//
// SATICI olarak ana şirket (Hype Vision) görünür; Hype Academia markadır.
// Bütün taraf bilgileri legal-entity.ts'ten okunur — tek yerden düzenlenir.
//
// ⚠️  Bu metinler 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
//     Sözleşmeler Yönetmeliği'ne göre hazırlanmış TASLAKLARDIR. Yayına almadan
//     önce bir hukuk danışmanına okutun; özellikle iade istisnaları ve cayma
//     hakkı maddeleri işletmenizin gerçek uygulamasıyla birebir örtüşmeli.
// ─────────────────────────────────────────────────────────────────────────────

import type { LegalDoc } from './content';
import { SELLER, PAYMENT_PROVIDER, SERVICE, sellerRows } from './legal-entity';

const satici = sellerRows();

export const COMMERCE_DOCS: LegalDoc[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'on-bilgilendirme-formu',
    title: 'Ön Bilgilendirme Formu',
    updated: 'Eylül 2026',
    intro:
      'Bu form, siparişinizi onaylamadan önce hizmetin nitelikleri, bedeli, ödeme ve cayma hakkınız konusunda sizi bilgilendirmek üzere Mesafeli Sözleşmeler Yönetmeliği uyarınca hazırlanmıştır.',
    sections: [
      {
        article: '1',
        heading: 'Satıcı Bilgileri',
        rows: satici,
      },
      {
        article: '2',
        heading: 'Hizmetin Niteliği',
        body: `Sözleşmeye konu hizmet, ${SERVICE.kind}'dir. Dersler ${SERVICE.deliveryMethod} olarak işlenir. Hizmet fiziksel bir ürün teslimi içermez; tek istisna ${SERVICE.physicalItem}.`,
        list: [
          'Her kursun süresi, ders sayısı, ders süresi, sınıf mevcudu ve haftalık müfredatı ilgili kurs sayfasında yazılıdır.',
          'Dersler canlı yapılır, kaydedilir ve öğrenci panelinde 12 ay süreyle erişilebilir kalır.',
          'Kurs sonunda öğrenciye tamamlama sertifikası düzenlenir.',
        ],
      },
      {
        article: '3',
        heading: 'Bedel ve Ödeme',
        list: [
          'Hizmet bedeli, seçilen kurs ve pakete göre değişir ve sipariş özetinde KDV dahil olarak gösterilir.',
          'Sipariş onayından önce toplam tutar, varsa taksit sayısı ve taksit tutarları ayrı ayrı gösterilir.',
          'Ödeme, kredi kartı veya banka kartı ile alınır.',
          'Peşin ödemede indirim, taksitli ödemede vade farkı uygulanabilir; her ikisi de sipariş özetinde açıkça belirtilir.',
        ],
        note: `Ödeme işlemi ${PAYMENT_PROVIDER.name} (${PAYMENT_PROVIDER.legalName}) altyapısı üzerinden 3D Secure ile gerçekleştirilir. ${PAYMENT_PROVIDER.note}`,
      },
      {
        article: '4',
        heading: 'Cayma Hakkı',
        body: 'ALICI, hizmetin ifasına başlanmadan önce herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin on dört (14) gün içinde cayma hakkına sahiptir.',
        list: [
          'Cayma bildirimi, aşağıdaki iletişim kanallarından yazılı olarak yapılır.',
          'Cayma hakkının kullanılması hâlinde ödenen bedel, bildirimin ulaşmasından itibaren en geç on dört (14) gün içinde iade edilir.',
          'SATICI, işletme politikası gereği yasal 14 günlük süreden bağımsız olarak ilk iki ders tamamlanana kadar koşulsuz iade hakkı tanır. Bu, ALICI lehine ek bir haktır.',
        ],
      },
      {
        article: '5',
        heading: 'Cayma Hakkının İstisnası',
        body: 'Mesafeli Sözleşmeler Yönetmeliği madde 15/1-(h) uyarınca, ALICI’nın onayı ile ifasına başlanan hizmetlerde cayma hakkı kullanılamaz. Bununla birlikte SATICI, ilk iki ders tamamlanana kadar koşulsuz iade uygulamasını sürdürür.',
        note: 'Arduino & Robotik kursunda gönderilen donanım seti fiziksel üründür; ambalajı açılmamış ve kullanılmamış olması hâlinde iadesi mümkündür.',
      },
      {
        article: '6',
        heading: 'Şikâyet ve İtiraz',
        body: 'ALICI, uyuşmazlık hâlinde Ticaret Bakanlığı’nca her yıl belirlenen parasal sınırlar dâhilinde, hizmeti satın aldığı veya ikametgâhının bulunduğu yerdeki Tüketici Hakem Heyetine veya Tüketici Mahkemesine başvurabilir.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'mesafeli-satis-sozlesmesi',
    title: 'Mesafeli Satış Sözleşmesi',
    updated: 'Eylül 2026',
    intro:
      'Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, internet üzerinden verilen eğitim hizmetinin satışına ilişkin tarafların hak ve yükümlülüklerini düzenler.',
    sections: [
      {
        article: '1',
        heading: 'Taraflar — SATICI',
        rows: satici,
      },
      {
        article: '2',
        heading: 'Taraflar — ALICI',
        body: 'Sipariş formunda ad, soyad, telefon, e-posta ve fatura bilgilerini beyan eden kişidir. Hizmetten yararlanacak öğrenci 18 yaşından küçükse, sözleşmenin tarafı velisi veya yasal temsilcisidir.',
      },
      {
        article: '3',
        heading: 'Sözleşmenin Konusu',
        body: `İşbu sözleşmenin konusu, ALICI’nın ${SELLER.website} adresinden elektronik ortamda siparişini verdiği, nitelikleri ve satış bedeli aşağıda belirtilen eğitim hizmetinin satışı ve ifasıdır.`,
      },
      {
        article: '4',
        heading: 'Hizmetin Temel Nitelikleri',
        list: [
          `Hizmet türü: ${SERVICE.kind}`,
          `İfa yöntemi: ${SERVICE.deliveryMethod}`,
          'Süre, ders sayısı, ders süresi ve sınıf mevcudu: ilgili kurs sayfasında ve sipariş özetinde belirtilir.',
          'Hizmet bedeli: sipariş özetinde KDV dahil olarak gösterilir.',
          'Geçerlilik: Fiyatlar, sipariş anında sitede ilan edilen tutarlardır.',
        ],
      },
      {
        article: '5',
        heading: 'Hizmetin İfası',
        list: [
          'Ders takvimi, ödeme onayından sonra ALICI ile birlikte belirlenir.',
          'Dersler ilan edilen gün ve saatlerde canlı olarak yapılır; her ders kaydedilir.',
          'SATICI’dan kaynaklanan iptallerde ders telafi edilir veya bedeli iade edilir.',
          'ALICI kaynaklı devamsızlıklarda dönem başına iki telafi hakkı tanınır; talebin dersten en az 24 saat önce iletilmesi gerekir.',
          'Eğitmen değişikliği hâlinde en az eşdeğer nitelikte bir eğitmen görevlendirilir ve ALICI bilgilendirilir.',
        ],
      },
      {
        article: '6',
        heading: 'Ödeme',
        list: [
          'Ödeme, kredi kartı veya banka kartı ile tek çekim ya da taksitli olarak yapılır.',
          'Taksit sayısı ve taksit tutarları sipariş onayından önce gösterilir; taksitlerin toplamı gösterilen toplam tutara eşittir.',
          'Kart bilgileri SATICI tarafından görülmez ve saklanmaz.',
          'Ödemenin bankaca onaylanmaması hâlinde SATICI’nın ifa yükümlülüğü doğmaz.',
        ],
        note: `Ödemeler ${PAYMENT_PROVIDER.legalName} altyapısı üzerinden 3D Secure doğrulamasıyla alınır.`,
      },
      {
        article: '7',
        heading: 'Cayma Hakkı',
        body: 'ALICI, hizmetin ifasına başlanmadan önce on dört (14) gün içinde gerekçe göstermeksizin cayma hakkına sahiptir. Cayma bildirimi yazılı olarak iletilir ve bedel en geç 14 gün içinde iade edilir.',
        note: 'SATICI, yasal 14 günlük süreye ek olarak, ilk iki ders tamamlanana kadar koşulsuz iade hakkı tanır. Bu hak, işletme politikası gereği ALICI lehine tanınmış olup yasal cayma hakkını sınırlamaz.',
      },
      {
        article: '8',
        heading: 'Cayma Hakkının Kullanılamayacağı Hâller',
        body: 'Mesafeli Sözleşmeler Yönetmeliği madde 15 uyarınca, ALICI’nın onayı ile ifasına başlanan hizmetlerde cayma hakkı kullanılamaz. Ambalajı açılmış donanım setleri de bu kapsamdadır.',
      },
      {
        article: '9',
        heading: 'Kişisel Verilerin Korunması',
        body: 'Taraflar, 6698 sayılı Kişisel Verilerin Korunması Kanunu’na uygun davranmayı kabul eder. Verilerin işlenmesine ilişkin ayrıntılar Gizlilik Politikası ve KVKK Aydınlatma Metni’nde yer alır. 18 yaş altı öğrencilere ait veriler yalnızca veli onayıyla işlenir.',
      },
      {
        article: '10',
        heading: 'Mücbir Sebep',
        body: 'Doğal afet, salgın, altyapı kesintisi gibi tarafların kontrolü dışındaki durumlarda yükümlülükler askıya alınır. Süre otuz (30) günü aşarsa taraflar sözleşmeyi feshedebilir; bu hâlde ifa edilmemiş kısmın bedeli iade edilir.',
      },
      {
        article: '11',
        heading: 'Delil Sözleşmesi ve Yetkili Mahkeme',
        body: 'Taraflar arasındaki uyuşmazlıklarda SATICI’nın elektronik kayıtları delil teşkil eder. Ticaret Bakanlığı’nca ilan edilen parasal sınırlar dâhilinde Tüketici Hakem Heyetleri, aşan kısımda Tüketici Mahkemeleri yetkilidir.',
      },
      {
        article: '12',
        heading: 'Yürürlük',
        body: 'ALICI, siteden sipariş vermekle işbu sözleşmenin tüm koşullarını okuduğunu, anladığını ve kabul ettiğini beyan eder. Sözleşme, sipariş onayı ile yürürlüğe girer ve bir örneği ALICI’nın e-posta adresine gönderilir.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'teslimat-ve-iade',
    title: 'Teslimat ve İade Şartları',
    updated: 'Eylül 2026',
    intro:
      'Hizmetin nasıl teslim edildiğini, iade koşullarını ve sürelerini açıklar. İade politikamız yasal asgarinin üzerindedir: ilk iki ders tamamlanana kadar gerekçe sormaksızın tam iade yapıyoruz.',
    sections: [
      {
        heading: 'Teslimat — hizmet nasıl ulaşır?',
        body: `Satın alınan hizmet dijitaldir ve fiziksel bir gönderi gerektirmez. Dersler ${SERVICE.deliveryMethod} olarak yapılır.`,
        list: [
          'Ödeme onayından sonra 1 iş günü içinde ders takvimini belirlemek üzere sizinle iletişime geçilir.',
          'Ders bağlantısı ve öğrenci paneli erişim bilgileri e-posta ile gönderilir.',
          'İlk ders, takvimin karşılıklı onaylanmasının ardından en geç 7 gün içinde başlar.',
          'Her ders kaydedilir; kayıtlar öğrenci panelinde 12 ay boyunca erişilebilir kalır.',
        ],
      },
      {
        heading: 'Donanım seti gönderimi',
        body: 'Arduino & Robotik kursunda 30 parçalık donanım seti kurs ücretine dahildir ve kargo ile adresinize gönderilir.',
        list: [
          'Kayıt onayından sonra 3 iş günü içinde kargoya verilir.',
          'Kargo ücreti SATICI’ya aittir.',
          'İlk ders, setin adresinize ulaşmasının ardından planlanır.',
          'Hasarlı ulaşan setler ücretsiz olarak yenisiyle değiştirilir.',
        ],
      },
      {
        heading: 'İade koşulları',
        rows: [
          ['Ders başlamadan önce', 'Ödemenin tamamı iade edilir'],
          ['İlk 2 ders içinde', 'Ödemenin tamamı koşulsuz iade edilir, gerekçe sorulmaz'],
          ['2. dersten sonra', 'Bedel iadesi yapılmaz; erteleme veya başka kursa geçiş hakkı tanınır'],
          ['SATICI kaynaklı aksaklık', 'Telafi dersi sunulur veya talep hâlinde tam iade yapılır'],
          ['Donanım seti (kullanılmamış)', 'Ambalajı açılmamışsa iade alınır'],
        ],
      },
      {
        heading: 'İade nasıl talep edilir?',
        list: [
          `E-posta: ${SELLER.email}`,
          `Telefon / WhatsApp: ${SELLER.phone}`,
          'Talebinizde ad soyad, sipariş tarihi ve kurs adını belirtmeniz yeterlidir.',
          'Önceden haber verme veya belirli bir süre bekleme şartı yoktur.',
        ],
        note: 'İade tutarı, talebin onaylanmasından itibaren en geç 14 gün içinde ödemenin yapıldığı karta iade edilir. Bankanın kartınıza yansıtma süresi 2–10 iş günü sürebilir; bu süre bankanın inisiyatifindedir.',
      },
      {
        heading: 'Ders erteleme ve telafi',
        body: 'İade hakkından ayrı olarak, dönem başına iki telafi hakkınız vardır.',
        list: [
          'Telafi talebi dersten en az 24 saat önce iletilmelidir.',
          'Ders başka bir gruba veya ayrı bir telafi saatine alınır.',
          'Kaçırılan dersin kaydı aynı gün panelinize yüklenir.',
        ],
        note: 'Telafi için geçerli olan bildirim süresi, iade hakkınızla ilgili değildir. İade talebinde önceden bildirim şartı aranmaz.',
      },
    ],
  },
];
