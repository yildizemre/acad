// ─────────────────────────────────────────────────────────────────────────────
// REHBER YAZILARI
//
// Velinin Google'a gerçekten yazdığı soruların cevapları. Her yazı bir arama
// sorgusuna karşılık gelir ve ilgili kurs sayfalarına yol verir.
//
// İçerik markdown değil, yapılandırılmış bloklar hâlinde tutuluyor: böylece
// tasarım sistemine bağlı kalıyor ve ek bir kütüphane gerekmiyor.
// ─────────────────────────────────────────────────────────────────────────────

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface Article {
  slug: string;
  title: string;
  /** Liste sayfasında ve arama sonucunda görünen özet */
  excerpt: string;
  category: 'Yol Haritası' | 'Karar Rehberi' | 'Veli Rehberi' | 'Teknik';
  readMinutes: number;
  /** ISO tarih — sıralama ve schema.org için */
  published: string;
  author: string;
  body: Block[];
  /** Yazının sonunda önerilecek kurslar */
  relatedCourseIds: string[];
}

export const ARTICLES: Article[] = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'cocugum-kac-yasinda-kodlamaya-baslamali',
    title: 'Çocuğum kaç yaşında kodlamaya başlamalı?',
    excerpt:
      'Kısa cevap 8. Ama asıl ölçü yaş değil, hazır olma işaretleri. Yaş gruplarına göre neyin gerçekçi olduğunu ve neyin pazarlama olduğunu ayırıyoruz.',
    category: 'Yol Haritası',
    readMinutes: 7,
    published: '2026-02-18',
    author: 'Hype Academia',
    relatedCourseIds: ['scratch', 'robotics', 'python'],
    body: [
      {
        type: 'p',
        text: 'Bu soruyu her hafta alıyoruz ve dürüst cevabı şu: yaş tek başına yeterli bir ölçü değil. Aynı sınıftaki iki çocuktan biri 8 yaşında Scratch ile oyun yaparken, diğeri 10 yaşında hâlâ fare kullanmakta zorlanabiliyor. Yine de bir yerden başlamak gerekiyor — aşağıda hem yaş aralıklarını hem de gerçekten işe yarayan hazır olma işaretlerini ayırdık.',
      },
      { type: 'h2', text: 'Kısa cevap' },
      {
        type: 'p',
        text: '8 yaş, blok tabanlı görsel kodlama için gerçekçi bir başlangıç. 11 yaş, klavyeden gerçek kod yazmaya geçiş için makul bir eşik. 14 yaş, yapay zeka gibi soyut konular için uygun. Bunların hepsi ortalama; çocuğunuz bir yıl önde ya da geride olabilir ve bu tamamen normaldir.',
      },
      { type: 'h2', text: 'Yaş gruplarına göre gerçekçi beklenti' },
      { type: 'h3', text: '5–7 yaş: henüz değil' },
      {
        type: 'p',
        text: 'Bu yaş için satılan "kodlama" kurslarının çoğu aslında renk eşleştirme ve yön bulma oyunları. Zararlı değil, ama kodlama da değil ve ücretini hak etmiyor. Bu yaşta algoritmik düşünmeye gerçekten katkı yapan şeyler ekran gerektirmiyor: tarif takip etmek, lego talimatı okumak, satranç, labirent çizmek, "önce şunu sonra bunu" oyunları. Parayı buraya harcamayın; zamanı buraya harcayın.',
      },
      { type: 'h3', text: '8–10 yaş: blok tabanlı kodlama' },
      {
        type: 'p',
        text: 'Gerçek başlangıç burası. Scratch gibi blok tabanlı ortamlarda çocuk klavyeden kod yazmaz, hazır komutları sürükleyip birleştirir. Ama arkada öğrendiği şey programlamanın kendisidir: döngüler, koşullar, değişkenler, olaylar. Yazım hatası diye bir engel olmadığı için çocuk fikrine odaklanabiliyor.',
      },
      {
        type: 'p',
        text: 'Bu yaşta hedef "yazılımcı yetiştirmek" değil. Hedef, çocuğun ekranın tüketici tarafından üretici tarafına geçmesi ve "ben de bir şey yapabiliyorum" duygusunu yaşaması. Bu duygu sonraki her teknik derse karşı tutumunu belirliyor.',
      },
      { type: 'h3', text: '11–13 yaş: metin tabanlı programlamaya geçiş' },
      {
        type: 'p',
        text: 'Klavyeyi rahat kullanabilen ve soyut düşünmeye başlayan çocuklar Python gibi gerçek bir dile geçebilir. Bu geçiş kritiktir ve çoğu çocuğun tökezlediği yer burasıdır: bloklarda hata yapmak imkânsızken, metin tabanlı kodda tek bir noktalama işareti programı durdurur. Bu aşamada iyi bir eğitmenin değeri en yüksektir.',
      },
      { type: 'h3', text: '14–17 yaş: uzmanlaşma' },
      {
        type: 'p',
        text: 'Temel oturduysa yapay zeka, oyun geliştirme veya web gibi bir alana derinleşme zamanı. Bu yaşta üretilen işler artık portfolyo değeri taşıyor: yayınlanmış bir oyun, canlı bir web sitesi veya eğitilmiş bir model, üniversite başvurusunda da staj görüşmesinde de gerçek bir kanıt.',
      },
      { type: 'h2', text: 'Yaştan daha iyi bir ölçü: hazır olma işaretleri' },
      {
        type: 'p',
        text: 'Çocuğunuzda aşağıdakilerin çoğu varsa, yaşı ne olursa olsun başlayabilir:',
      },
      {
        type: 'ul',
        items: [
          'Akıcı okuyor — ekrandaki talimatı kendi başına okuyabilmesi gerekiyor',
          '20–30 dakika tek bir işe odaklanabiliyor',
          'Bir şey ilk denemede olmayınca hemen bırakmıyor, tekrar deniyor',
          'Fareyi ve klavyeyi zorlanmadan kullanıyor',
          '"Bu nasıl çalışıyor?" diye soruyor — oyun, uygulama, herhangi bir şey için',
        ],
      },
      {
        type: 'callout',
        title: 'En önemli işaret',
        text: 'Hata karşısındaki tepki. Kodlama, çalışmayan bir şeyi çalışır hâle getirme sanatıdır. Hata mesajını gördüğünde yıkılan değil merak eden çocuk, yaşı ne olursa olsun hazırdır. Bu tepki öğretilebilir bir şeydir ve kursun asıl kazandırdığı beceri de zaten budur.',
      },
      { type: 'h2', text: 'Sık duyduğumuz iki yanlış inanış' },
      { type: 'h3', text: '"Erken başlamazsa geç kalır"' },
      {
        type: 'p',
        text: 'Doğru değil. Bugün sektörde çalışan yazılımcıların büyük çoğunluğu kodlamaya lise veya üniversitede başladı. 14 yaşında başlayan bir çocuk, 8 yaşında başlayan birini bir yıl içinde yakalayabiliyor — çünkü soyut düşünme kapasitesi daha yüksek. Erken başlamanın avantajı hız değil, teknolojiyle kurulan ilişkinin niteliği.',
      },
      { type: 'h3', text: '"Matematiği iyi değil, yapamaz"' },
      {
        type: 'p',
        text: 'Sıklıkla tam tersi oluyor. Kodlama matematiği somutlaştırdığı için, matematikle arası iyi olmayan çocuklarda bazen matematik notunu da yukarı çekiyor. Koordinat sistemi soyut bir kavramken, karakteri ekranda hareket ettirmek için kullanıldığında somutlaşıyor. Başlangıç seviyesinde gereken matematik dört işlemden ibarettir.',
      },
      { type: 'h2', text: 'Peki nereden başlamalı?' },
      {
        type: 'p',
        text: 'Yaşına uygun bir deneme dersi yapın ve sonrasında çocuğunuzu izleyin. Ders bitince anlatıyor mu? Programı tekrar açmak istiyor mu? "Şunu da yapabilir miyim" diyor mu? Bu üç işaretten ikisi varsa doğru zamandasınız. Hiçbiri yoksa altı ay sonra tekrar deneyin — bu bir başarısızlık değil, sadece zamanlama.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'scratch-mi-python-mi',
    title: 'Scratch mi Python mı? Hangisiyle başlanmalı',
    excerpt:
      'İkisi rakip değil, sıralı iki adım. Ama her çocuğun Scratch ile başlaması da gerekmiyor. Hangi durumda hangisinin doğru olduğunu netleştiriyoruz.',
    category: 'Karar Rehberi',
    readMinutes: 6,
    published: '2026-03-24',
    author: 'Hype Academia',
    relatedCourseIds: ['scratch', 'python'],
    body: [
      {
        type: 'p',
        text: 'Bu iki isim genellikle birbirinin alternatifi gibi sunuluyor, ama aslında farklı işler yapıyorlar. Scratch bir programlama dili değil; programlama fikirlerini öğretmek için tasarlanmış bir ortam. Python ise gerçek bir üretim dili — Google, NASA ve Instagram dahil pek çok yerde kullanılıyor.',
      },
      { type: 'h2', text: 'Temel fark' },
      {
        type: 'table',
        head: ['', 'Scratch', 'Python'],
        rows: [
          ['Yaş aralığı', '8–12', '11 ve üzeri'],
          ['Nasıl yazılır', 'Blok sürükleyerek', 'Klavyeyle metin'],
          ['Yazım hatası riski', 'Yok', 'Program durur'],
          ['İlk çalışan çıktı', 'İlk derste', '2–3 ders sonra'],
          ['Öğrettiği şey', 'Programlama mantığı', 'Mantık + gerçek dil'],
          ['Sonraki adım', 'Python veya Unity', 'Yapay zeka, web, veri'],
        ],
      },
      { type: 'h2', text: 'Scratch ile başlaması gerekenler' },
      {
        type: 'p',
        text: 'Çocuğunuz 8–10 yaş aralığındaysa, klavyeyi henüz hızlı kullanamıyorsa veya daha önce hiç kodlama denemediyse Scratch doğru başlangıç. Blok yapısı yazım hatası olasılığını sıfırladığı için çocuk bütün enerjisini "ne yapmak istiyorum" sorusuna harcıyor. Bu, özgüven açısından belirleyici: ilk haftada çalışan bir oyunu oluyor.',
      },
      { type: 'h2', text: 'Doğrudan Python ile başlayabilecekler' },
      {
        type: 'p',
        text: 'Çocuğunuz 11 yaş ve üzerindeyse, klavyeyi rahat kullanıyorsa ve özellikle "gerçek kod yazmak istiyorum" diyorsa Scratch aşamasını atlayabilirsiniz. Bu yaştaki bazı çocuklar blok tabanlı ortamı çocukça bulup motivasyon kaybediyor — bu gerçek bir risk ve zorlamanın anlamı yok.',
      },
      {
        type: 'callout',
        title: 'Atlamanın bedeli',
        text: 'Scratch’i atlarsanız mantık kavramlarını (döngü, koşul, değişken) daha zor bir ortamda öğrenmek gerekir. İyi bir Python kursu bunu telafi eder ama ilk 3–4 hafta daha yorucu geçer. Çocuğunuz sabırsızsa Scratch, çabuk sıkılıyorsa Python.',
      },
      { type: 'h2', text: 'Karar için üç soru' },
      {
        type: 'ol',
        items: [
          'Çocuğunuz 11 yaşından küçük mü? Evetse Scratch.',
          'Klavyede zorlanıyor mu? Evetse Scratch — yoksa ders klavye kursuna dönüşür.',
          '"Bebek işi" diye tepki verme ihtimali var mı? Varsa ve 11 yaş üstündeyse doğrudan Python.',
        ],
      },
      { type: 'h2', text: 'Sonrasında ne oluyor?' },
      {
        type: 'p',
        text: 'Scratch’ten sonra doğal devam Python. Python’dan sonra ise çocuğun ilgisine göre üç yol açılıyor: yapay zeka ve veri bilimi, web geliştirme veya oyun geliştirme. Yani hangi kapıdan girerse girsin yol tıkanmıyor; önemli olan ilk adımın onu yormaması.',
      },
      {
        type: 'p',
        text: 'Emin olamıyorsanız en pratik yöntem her ikisinin de deneme dersini yapmak ve çocuğunuzun hangisinden sonra daha çok konuştuğuna bakmak. Bu, herhangi bir testten daha güvenilir bir ölçüdür.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'online-kodlama-kursu-secerken-9-soru',
    title: 'Online kodlama kursu seçerken sorulması gereken 9 soru',
    excerpt:
      'Kayıt olmadan önce sorun. Cevap kaçamaklıysa bu da bir cevaptır. Her soru için iyi cevabın neye benzediğini de yazdık.',
    category: 'Veli Rehberi',
    readMinutes: 8,
    published: '2026-04-15',
    author: 'Hype Academia',
    relatedCourseIds: [],
    body: [
      {
        type: 'p',
        text: 'Online eğitimde en büyük sorun, satın alırken ürünü göremiyor olmanız. Aşağıdaki dokuz soru tanıtım metinlerinin arkasındaki gerçeği görmenizi sağlar. Bunları bize de sorun, başka kurumlara da.',
      },
      { type: 'h2', text: '1. Sınıfta kaç öğrenci var?' },
      {
        type: 'p',
        text: 'İyi cevap net bir sayıdır: 4, 6, 8. "Küçük gruplar" gibi belirsiz bir ifade duyarsanız üsteleyin. 12 kişilik bir online sınıfta çekingen bir çocuk 8 hafta boyunca hiç konuşmadan dersi bitirebilir ve siz bunu fark etmezsiniz.',
      },
      { type: 'h2', text: '2. Müfredatı görebilir miyim?' },
      {
        type: 'p',
        text: 'İyi cevap: "Buyurun, sitede yazıyor." Hafta hafta ne işleneceği ve hangi projenin çıkacağı kayıt öncesinde açık olmalı. Müfredatı ancak kayıttan sonra paylaşan kurumlarda genellikle standartlaşmış bir müfredat yoktur; eğitmen o hafta ne bulursa onu anlatır.',
      },
      { type: 'h2', text: '3. Eğitmen kim ve ne iş yapıyor?' },
      {
        type: 'p',
        text: 'Adını, mesleğini ve varsa profil bağlantısını isteyin. "Alanında uzman eğitmenler" cümlesi hiçbir şey söylemiyor. Çocuğunuza Unity öğretecek kişinin hiç oyun yayınlamamış olması sorunlu; yapay zeka anlatacak kişinin hiç model eğitmemiş olması daha da sorunlu.',
      },
      { type: 'h2', text: '4. Ders kaydediliyor mu, ne kadar erişebiliyorum?' },
      {
        type: 'p',
        text: 'İyi cevap: kaydediliyor ve en az bir yıl erişilebiliyor. Kayıt yoksa hastalandığı hafta o ders kayboluyor demektir. Ayrıca kayıt, sizin de dersin gerçekte nasıl geçtiğini görebilmeniz anlamına geliyor.',
      },
      { type: 'h2', text: '5. Ders kaçırırsak ne oluyor?' },
      {
        type: 'p',
        text: 'Somut bir telafi politikası olmalı: kaç hakkınız var, kaç saat önceden haber vermeniz gerekiyor. "Hallederiz" cevabı dönem ortasında "maalesef"e dönüşüyor.',
      },
      { type: 'h2', text: '6. Fiyat ne kadar? Ödeyeceğim tutar bu mu?' },
      {
        type: 'p',
        text: 'Fiyatı siteden göremiyorsanız bu bir tercih değil, bir yöntemdir. Ayrıca sertifika ücreti, materyal ücreti, platform ücreti gibi sonradan çıkan kalemleri açıkça sorun. Robotik kurslarında donanım setinin fiyata dahil olup olmadığı ciddi bir fark yaratır.',
      },
      { type: 'h2', text: '7. Memnun kalmazsam ne oluyor?' },
      {
        type: 'p',
        text: 'İyi cevap yazılı bir iade politikasıdır ve genellikle ilk birkaç dersi kapsar. Hiç iade politikası olmayan bir kurum, ürününe güvenmediğini söylüyordur. Politikanın sitede yazılı olması, sözlü vaatten çok daha değerlidir.',
      },
      { type: 'h2', text: '8. Gelişimi nasıl takip edeceğim?' },
      {
        type: 'p',
        text: 'İyi cevap: düzenli yazılı rapor ve dönem içinde en az bir görüşme. Çocuğunuzun "iyi gidiyor" dışında bir geri bildirim almadan 8 hafta geçirmesi, bir sorun varsa bunu ancak sonunda öğreneceğiniz anlamına gelir.',
      },
      { type: 'h2', text: '9. Kurs bitince elinde ne kalacak?' },
      {
        type: 'p',
        text: 'İyi cevap somuttur: yayınlanmış bir oyun, çalışan bir web sitesi, kurulmuş bir robot. "Temel bilgi sahibi olur" cevabı ölçülemez. Elinde gösterebileceği bir şey kalmayan kurs, çocuk için birkaç ay sonra hiç yaşanmamış gibi olur.',
      },
      {
        type: 'callout',
        title: 'Bonus soru',
        text: '"Bu kurstan sonra ne öneriyorsunuz?" Cevabı hazır olan kurum bir yol haritası kurmuş demektir. Cevabı olmayan kurum tek seferlik satış yapıyordur — ki bu, çocuğunuzun gelişiminin sekiz hafta sonra duracağı anlamına gelir.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'ekran-suresi-mi-uretim-suresi-mi',
    title: 'Ekran süresi mi, üretim süresi mi?',
    excerpt:
      'Ekran karşısında geçen iki saatin niteliği aynı değil. Tüketimle üretimi ayırt etmenin pratik yolu ve velinin nerede müdahale etmesi gerektiği.',
    category: 'Veli Rehberi',
    readMinutes: 5,
    published: '2026-05-20',
    author: 'Hype Academia',
    relatedCourseIds: ['scratch', 'unity'],
    body: [
      {
        type: 'p',
        text: 'Ekran süresi tartışmasının en büyük eksiği, bütün dakikaları eşit saymasıdır. Oysa video izleyerek geçen bir saatle kendi oyununu yaparak geçen bir saat aynı şey değil — ikisinin çocuğun zihnindeki karşılığı da farklı, sonunda elinde kalan da.',
      },
      { type: 'h2', text: 'Ayrımı nasıl yaparsınız?' },
      {
        type: 'p',
        text: 'Karmaşık bir ölçüye gerek yok. Tek bir soru yetiyor: bu sürenin sonunda ortada onun yaptığı bir şey var mı? Varsa üretim, yoksa tüketim. İkisi de hayatın parçası, ama oran önemli.',
      },
      {
        type: 'table',
        head: ['Tüketim', 'Üretim'],
        rows: [
          ['Oyun oynamak', 'Oyun yapmak'],
          ['Video izlemek', 'Video kurgulamak'],
          ['Hazır şablonla oynamak', 'Sıfırdan bir şey kurmak'],
          ['Sonsuz akışta gezinmek', 'Bir problemi çözmeye çalışmak'],
        ],
      },
      { type: 'h2', text: 'Neden bu ayrım önemli?' },
      {
        type: 'p',
        text: 'Tüketim sırasında çocuk pasif; içerik ona geliyor ve bittiğinde geriye bir şey kalmıyor. Üretim sırasında ise sürekli karar veriyor, hata yapıyor, düzeltiyor. Bu döngü — dene, başarısız ol, düzelt, tekrar dene — okulda nadiren bu kadar sık tekrarlanan bir öğrenme biçimi.',
      },
      {
        type: 'p',
        text: 'Ayrıca üretim doğal bir doyum noktası taşıyor. Oyun oynamanın sonu yok, ama yaptığı oyunu bitiren çocuk "tamam, oldu" diyip kalkabiliyor. Ekran başında geçen sürenin kendi kendini sınırlaması, dışarıdan konan kurallardan daha sürdürülebilir.',
      },
      { type: 'h2', text: 'Velinin yapabileceği üç şey' },
      {
        type: 'ol',
        items: [
          'Süreyi değil, oranı konuşun. "İki saat oyun" yerine "bir saat oynadın, şimdi bir şey yapalım mı" çok daha az çatışma üretiyor.',
          'Yaptığı şeyi görün ve sorun. Çocuğun ürettiği bir şeyi göstermesi, oynadığı oyunu anlatmasından çok daha fazlasını açığa çıkarır. "Bunu nasıl yaptın?" sorusu güçlü bir sorudur.',
          'Ürettiğini paylaşmasına izin verin. Yaptığı oyunu arkadaşına oynatmak, aldığı en güçlü geri bildirimdir ve devam etme motivasyonunu besler.',
        ],
      },
      {
        type: 'callout',
        title: 'Gerçekçi olalım',
        text: 'Amaç oyun oynamayı bitirmek değil. Çocuklar oyun oynar, oynamalı da. Amaç, ekranla kurulan tek ilişkinin tüketim olmaması. Haftada birkaç saatlik üretim, dengeyi değiştirmek için yeterli.',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'cocugunuz-icin-bilgisayar-secimi',
    title: 'Kodlama öğrenen çocuk için bilgisayar seçimi',
    excerpt:
      'Tablet neden yetmiyor, hangi kurs ne kadar güç istiyor ve gereksiz yere para harcamamak için nelere bakmalı — sade bir alım rehberi.',
    category: 'Teknik',
    readMinutes: 6,
    published: '2026-06-30',
    author: 'Hype Academia',
    relatedCourseIds: ['scratch', 'python', 'unity'],
    body: [
      {
        type: 'p',
        text: 'Kayıt öncesi en çok gelen teknik soru bu. Kısa cevap: çoğu kurs için elinizdeki bilgisayar muhtemelen yeterli. Uzun cevap kursa göre değişiyor, o yüzden aşağıda ayırdık.',
      },
      { type: 'h2', text: 'Önce şunu netleştirelim: tablet olmaz' },
      {
        type: 'p',
        text: 'Tablet, Scratch dışındaki hiçbir kurs için uygun değil. Sebep sadece klavye de değil: kod yazmak için gerçek bir dosya sistemi, program kurabilme yetkisi ve aynı anda birkaç pencereyi yan yana görebilmek gerekiyor. Scratch’te bile sürükle-bırak dokunmatik ekranda belirgin şekilde zorlaşıyor. Elinizde sadece tablet varsa, ikinci el bir dizüstü bilgisayar tabletten daha iyi bir yatırım.',
      },
      { type: 'h2', text: 'Kursa göre gerçek gereksinim' },
      {
        type: 'table',
        head: ['Kurs', 'Gereken', 'Not'],
        rows: [
          ['Scratch', 'Tarayıcı açan her bilgisayar', 'Kurulum yok, tarayıcıda çalışır'],
          ['Python', '4 GB RAM, herhangi bir işlemci', '10 yaşındaki bilgisayar bile yeter'],
          ['Web Geliştirme', '8 GB RAM önerilir', 'Tarayıcı + editör aynı anda açık kalır'],
          ['Arduino & Robotik', 'Boş bir USB portu', 'Donanım seti bizden gelir'],
          ['Yapay Zeka', 'Tarayıcı yeterli', 'Modeller Google sunucusunda eğitilir'],
          ['Unity', '8 GB RAM + ayrı ekran kartı', 'Tek zorlayıcı kurs budur'],
        ],
      },
      {
        type: 'callout',
        title: 'Dikkat',
        text: 'Yapay zeka kursu için güçlü bilgisayar gerektiğini düşünen çok veli oluyor. Gerekmiyor. Model eğitimi Google Colab üzerinde, Google’ın sunucularında yapılıyor; sizin bilgisayarınızın tek işi tarayıcı açmak.',
      },
      { type: 'h2', text: 'Yeni alacaksanız nelere bakın' },
      {
        type: 'ul',
        items: [
          'RAM: 8 GB alın. En çok fark yaratan tek özellik budur ve sonradan yükseltmek çoğu dizüstünde mümkün değil.',
          'Disk: SSD olsun, boyutu ikinci planda. 256 GB SSD, 1 TB klasik diskten çok daha iyi bir deneyim verir.',
          'Ekran: 14 inç ve üzeri. Kod yazarken küçük ekran gerçekten yoruyor.',
          'Klavye: Türkçe düzen ve fiziksel bir klavye. Kodlamada noktalama işaretleri sürekli kullanılıyor.',
          'Kamera ve mikrofon: Canlı derste eğitmenin öğrenciyi görmesi ders kalitesini doğrudan etkiliyor.',
        ],
      },
      { type: 'h2', text: 'Gerek olmayan şeyler' },
      {
        type: 'ul',
        items: [
          'Oyuncu bilgisayarı — Unity dışında hiçbir kursta gerekmiyor',
          'En yeni nesil işlemci — iki üç yıl önceki modeller fazlasıyla yeterli',
          'Dokunmatik ekran — kodlamada hiç kullanılmıyor',
          'Pahalı yazılım lisansı — kullandığımız araçların tamamı ücretsiz',
        ],
      },
      { type: 'h2', text: 'Bütçe kısıtlıysa' },
      {
        type: 'p',
        text: 'Kurumsal ikinci el dizüstü bilgisayarlar bu iş için çok iyi bir seçenek. 8 GB RAM’li, SSD’li birkaç yaşında bir iş bilgisayarı, aynı paraya alınacak yeni bir giriş seviyesi makineden daha hızlıdır. Scratch, Python ve Yapay Zeka kurslarının tamamı böyle bir makinede sorunsuz çalışır.',
      },
      {
        type: 'p',
        text: 'Emin değilseniz kayıt öncesinde bilgisayarınızın özelliklerini bize iletin; uygunluk kontrolünü ücretsiz yapıyor ve gerekirse hangi kursun sorun çıkarabileceğini önceden söylüyoruz.',
      },
    ],
  },
];

// ─── Yardımcılar ─────────────────────────────────────────────────────────────

/** Yeniden eskiye sıralı yazılar. */
export const ARTICLES_BY_DATE = [...ARTICLES].sort((a, b) =>
  b.published.localeCompare(a.published),
);

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export const ARTICLE_CATEGORIES = [
  'Yol Haritası',
  'Karar Rehberi',
  'Veli Rehberi',
  'Teknik',
] as const;

/** "2026-02-18" → "18 Şubat 2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
