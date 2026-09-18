import assert from "node:assert/strict";
import {
  classifyPace,
  computeStats,
  createProgress,
  dequeueWrong,
  EXAM_AVERAGE_SEC,
  isDue,
  pickNextQuestion,
  queueWrong,
  updateProgress,
  WRONG_REINSERT_GAP,
} from "../src/lib/kpss/srs.ts";
import {
  EMPTY_SESSION,
  nextSession,
  todayKey,
} from "../src/lib/kpss/session.ts";
import { SUBJECT_META, SUBJECTS } from "../src/lib/kpss/types.ts";
import type { Question } from "../src/lib/kpss/types.ts";

const DAY = 86_400_000;

// --- Ders hedef süreleri sınavın süre bütçesiyle tutarlı olmalı -------------
// 130 dakika = 7800 saniye. Ders hedefleri soru sayılarıyla ağırlıklandığında
// bu bütçeyi aşmamalı, yoksa "hedef süre" sınavda karşılığı olmayan bir sayıya
// dönüşür.
const budget = SUBJECTS.reduce((total, subject) => {
  const meta = SUBJECT_META[subject];
  return total + meta.examQuestions * meta.targetTimeSec;
}, 0);
const examQuestionCount = SUBJECTS.reduce(
  (total, s) => total + SUBJECT_META[s].examQuestions,
  0,
);

assert.equal(examQuestionCount, 120, "sınav 120 sorudan oluşur");
assert.ok(
  budget <= 7800,
  `ders hedef süreleri 130 dakikayı aşıyor (${budget} sn)`,
);
assert.ok(
  budget >= 7500,
  `ders hedef süreleri sınav süresini kullanmıyor (${budget} sn)`,
);
assert.equal(
  Math.round(budget / examQuestionCount),
  EXAM_AVERAGE_SEC,
  "ağırlıklı ortalama sınavın soru başına ortalamasını vermeli",
);

// --- Hız sınıflaması ders hedefine göre, sabit 65 saniyeye göre değil ------
assert.equal(classifyPace(5_000, 30), "fast", "hedefin çok altı hızlı");
assert.equal(classifyPace(25_000, 30), "normal", "hedefin altı normal");
assert.equal(classifyPace(45_000, 30), "slow", "hedefin üstü yavaş");
// Aynı 45 saniye, matematikte (hedef 100 sn) yavaş değil:
assert.equal(
  classifyPace(45_000, 100),
  "fast",
  "matematikte 45 saniye yavaş sayılmamalı",
);
assert.equal(classifyPace(90_000, 100), "normal");
assert.equal(classifyPace(120_000, 100), "slow");

// --- Bilgi ve hız ayrı sinyaller ------------------------------------------
const fresh = createProgress("q1");
assert.equal(fresh.box, 1);
assert.equal(fresh.speedFlag, false);
assert.ok(isDue(fresh), "hiç görülmemiş soru hemen gösterilmeli");

const slowCorrect = updateProgress(fresh, true, "slow");
assert.equal(slowCorrect.box, 2, "doğru cevap yavaş olsa da kutuyu yükseltir");
assert.equal(slowCorrect.speedFlag, true, "yavaş doğru hız bayrağı koyar");
assert.equal(slowCorrect.slowCount, 1);
assert.ok(!isDue(slowCorrect), "yavaş doğru aynı oturumda geri gelmez");

const fastCorrect = updateProgress(fresh, true, "fast");
assert.equal(fastCorrect.box, 2, "hız kutuyu değiştirmez, doğruluk belirler");
assert.equal(fastCorrect.speedFlag, false);
assert.ok(
  slowCorrect.nextReview <= fastCorrect.nextReview,
  "yavaş doğru en az aynı kadar erken gelmeli",
);

// Üst kutularda yavaşlık aralığı gerçekten kısaltır.
let climbed = fresh;
for (let i = 0; i < 3; i++) climbed = updateProgress(climbed, true, "fast");
assert.equal(climbed.box, 4);
const fastAtFour = updateProgress(climbed, true, "fast");
const slowAtFour = updateProgress(climbed, true, "slow");
assert.equal(fastAtFour.box, slowAtFour.box, "ikisi de kutuyu yükseltir");
assert.ok(
  slowAtFour.nextReview < fastAtFour.nextReview - DAY,
  "yavaş doğru belirgin şekilde daha erken tekrar gelmeli",
);

// Hız sorunu düzelince bayrak kalkar.
assert.equal(
  updateProgress(slowCorrect, true, "normal").speedFlag,
  false,
  "normal hızda doğru cevap hız bayrağını kaldırır",
);

// Yanlış cevap kutuyu tabana indirir, hızdan bağımsız.
const wrongFast = updateProgress(climbed, false, "fast");
assert.equal(wrongFast.box, 1, "yanlış cevap hızlı da olsa tabana iner");
assert.ok(isDue(wrongFast), "yanlış yapılan soru tekrar kuyruğuna girer");

let top = fresh;
for (let i = 0; i < 10; i++) top = updateProgress(top, true, "fast");
assert.equal(top.box, 5, "kutu 5'in üstüne çıkılmaz");
assert.equal(top.timesSeen, 10);

// --- Yanlış soru hemen bir sonraki soru olmamalı ---------------------------
const makeQuestion = (id: string): Question => ({
  id,
  level: "ortaogretim",
  section: "gk",
  subject: "tarih",
  topic: "osmanli-kurulus",
  question: `Soru ${id}`,
  options: ["a", "b", "c", "d", "e"],
  correct: 0,
  explanation:
    "Bu bir test sorusudur ve doğrulama için yeterli uzunlukta bir çözüm metni içerir.",
  source: "test",
  copyrightStatus: "original",
  reviewStatus: "approved",
});

const pool = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"].map(makeQuestion);
const progressMap = Object.fromEntries(
  pool.map((q) => [q.id, createProgress(q.id)]),
);

let queue = queueWrong([], "q1", 1);
assert.equal(queue[0].readyAtAnswer, 1 + WRONG_REINSERT_GAP);

const afterWrong = pickNextQuestion(pool, progressMap, queue, 1);
assert.ok(afterWrong, "sıradaki soru bulunmalı");
assert.notEqual(
  afterWrong.id,
  "q1",
  "yanlış yapılan soru hemen bir sonraki soru olmamalı",
);

const whenDue = pickNextQuestion(pool, progressMap, queue, 1 + WRONG_REINSERT_GAP);
assert.equal(
  whenDue?.id,
  "q1",
  "bekleme süresi dolunca yanlış soru geri gelmeli",
);

// Havuz tek soruya inerse tıkanmak yerine o soruyu göstermeli.
const single = [makeQuestion("solo")];
const soloQueue = queueWrong([], "solo", 1);
assert.equal(
  pickNextQuestion(single, { solo: createProgress("solo") }, soloQueue, 1)?.id,
  "solo",
  "başka soru yoksa beklemedeki soru gösterilir",
);

// Doğru cevaplanınca kuyruktan çıkar.
queue = dequeueWrong(queue, "q1");
assert.equal(queue.length, 0, "doğru cevap yanlış kuyruğundan çıkarır");

// --- İstatistikler hız bayrağını saymalı ----------------------------------
const statsMap = {
  q1: updateProgress(createProgress("q1"), true, "slow"),
  q2: updateProgress(createProgress("q2"), true, "fast"),
};
const stats = computeStats(pool, statsMap);
assert.equal(stats.seen, 2);
assert.equal(stats.slow, 1, "bildiği ama yavaş cevapladığı soru sayılmalı");
assert.equal(stats.unseen, pool.length - 2);

// --- Seri: aynı gün artmaz, ertesi gün artar, gün atlanırsa sıfırlanır ----
const day1 = nextSession(EMPTY_SESSION, "q1", 0, "2026-09-17");
assert.equal(day1.streak, 1);
assert.equal(day1.todayCount, 1);

const day1Again = nextSession(day1, "q2", 0, "2026-09-17");
assert.equal(day1Again.streak, 1, "aynı gün seri artmaz");
assert.equal(day1Again.todayCount, 2);
assert.equal(day1Again.totalAnswered, 2);

const day2 = nextSession(day1Again, "q3", 3, "2026-09-18");
assert.equal(day2.streak, 2, "ertesi gün seri artar");
assert.equal(day2.todayCount, 1, "günlük sayaç sıfırlanır");
assert.equal(day2.dueCount, 3);

assert.equal(
  nextSession(day2, "q4", 0, "2026-09-25").streak,
  1,
  "gün atlanınca seri sıfırlanır",
);

assert.equal(todayKey(new Date(2026, 0, 5)), "2026-01-05");
assert.equal(todayKey(new Date(2026, 11, 31)), "2026-12-31");

console.log("ok — srs (bilgi/hız ayrı) + yanlış aralığı + session");
