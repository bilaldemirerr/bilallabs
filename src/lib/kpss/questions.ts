import type { Question } from "./types";

/**
 * Demo içerik. Gerçek sorular bu şemaya uygun şekilde eklenecek; şu aşamada
 * hepsi özgün yazıldığı için copyrightStatus "original".
 *
 * Yayın kuralı: yalnızca reviewStatus "approved" ve copyrightStatus
 * "blocked"/"unknown" olmayan sorular sayfa üretir ve çalışmaya girer.
 */
export const ALL_QUESTIONS: Question[] = [
  {
    id: "demo-tr-1",
    level: "ortaogretim",
    section: "gy",
    subject: "turkce",
    topic: "yazim-noktalama",
    question:
      "Aşağıdaki cümlelerin hangisinde 'de' bağlacı yanlış yazılmıştır?",
    options: [
      "Sen de gelmek ister misin?",
      "Evde kimse yoktu.",
      "Kitabı masada bıraktım.",
      "O da bizimle gelecek.",
      "Bahçede çiçekler açmıştı.",
    ],
    correct: 2,
    explanation:
      "Cümlede yazım hatası yok gibi görünse de soru 'de' bağlacının ayrı yazıldığı durumları ölçüyor. 'Masada' sözcüğündeki -da bulunma hâli ekidir ve bitişik yazılır; bağlaç olan 'de' ise ayrı yazılır.",
    distractors: {
      0: "'Sen de' burada bağlaçtır, ayrı yazılması doğrudur.",
      1: "'Evde' bulunma hâli ekiyle bitişik, doğru yazılmış.",
      3: "'O da' bağlaç olduğu için ayrı, doğru yazılmış.",
      4: "'Bahçede' bulunma hâli ekiyle bitişik, doğru yazılmış.",
    },
    keyFact:
      "Bağlaç olan 'de/da' ayrı yazılır ve cümleden çıkarıldığında anlam bozulmaz. Bulunma hâli eki olan -de/-da ise bitişik yazılır ve çıkarıldığında cümle anlamsız kalır. Ayırt etmek için sözcüğü cümleden çıkarmayı deneyin.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "medium",
    reviewStatus: "approved",
  },
  {
    id: "demo-tr-2",
    level: "ortaogretim",
    section: "gy",
    subject: "turkce",
    topic: "paragraf",
    question:
      "Okuma alışkanlığı, bireyin dünyasını genişletir; kendi yaşamadığı deneyimleri anlamasına, farklı bakış açılarıyla karşılaşmasına imkân verir. Bu yönüyle okumak yalnızca bilgi edinmek değil, kişinin kendisini inşa etmesidir.\n\nBu parçada asıl anlatılmak istenen düşünce aşağıdakilerden hangisidir?",
    options: [
      "Kitap fiyatları arttığı için okuma oranı düşmektedir.",
      "Okuma, kişisel gelişimi destekler.",
      "Kütüphaneler giderek işlevini yitirmektedir.",
      "E-kitaplar basılı kitapların yerini almıştır.",
      "Yazarlar emeklerinin karşılığını alamamaktadır.",
    ],
    correct: 1,
    explanation:
      "Parçada okumanın bilgi edinmenin ötesinde kişinin kendisini inşa etmesine katkı sağladığı söyleniyor. Bu da okumanın kişisel gelişimi desteklediği anlamına gelir.",
    distractors: {
      0: "Parçada fiyat ya da okuma oranı hiç geçmiyor.",
      2: "Kütüphanelerden söz edilmiyor.",
      3: "Basılı kitap ile e-kitap karşılaştırması yapılmıyor.",
      4: "Yazarların kazancı parçanın konusu değil.",
    },
    keyFact:
      "Paragraf sorularında 'asıl anlatılmak istenen' sorulduğunda cevap, parçanın tamamını kapsayan yargıdır. Parçada geçmeyen bir bilgiyi içeren şık, doğru bilgi olsa bile yanlıştır.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "medium",
    reviewStatus: "approved",
  },
  {
    id: "demo-mat-1",
    level: "ortaogretim",
    section: "gy",
    subject: "matematik",
    topic: "denklemler",
    question: "Bir sayının 3 katının 5 eksiği 22 ise bu sayı kaçtır?",
    options: ["7", "8", "9", "10", "11"],
    correct: 2,
    explanation:
      "Sayıya x dersek 3x - 5 = 22 olur. İki tarafa 5 eklenince 3x = 27, buradan x = 9 bulunur.",
    keyFact:
      "Sözel ifadeleri denkleme çevirirken 'katı' çarpma, 'eksiği' çıkarma, 'ise' eşittir anlamına gelir. İşlem sırasını cümledeki sıraya göre kurmak hatayı azaltır.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-mat-2",
    level: "ortaogretim",
    section: "gy",
    subject: "matematik",
    topic: "geometri",
    question:
      "Uzun kenarı 12 cm, kısa kenarı 5 cm olan dikdörtgenin alanı kaç cm²'dir?",
    options: ["17", "34", "50", "60", "72"],
    correct: 3,
    explanation:
      "Dikdörtgenin alanı uzun kenar ile kısa kenarın çarpımıdır: 12 × 5 = 60 cm².",
    distractors: {
      0: "17, iki kenarın toplamı.",
      1: "34, dikdörtgenin çevresi.",
    },
    keyFact:
      "Dikdörtgende alan a × b, çevre 2(a + b) formülüyle bulunur. Sorunun alan mı çevre mi istediğini ayırt etmek, en sık yapılan hatayı önler.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-tar-1",
    level: "ortaogretim",
    section: "gk",
    subject: "tarih",
    topic: "osmanli-kurulus",
    question: "Osmanlı Devleti'nin kurucusu kimdir?",
    options: [
      "Orhan Bey",
      "Osman Bey",
      "Yıldırım Bayezid",
      "Fatih Sultan Mehmet",
      "Kanuni Sultan Süleyman",
    ],
    correct: 1,
    explanation:
      "Osmanlı Devleti, Söğüt ve Domaniç çevresinde beyliğin başına geçen Osman Bey tarafından kurulmuştur. Devlet adını da ondan alır.",
    distractors: {
      0: "Orhan Bey, Osman Bey'in oğlu ve ikinci hükümdardır.",
      2: "Yıldırım Bayezid kuruluş döneminin sonlarında hüküm sürmüştür.",
      3: "Fatih Sultan Mehmet İstanbul'u fetheden padişahtır.",
      4: "Kanuni Sultan Süleyman yükselme döneminin padişahıdır.",
    },
    keyFact:
      "Osmanlı Beyliği, Anadolu Selçuklu Devleti'nin zayıflamasıyla ortaya çıkan beyliklerden biridir. Osman Bey döneminde beylikten devlete geçiş başlamış, Orhan Bey döneminde ise Bursa alınıp başkent yapılmıştır.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-tar-2",
    level: "ortaogretim",
    section: "gk",
    subject: "tarih",
    topic: "kurtulus-savasi",
    question:
      "Kurtuluş Savaşı'nda TBMM'nin açıldığı şehir aşağıdakilerden hangisidir?",
    options: ["İstanbul", "Ankara", "Sivas", "Erzurum", "Konya"],
    correct: 1,
    explanation:
      "Türkiye Büyük Millet Meclisi 23 Nisan 1920'de Ankara'da açılmıştır. Ankara'nın seçilmesinde işgal altındaki İstanbul'a uzaklığı ve Anadolu'nun merkezinde bulunması etkili olmuştur.",
    distractors: {
      0: "İstanbul işgal altındaydı ve Osmanlı Mebusan Meclisi buradaydı.",
      2: "Sivas, kongrenin toplandığı şehirdir; meclis burada açılmamıştır.",
      3: "Erzurum da kongre şehridir.",
      4: "Konya'da meclis açılmamıştır.",
    },
    keyFact:
      "Erzurum ve Sivas kongreleri Millî Mücadele'nin kararlarını belirlemiş, TBMM ise 23 Nisan 1920'de Ankara'da açılarak yeni devletin yasama organı olmuştur.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-cog-1",
    level: "ortaogretim",
    section: "gk",
    subject: "cografya",
    topic: "turkiye-fiziki",
    question:
      "Türkiye'de en fazla yağış alan bölge aşağıdakilerden hangisidir?",
    options: [
      "İç Anadolu",
      "Karadeniz",
      "Ege",
      "Güneydoğu Anadolu",
      "Marmara",
    ],
    correct: 1,
    explanation:
      "Karadeniz Bölgesi, dağların kıyıya paralel uzanması ve nemli hava kütlelerinin yükselmeye zorlanması nedeniyle Türkiye'nin en çok yağış alan bölgesidir.",
    distractors: {
      0: "İç Anadolu, etrafı dağlarla çevrili olduğu için en az yağış alan bölgelerdendir.",
      3: "Güneydoğu Anadolu'da yazlar kurak ve yağış azdır.",
    },
    keyFact:
      "Türkiye'de yağış dağılışını belirleyen temel etken dağların uzanış yönüdür. Kıyıya paralel dağlar nemli havayı yükselterek yağışı artırır, iç kesimlere geçişi ise engeller.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-cog-2",
    level: "ortaogretim",
    section: "gk",
    subject: "cografya",
    topic: "turkiye-fiziki",
    question: "Fırat Nehri hangi denize dökülür?",
    options: [
      "Karadeniz",
      "Akdeniz",
      "Ege Denizi",
      "Marmara Denizi",
      "Basra Körfezi",
    ],
    correct: 4,
    explanation:
      "Fırat, Türkiye'de doğup Suriye ve Irak üzerinden akar; Dicle ile birleşerek Şattülarap adını alır ve Basra Körfezi'ne dökülür.",
    keyFact:
      "Türkiye'nin sularını denize ulaştıran havzalar arasında Fırat-Dicle havzası ülke sınırları dışına açılan en büyüğüdür. Bu yönüyle ülke içindeki diğer akarsulardan ayrılır.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "medium",
    reviewStatus: "approved",
  },
  {
    id: "demo-vat-1",
    level: "ortaogretim",
    section: "gk",
    subject: "vatandaslik",
    topic: "anayasa",
    question:
      "Hâlen yürürlükte olan Türkiye Cumhuriyeti Anayasası hangi yılda kabul edilmiştir?",
    options: ["1921", "1923", "1961", "1982", "2001"],
    correct: 3,
    explanation:
      "Yürürlükteki anayasa 1982 yılında halk oylamasıyla kabul edilmiştir. Sonraki yıllarda birçok maddesi değiştirilmiş olsa da anayasanın kendisi 1982 Anayasası olarak adlandırılır.",
    distractors: {
      0: "1921, Teşkilât-ı Esasiye Kanunu'dur.",
      2: "1961 Anayasası 1982'de yürürlükten kalkmıştır.",
      4: "2001'de anayasa değişikliği yapıldı, yeni anayasa kabul edilmedi.",
    },
    keyFact:
      "Türkiye'nin anayasaları sırasıyla 1921, 1924, 1961 ve 1982'dir. 1982 Anayasası birçok kez değiştirildi; en kapsamlı değişiklikler 2010 ve 2017 referandumlarıyla yapıldı.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-vat-2",
    level: "ortaogretim",
    section: "gk",
    subject: "vatandaslik",
    topic: "anayasa",
    question: "Türkiye'de yasama yetkisi hangi organa aittir?",
    options: [
      "Cumhurbaşkanlığı",
      "Türkiye Büyük Millet Meclisi",
      "Anayasa Mahkemesi",
      "Danıştay",
      "Yüksek Seçim Kurulu",
    ],
    correct: 1,
    explanation:
      "Anayasaya göre yasama yetkisi Türk milleti adına Türkiye Büyük Millet Meclisi'ne aittir ve bu yetki devredilemez.",
    distractors: {
      0: "Cumhurbaşkanlığı yürütme organıdır.",
      2: "Anayasa Mahkemesi yargı organıdır ve kanunların anayasaya uygunluğunu denetler.",
      3: "Danıştay idari yargı organıdır.",
    },
    keyFact:
      "Kuvvetler ayrılığı ilkesine göre yasama TBMM'ye, yürütme Cumhurbaşkanlığına, yargı ise bağımsız mahkemelere aittir. Yasama yetkisinin devredilemezliği anayasada açıkça belirtilir.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-gun-1",
    level: "ortaogretim",
    section: "gk",
    subject: "guncel",
    topic: "uluslararasi-kuruluslar",
    question:
      "Birleşmiş Milletler'in merkezi aşağıdaki şehirlerden hangisindedir?",
    options: ["Paris", "New York", "Londra", "Cenevre", "Brüksel"],
    correct: 1,
    explanation:
      "Birleşmiş Milletler'in genel merkezi ABD'nin New York şehrindedir. Cenevre'de de büyük bir ofisi bulunur ancak merkez New York'tur.",
    distractors: {
      0: "Paris, UNESCO'nun merkezidir.",
      3: "Cenevre BM'nin Avrupa ofisine ev sahipliği yapar, merkez değildir.",
      4: "Brüksel, NATO ve Avrupa Birliği kurumlarının merkezidir.",
    },
    keyFact:
      "Sık karıştırılan merkezler: BM New York, UNESCO Paris, NATO ve AB Brüksel, Dünya Sağlık Örgütü Cenevre, Uluslararası Adalet Divanı Lahey.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
  {
    id: "demo-gun-2",
    level: "ortaogretim",
    section: "gk",
    subject: "guncel",
    topic: "uluslararasi-kuruluslar",
    question: "Avrupa Birliği'nin ortak para birimi aşağıdakilerden hangisidir?",
    options: ["Dolar", "Frank", "Euro", "Sterlin", "Kron"],
    correct: 2,
    explanation:
      "Avrupa Birliği'nin ortak para birimi Euro'dur. Birlik üyesi olan her ülke Euro kullanmaz; Euro'yu kullanan ülkeler Euro Bölgesi'ni oluşturur.",
    distractors: {
      3: "Sterlin Birleşik Krallık'ın para birimidir.",
      4: "Kron İsveç, Danimarka ve Norveç gibi ülkelerde kullanılır.",
    },
    keyFact:
      "Euro 1999'da hesap birimi, 2002'de ise nakit olarak kullanıma girdi. AB üyesi olup Euro kullanmayan ülkeler arasında İsveç, Polonya ve Danimarka bulunur.",
    source: "demo",
    copyrightStatus: "original",
    difficulty: "easy",
    reviewStatus: "approved",
  },
];

export function isPublishable(question: Question): boolean {
  return (
    question.reviewStatus === "approved" &&
    (question.copyrightStatus === "original" ||
      question.copyrightStatus === "cleared")
  );
}

/** Uygulamanın ve statik sayfaların gördüğü havuz. */
export const QUESTIONS: Question[] = ALL_QUESTIONS.filter(isPublishable);

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
