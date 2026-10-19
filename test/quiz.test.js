import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, DOMAINS } from '../public/questions.js';
import { buildExam, isCorrect, score, rng, fmtTime } from '../public/quiz.js';

test('question bank is well formed', () => {
  const ids = new Set();
  for (const q of QUESTIONS) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`); ids.add(q.id);
    assert.ok(DOMAINS[q.d], `unknown domain ${q.d}`);
    assert.ok(q.q && q.x && q.c.length >= 2);
    for (const a of [].concat(q.a)) assert.ok(a >= 0 && a < q.c.length, `answer out of range in ${q.id}`);
    if (Array.isArray(q.a)) assert.match(q.q, /choose two/i);
  }
  for (const d of Object.keys(DOMAINS)) assert.ok(QUESTIONS.some((q) => q.d === d), `no questions for ${d}`);
});

test('buildExam is balanced, unique and reproducible from a seed', () => {
  const a = buildExam(QUESTIONS, 28, rng(42));
  const b = buildExam(QUESTIONS, 28, rng(42));
  assert.equal(a.length, 28);
  assert.deepEqual(a.map((q) => q.id), b.map((q) => q.id));
  assert.equal(new Set(a.map((q) => q.id)).size, 28);
  const counts = Object.values(Object.groupBy(a, (q) => q.d)).map((g) => g.length);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, 'domains should be balanced');
  assert.equal(buildExam(QUESTIONS, 999).length, QUESTIONS.length);
});

test('isCorrect handles single and multi answers', () => {
  const single = { a: 1 }, multi = { a: [0, 2] };
  assert.ok(isCorrect(single, 1));
  assert.ok(!isCorrect(single, 0));
  assert.ok(!isCorrect(single, undefined));
  assert.ok(isCorrect(multi, [2, 0]));
  assert.ok(!isCorrect(multi, [0]));
  assert.ok(!isCorrect(multi, [0, 1, 2]));
});

test('score totals, domains and pass mark', () => {
  const qs = [{ d: 'x', a: 0 }, { d: 'x', a: 1 }, { d: 'y', a: [0, 1] }, { d: 'y', a: 2 }];
  const r = score(qs, [0, 0, [1, 0], 2]);
  assert.equal(r.correct, 3);
  assert.equal(r.scaled, 750);
  assert.ok(r.pass);
  assert.deepEqual(r.byDomain.x, { correct: 1, total: 2 });
  assert.ok(!score(qs, []).pass);
});

test('fmtTime', () => {
  assert.equal(fmtTime(0), '00:00');
  assert.equal(fmtTime(65.7), '01:05');
  assert.equal(fmtTime(-3), '00:00');
});
