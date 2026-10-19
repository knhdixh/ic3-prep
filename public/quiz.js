// Pure quiz logic, shared by the browser and the tests.

export const isMulti = (q) => Array.isArray(q.a);

// Seeded PRNG so a mock can be rebuilt from its seed.
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(arr, rand = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick n questions spread evenly over domains (round-robin), then shuffle the order.
export function buildExam(bank, n, rand = Math.random) {
  const byDomain = {};
  for (const q of shuffle(bank, rand)) (byDomain[q.d] ||= []).push(q);
  const pools = Object.values(byDomain);
  const out = [];
  while (out.length < Math.min(n, bank.length)) {
    for (const p of pools) if (p.length && out.length < n) out.push(p.shift());
  }
  return shuffle(out, rand);
}

// answer: a number (single) or an array of numbers (multi). Multi needs an exact match.
export function isCorrect(q, answer) {
  if (answer == null) return false;
  if (!isMulti(q)) return answer === q.a;
  if (!Array.isArray(answer)) return false;
  const want = [...q.a].sort(), got = [...answer].sort();
  return want.length === got.length && want.every((v, i) => v === got[i]);
}

export function score(questions, answers) {
  const byDomain = {};
  let correct = 0;
  questions.forEach((q, i) => {
    const ok = isCorrect(q, answers[i]);
    const d = (byDomain[q.d] ||= { correct: 0, total: 0 });
    d.total++;
    if (ok) { d.correct++; correct++; }
  });
  const total = questions.length;
  // Certiport reports a scaled score out of 1000; this is a simple linear stand-in.
  const scaled = total ? Math.round((correct / total) * 1000) : 0;
  return { correct, total, pct: total ? Math.round((correct / total) * 100) : 0, scaled, pass: scaled >= 700, byDomain };
}

export const fmtTime = (sec) => {
  sec = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
};
