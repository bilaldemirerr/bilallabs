/** Şimdilik yalnızca ortaöğretim yayında; alan şemada duruyor ki havuz büyürken ayrışsın. */
export type Level = "ortaogretim";

export type Subject =
  | "turkce"
  | "matematik"
  | "tarih"
  | "cografya"
  | "vatandaslik"
  | "guncel";

export type Section = "gy" | "gk";

/** Bilgi sinyalinden ayrı tutulur: doğru ama yavaş cevap bilgiyi düşürmez. */
export type Pace = "fast" | "normal" | "slow";

export type ReviewStatus = "draft" | "review" | "approved";

export type CopyrightStatus = "unknown" | "cleared" | "original" | "blocked";

export type Difficulty = "easy" | "medium" | "hard";

export type OptionIndex = 0 | 1 | 2 | 3 | 4;

/** Resmi kitapçıktan kırpılmış şekil, formül veya tablo görseli. */
export type QuestionFigure = {
  /** public/ altından kök yol, örn. /osym/2022/q31-formula.png */
  src: string;
  alt: string;
};

export type Question = {
  id: string;
  level: Level;
  section: Section;
  subject: Subject;
  topic: string;
  question: string;
  /** Metin çıkarımında kaybolan formül, şekil veya tablo. */
  figure?: QuestionFigure;
  options: [string, string, string, string, string];
  correct: OptionIndex;
  /** Zorunlu: çözümü olmayan soru ne öğretir ne de aramada karşılık bulur. */
  explanation: string;
  /** Çeldiricilerin neden yanlış olduğu; sayfayı cevap listesinden öğrenme birimine çevirir. */
  distractors?: Partial<Record<OptionIndex, string>>;
  /** "Bilmen gereken bilgi" — 2-4 cümlelik mini konu özeti. */
  keyFact?: string;
  source: string;
  sourceYear?: number;
  /** Sınav kitapçığındaki soru numarası (ör. 44). */
  sourceExamNo?: number;
  copyrightStatus: CopyrightStatus;
  difficulty?: Difficulty;
  /** Sorunun kendi hedef süresi; yoksa dersin hedefi kullanılır. */
  targetTimeSec?: number;
  reviewStatus: ReviewStatus;
  reviewedAt?: string;
};

export const PROGRESS_SCHEMA_VERSION = 2;

export type QuestionProgress = {
  questionId: string;
  version: number;
  /** Yalnızca doğruluktan beslenir. */
  box: number;
  lastReviewed: number;
  nextReview: number;
  timesSeen: number;
  /** Kaç kez doğru ama hedef sürenin üstünde cevaplandı. */
  slowCount: number;
  /** Son doğru cevap yavaştı: biliyor ama sınav temposunda değil. */
  speedFlag: boolean;
  lastCorrect?: boolean;
  lastPace?: Pace;
};

export const SECTION_LABELS: Record<Section, string> = {
  gy: "Genel Yetenek",
  gk: "Genel Kültür",
};

type SubjectMeta = {
  label: string;
  section: Section;
  /** 2026 KPSS Ortaöğretim'de bu dersten çıkan soru sayısı (120 soruluk oturum) */
  examQuestions: number;
  /** Sınavda bu derse ayırman gereken saniye; ders hedef süreleri buradan türetildi. */
  targetTimeSec: number;
  topics: string;
};

export const SUBJECT_META: Record<Subject, SubjectMeta> = {
  turkce: {
    label: "Türkçe",
    section: "gy",
    examQuestions: 30,
    targetTimeSec: 90,
    topics:
      "Sözcükte ve cümlede anlam, paragraf, dil bilgisi, ses ve yazım bilgisi, noktalama, anlatım bozukluğu. Paragraf soruları bu bölümün en kalabalık ve en çok zaman isteyen grubudur.",
  },
  matematik: {
    label: "Matematik",
    section: "gy",
    examQuestions: 30,
    targetTimeSec: 100,
    topics:
      "Temel kavramlar, sayılar, rasyonel sayılar, üslü ve köklü ifadeler, denklemler, oran orantı, problemler, kümeler, olasılık, tablo ve grafik yorumlama. Geometri soruları da bu bölümün içindedir.",
  },
  tarih: {
    label: "Tarih",
    section: "gk",
    examQuestions: 27,
    targetTimeSec: 35,
    topics:
      "İslamiyet öncesi Türk tarihi, ilk Türk-İslam devletleri, Osmanlı siyasi ve kültür tarihi, Kurtuluş Savaşı, Türk inkılabı, Atatürk ilkeleri, çağdaş Türk ve dünya tarihi. Genel Kültür'ün en ağırlıklı dersidir.",
  },
  cografya: {
    label: "Coğrafya",
    section: "gk",
    examQuestions: 18,
    targetTimeSec: 40,
    topics:
      "Türkiye'nin fiziki özellikleri (yer şekilleri, iklim), beşerî özellikleri ve ekonomik özellikleri. Tarım, sanayi, madenler, ulaşım ve turizm başlıkları da belirleyicidir.",
  },
  vatandaslik: {
    label: "Vatandaşlık",
    section: "gk",
    examQuestions: 9,
    targetTimeSec: 30,
    topics:
      "Hukuk başlangıcı ve genel kamu hukuku, anayasa ve insan hakları hukuku, idare hukuku. Konu hacmi küçük olduğu için kısa sürede net kazandırma potansiyeli en yüksek derstir.",
  },
  guncel: {
    label: "Güncel Bilgiler",
    section: "gk",
    examQuestions: 6,
    targetTimeSec: 25,
    topics:
      "Türkiye ve dünyaya ilişkin genel, kültürel ve güncel sosyoekonomik gelişmeler; uluslararası kuruluşlar, ödüller, başkentler, ekonomi ve kültür sanat gündemi.",
  },
};

export const SUBJECTS = Object.keys(SUBJECT_META) as Subject[];

export const SUBJECT_LABELS = Object.fromEntries(
  SUBJECTS.map((s) => [s, SUBJECT_META[s].label]),
) as Record<Subject, string>;

export function isSubject(value: string): value is Subject {
  return value in SUBJECT_META;
}

/**
 * İçerik girişi için kontrollü konu sözlüğü. Serbest metin yerine sabit liste,
 * hem konu sayfalarının üretilebilmesi hem de yazım farklarının havuzu
 * bölmemesi için gerekli.
 */
export const TOPICS: Record<Subject, Record<string, string>> = {
  turkce: {
    "sozcukte-anlam": "Sözcükte anlam",
    "cumlede-anlam": "Cümlede anlam",
    paragraf: "Paragraf",
    "dil-bilgisi": "Dil bilgisi",
    "yazim-noktalama": "Yazım ve noktalama",
    "anlatim-bozuklugu": "Anlatım bozukluğu",
  },
  matematik: {
    "temel-kavramlar": "Temel kavramlar",
    sayilar: "Sayılar",
    "uslu-koklu": "Üslü ve köklü ifadeler",
    denklemler: "Denklemler",
    "oran-oranti": "Oran ve orantı",
    problemler: "Problemler",
    "kumeler-olasilik": "Kümeler ve olasılık",
    "tablo-grafik": "Tablo ve grafik yorumlama",
    geometri: "Geometri",
  },
  tarih: {
    "ilk-turk-devletleri": "İlk Türk devletleri",
    "turk-islam-devletleri": "Türk-İslam devletleri",
    "osmanli-kurulus": "Osmanlı kuruluş dönemi",
    "osmanli-yukselme": "Osmanlı yükselme dönemi",
    "osmanli-duraklama": "Osmanlı duraklama ve gerileme",
    "osmanli-cokus": "Osmanlı çöküş dönemi",
    "kurtulus-savasi": "Kurtuluş Savaşı",
    "inkilap-ve-ilkeler": "Türk inkılabı ve Atatürk ilkeleri",
    "cagdas-turk-dunya": "Çağdaş Türk ve dünya tarihi",
  },
  cografya: {
    "turkiye-fiziki": "Türkiye'nin fiziki özellikleri",
    "turkiye-beseri": "Türkiye'nin beşerî özellikleri",
    "turkiye-ekonomik": "Türkiye'nin ekonomik özellikleri",
  },
  vatandaslik: {
    "hukuk-baslangici": "Hukuk başlangıcı",
    anayasa: "Anayasa ve insan hakları",
    idare: "İdare hukuku",
  },
  guncel: {
    "turkiye-gundem": "Türkiye gündemi",
    "dunya-gundem": "Dünya gündemi",
    "uluslararasi-kuruluslar": "Uluslararası kuruluşlar",
  },
};

export function topicLabel(subject: Subject, topic: string): string | undefined {
  return TOPICS[subject][topic];
}
