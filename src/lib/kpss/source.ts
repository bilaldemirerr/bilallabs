import type { Question } from "./types";

/** ÖSYM ortaöğretim KPSS sınav kataloğu — yalnızca resmi %10 örnek kitapçıkları. */
export const OSYM_ORTAOGRETIM_EXAMS: Record<
  number,
  {
    label: string;
    examDate: string;
    officialPage: string;
    samplePdf: string;
  }
> = {
  2010: {
    label: "ÖSYM Ortaöğretim KPSS 2010",
    examDate: "2010-11-28",
    officialPage:
      "https://www.osym.gov.tr/2010kpss-ortaogretim-onlisans-sorular-ve-yanitlar",
    samplePdf:
      "http://dokuman.osym.gov.tr/pdfdokuman/2010/KPSS/OrtOgrOnLisans/kpss2_ortaogrtm_sorular.pdf",
  },
  2012: {
    label: "ÖSYM Ortaöğretim KPSS 2012",
    examDate: "2012-09-23",
    officialPage:
      "https://www.osym.gov.tr/2012kpss-ortaogretim-temel-soru-kitapcigi-ve-cevap-anahtari",
    samplePdf:
      "http://dokuman.osym.gov.tr/web/eskidosyalar/1695.pdf",
  },
  2014: {
    label: "ÖSYM Ortaöğretim KPSS 2014",
    examDate: "2014-09-28",
    officialPage:
      "https://www.osym.gov.tr/2014kpss-ortaogretimon-lisans-sinavlarina-ait-soru-kitapciklari-ve-cevap-anahtarlari-10",
    samplePdf:
      "http://dokuman.osym.gov.tr/pdfdokuman/2014/KPSS/ort-onlisans/KPSS2-ORTAOGRETIM17102014.pdf",
  },
  2016: {
    label: "ÖSYM Ortaöğretim KPSS 2016",
    examDate: "2016-11-20",
    officialPage:
      "https://www.osym.gov.tr/2016kpss-ortaogretim-duzeyi-temel-soru-kitapcigi-ve-cevap-anahtari",
    samplePdf:
      "http://dokuman.osym.gov.tr/pdfdokuman/2016/KPSSORTON/2016KPSSOrtaogretimDuzeyiTemel20112016.pdf",
  },
  2018: {
    label: "ÖSYM Ortaöğretim KPSS 2018",
    examDate: "2018-10-07",
    officialPage:
      "https://www.osym.gov.tr/2018kpss-ortaogretim-temel-soru-kitapcigi-ve-cevap-anahtari-yayimlandi",
    samplePdf:
      "https://dokuman.osym.gov.tr/pdfdokuman/2018/KPSSORTOGR/TemelSoruKitapcik09102018.pdf",
  },
  2020: {
    label: "ÖSYM Ortaöğretim KPSS 2020",
    examDate: "2020-11-22",
    officialPage:
      "https://www.osym.gov.tr/2020kpss-ortaogretim-temel-soru-kitapcigi-ve-cevap-anahtari-10",
    samplePdf:
      "https://dokuman.osym.gov.tr/pdfdokuman/2020/KPSS/ORTAOGRET%C4%B0M/temelsorukitapcik_23112020.pdf",
  },
  2024: {
    label: "ÖSYM Ortaöğretim KPSS 2024",
    examDate: "2024-09-15",
    officialPage:
      "https://www.osym.gov.tr/2024kpss-ortaogretim-temel-soru-kitapcigi-ve-cevap-anahtari-10",
    samplePdf:
      "https://dokuman.osym.gov.tr/pdfdokuman/2024/KPSS/ORTAOGRETIM/tsk15092024.pdf",
  },
  2022: {
    label: "ÖSYM Ortaöğretim KPSS 2022",
    examDate: "2022-11-06",
    officialPage:
      "https://www.osym.gov.tr/2022kpss-ortaogretim-temel-soru-kitapcigi-ve-cevap-anahtari-10",
    samplePdf:
      "https://dokuman.osym.gov.tr/pdfdokuman/2022/KPSS/ORTAOGRETIM/tsk06112022.pdf",
  },
};

export function formatQuestionSource(
  question: Pick<Question, "source" | "sourceYear"> & {
    sourceExamNo?: number;
  },
): string | null {
  if (
    question.source === "osym-ortaogretim-kpss" &&
    question.sourceYear
  ) {
    const exam = OSYM_ORTAOGRETIM_EXAMS[question.sourceYear];
    const base = exam?.label ?? `ÖSYM Ortaöğretim KPSS ${question.sourceYear}`;
    if (question.sourceExamNo) {
      return `${base} · Soru ${question.sourceExamNo}`;
    }
    return base;
  }

  if (question.sourceYear) {
    return `${question.source} (${question.sourceYear})`;
  }

  return question.source || null;
}

export function getQuestionSourceUrl(
  question: Pick<Question, "source" | "sourceYear">,
): string | undefined {
  if (
    question.source === "osym-ortaogretim-kpss" &&
    question.sourceYear
  ) {
    return OSYM_ORTAOGRETIM_EXAMS[question.sourceYear]?.officialPage;
  }
  return undefined;
}
