import { QUESTIONS, DOMAINS } from '/questions.js';
import { buildExam, isCorrect, isMulti, score, rng, fmtTime } from '/quiz.js';

const MOCK_SIZE = 28;
const MOCK_MINUTES = 30;
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const LETTERS = 'abcdef';
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $page = document.getElementById('page');
const byId = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad = (n) => String(n).padStart(2, '0');
const rand = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

// Browser storage is a convenience only; everything works without it.
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('ic3.' + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ic3.' + k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem('ic3.' + k); } catch {} },
};

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 3000);
}

/* ---------- motion ---------- */

function reveal() {
  $page.classList.remove('ready');
  if (reduced) { $page.classList.add('ready'); return; }
  void $page.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => $page.classList.add('ready')));
}

function displayHeading(word) {
  const chars = word.split('').map((c, i) => `<span class="mask"><span class="ch" style="--i:${i}">${esc(c)}</span></span>`).join('');
  return `<h1 class="display" aria-label="${esc(word)}"><span aria-hidden="true" id="word">${chars}</span><span class="cursor" id="cursor" aria-hidden="true"></span></h1>`;
}

function scrambleIn(word) {
  const chars = [...document.querySelectorAll('#word .ch')];
  const cursor = document.getElementById('cursor');
  if (reduced) { cursor?.classList.add('on'); return; }
  chars.forEach((ch, i) => {
    const start = 200 + i * 55, settle = start + 420 + i * 30, t0 = performance.now();
    (function frame(now) {
      const t = now - t0;
      if (t >= settle) { ch.textContent = word[i]; return; }
      if (t >= start) ch.textContent = rand();
      requestAnimationFrame(frame);
    })(t0);
  });
  setTimeout(() => cursor?.classList.add('on'), 200 + word.length * 85 + 450);
}

function decode(el) {
  const target = el.dataset.text || (el.dataset.text = el.textContent);
  if (el._raf) cancelAnimationFrame(el._raf);
  const t0 = performance.now(), dur = 380;
  (function frame(now) {
    const p = Math.min(1, (now - t0) / dur), fixed = Math.floor(p * target.length);
    let out = target.slice(0, fixed);
    for (let k = fixed; k < target.length; k++) out += /[\s-]/.test(target[k]) ? target[k] : rand();
    el.textContent = out;
    if (p < 1) el._raf = requestAnimationFrame(frame);
  })(t0);
}

function wireHover() {
  if (reduced) return;
  $page.querySelectorAll('a.row').forEach((a) => {
    const name = a.querySelector('[data-scramble]');
    if (!name) return;
    a.addEventListener('mouseenter', () => decode(name));
    a.addEventListener('focus', () => decode(name));
  });
}

/* ---------- building blocks ---------- */

const linkRow = (i, href, name, label, base) => `
  <li style="--i:${i};${base != null ? `--base:${base}ms` : ''}"><a class="row" href="${href}">
    <span class="mask"><span class="up num">${pad(i + 1)}</span></span>
    <span class="mask"><span class="up name" data-scramble>${esc(name)}</span></span>
    <span class="mask"><span class="up what"><span class="label">${esc(label)}</span><span class="arrow">→</span></span></span>
  </a></li>`;

const footer = (left = '<a href="#/">← ic3</a>') =>
  `<footer><span>${left}</span><span>knhdixh.com</span></footer>`;

function mount(html, { tool = true } = {}) {
  stopTimer();
  $page.className = tool ? 'tool' : '';
  $page.innerHTML = html;
  reveal();
  wireHover();
  scrollTo(0, 0);
}

/* ---------- home ---------- */

function home() {
  const mock = store.get('mock');
  const last = store.get('last');
  const prog = store.get('practice', {});
  const seen = Object.values(prog).reduce((n, p) => n + Object.keys(p).length, 0);
  mount(`
    ${displayHeading('ic3')}
    <div class="block">
      <div class="meta"><span>Study</span><span>03</span></div>
      <ul class="rows">
        ${linkRow(0, '#/mock', mock ? 'resume mock' : 'mock exam', mock ? fmtTime((mock.endsAt - Date.now()) / 1000) + ' left' : `${MOCK_SIZE} q · ${MOCK_MINUTES} min`)}
        ${linkRow(1, '#/practice', 'practice', `${seen}/${QUESTIONS.length} seen`)}
        ${linkRow(2, '#/prep', 'what to do', '6 steps')}
      </ul>
    </div>
    ${last ? `<div class="block fade" style="--d:1.2s"><div class="meta"><span>Last mock</span><span>${new Date(last.at).toLocaleDateString()}</span></div>
      <div class="stats"><div class="stat"><div class="big">${last.scaled}</div><div class="small">of 1000</div></div>
      <div class="stat"><div class="big">${last.correct}/${last.total}</div><div class="small">correct</div></div>
      <div class="stat"><div class="big">${last.pass ? 'pass' : 'not yet'}</div><div class="small">700 to pass</div></div></div></div>` : ''}
    ${footer('IC3 Digital Literacy')}
  `, { tool: false });
  scrambleIn('ic3');
}

/* ---------- prep ---------- */

const STEPS = [
  ['Know the exam', 'IC3 Digital Literacy (GS6) has three levels. Each covers the seven domains used here. Scores are out of 1000; check the pass mark for your level with your test centre.'],
  ['Find your gaps', 'Take one mock cold. The domain breakdown shows where to start.'],
  ['Practise by domain', 'Work through your weakest domain in practice mode. Read every explanation, including on questions you got right.'],
  ['Do it for real', 'The exam includes task-based items. Build a spreadsheet with SUM and AVERAGE, share a document as commenter-only, set an out-of-office reply, turn on 2FA.'],
  ['Use official practice', 'Certiport’s official practice tests are on GMetrix, often through your school or test centre. They match the real interface.'],
  ['Exam day', 'Run Certiport’s system check a day ahead if testing from home. Have your ID ready, use a quiet room, and pace yourself: about a minute per question.'],
];

function prep() {
  mount(`
    <h1 class="title">what to do</h1>
    <div class="meta"><span>Plan</span><span>${pad(STEPS.length)}</span></div>
    <ul class="rows">${STEPS.map(([t, p], i) => `
      <li style="--i:${i};--base:300ms"><div class="note">
        <span class="mask"><span class="up num" style="display:block">${pad(i + 1)}</span></span>
        <div class="mask" style="display:block"><div class="up" style="display:block"><span class="name">${esc(t)}</span><p>${esc(p)}</p></div></div>
      </div></li>`).join('')}
    </ul>
    <div class="actions fade" style="--d:1.1s"><a class="btn" href="#/mock" style="text-decoration:none">Start a mock</a><a class="link" href="#/practice">Practice</a></div>
    ${footer()}
  `);
}

/* ---------- practice ---------- */

function practiceIndex() {
  const prog = store.get('practice', {});
  const rows = Object.entries(DOMAINS).map(([key, name], i) => {
    const total = QUESTIONS.filter((q) => q.d === key).length;
    const p = prog[key] || {};
    const right = Object.values(p).filter(Boolean).length;
    const label = Object.keys(p).length ? `${right}/${total} right` : `${total} q`;
    return linkRow(i, `#/practice/${key}`, name, label, 300);
  });
  mount(`
    <h1 class="title">practice</h1>
    <div class="meta"><span>Domains</span><span>${pad(rows.length)}</span></div>
    <ul class="rows">${rows.join('')}</ul>
    ${Object.keys(prog).length ? `<div class="actions fade" style="--d:1.2s"><button class="link" id="reset">Reset progress</button></div>` : ''}
    ${footer()}
  `);
  document.getElementById('reset')?.addEventListener('click', () => { store.del('practice'); toast('Progress reset'); practiceIndex(); });
}

function practice(domain) {
  if (!DOMAINS[domain]) return notFound();
  const qs = buildExam(QUESTIONS.filter((q) => q.d === domain), 99);
  let i = 0, right = 0;

  function show() {
    if (i >= qs.length) {
      mount(`
        <h1 class="title">${esc(DOMAINS[domain])}</h1>
        <div class="stats fade"><div class="stat"><div class="big">${right}/${qs.length}</div><div class="small">correct</div></div></div>
        <div class="actions fade" style="--d:500ms"><a class="btn" href="#/practice/${domain}" id="again" style="text-decoration:none">Again</a><a class="link" href="#/practice">Domains</a></div>
        ${footer()}`);
      document.getElementById('again').addEventListener('click', (e) => { e.preventDefault(); practice(domain); });
      return;
    }
    const q = qs[i];
    let picked = isMulti(q) ? [] : null, locked = false;
    mount(`
      <div class="meta fade" style="--d:0ms"><span>${esc(DOMAINS[domain])}</span><span>${pad(i + 1)} / ${pad(qs.length)}</span></div>
      ${questionHtml(q)}
      <div class="explain fade" id="explain" hidden></div>
      <div class="actions fade" style="--d:600ms"><button class="btn" id="go" disabled>Check</button><a class="link" href="#/practice">Domains</a></div>
      ${footer()}`);
    const go = document.getElementById('go');
    bindChoices(q, () => picked, (v) => { picked = v; go.disabled = isMulti(q) ? !v.length : v == null; });
    go.addEventListener('click', () => {
      if (locked) { i++; show(); return; }
      locked = true;
      const ok = isCorrect(q, picked);
      if (ok) right++;
      const prog = store.get('practice', {});
      (prog[domain] ||= {})[q.id] = ok;
      store.set('practice', prog);
      markAnswers(q, picked);
      const ex = document.getElementById('explain');
      ex.innerHTML = `<strong>${ok ? 'Correct.' : 'Not quite.'}</strong> ${esc(q.x)}`;
      ex.hidden = false;
      go.textContent = i + 1 < qs.length ? 'Next' : 'Finish';
      go.focus();
    });
  }
  show();
}

/* ---------- questions ---------- */

function questionHtml(q, picked) {
  const multi = isMulti(q);
  return `
    <p class="question fade" style="--d:80ms">${esc(q.q)}</p>
    <ul class="rows" role="${multi ? 'group' : 'radiogroup'}" aria-label="Answers">${q.c.map((c, k) => {
      const on = multi ? (picked || []).includes(k) : picked === k;
      return `<li style="--i:${k};--base:100ms"><button class="row choice${multi ? ' multi' : ''}" role="${multi ? 'checkbox' : 'radio'}" aria-checked="${on}" data-k="${k}">
        <span class="mask"><span class="up num">${LETTERS[k]}</span></span>
        <span class="mask"><span class="up text">${esc(c)}</span></span>
        <span class="mask"><span class="up what"><span class="tag"></span><span class="box"></span></span></span>
      </button></li>`;
    }).join('')}</ul>`;
}

function bindChoices(q, get, set) {
  const multi = isMulti(q);
  const buttons = [...$page.querySelectorAll('.choice')];
  buttons.forEach((b) => b.addEventListener('click', () => {
    if ($page.querySelector('.rows.locked')) return;
    const k = Number(b.dataset.k);
    let v = get();
    if (multi) v = v.includes(k) ? v.filter((x) => x !== k) : [...v, k];
    else v = k;
    buttons.forEach((x) => {
      const xk = Number(x.dataset.k);
      x.setAttribute('aria-checked', multi ? v.includes(xk) : v === xk);
    });
    set(v);
  }));
  // Keys a–f pick an answer.
  keyHandler = (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = LETTERS.indexOf(e.key.toLowerCase());
    if (k >= 0 && buttons[k]) buttons[k].click();
  };
}

function markAnswers(q, picked) {
  const list = $page.querySelector('.rows[aria-label="Answers"]');
  list.classList.add('locked');
  const want = [].concat(q.a), got = [].concat(picked ?? []);
  list.querySelectorAll('.choice').forEach((b) => {
    const k = Number(b.dataset.k);
    b.disabled = true;
    const tag = b.querySelector('.tag');
    if (want.includes(k)) { b.classList.add('right'); tag.textContent = 'answer'; }
    else if (got.includes(k)) { b.classList.add('wrong'); tag.textContent = 'yours'; }
  });
}

let keyHandler = null;
addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea')) return;
  keyHandler?.(e);
});

/* ---------- mock ---------- */

let timer = null;
function stopTimer() { clearInterval(timer); timer = null; keyHandler = null; }

function newMock() {
  const seed = (Math.random() * 2 ** 32) >>> 0;
  const ids = buildExam(QUESTIONS, MOCK_SIZE, rng(seed)).map((q) => q.id);
  return { ids, answers: {}, flags: {}, cur: 0, endsAt: Date.now() + MOCK_MINUTES * 60_000 };
}

function mockIntro() {
  if (store.get('mock')) return mockQuestion();
  mount(`
    <h1 class="title">mock exam</h1>
    <div class="stats fade" style="--d:200ms">
      <div class="stat"><div class="big">${MOCK_SIZE}</div><div class="small">questions</div></div>
      <div class="stat"><div class="big">${MOCK_MINUTES}</div><div class="small">minutes</div></div>
      <div class="stat"><div class="big">700</div><div class="small">to pass</div></div>
    </div>
    <p class="muted fade" style="--d:400ms">All seven domains, mixed. No feedback until the end. Flag anything to revisit; keys a–f pick an answer, ← → move.</p>
    <div class="actions fade" style="--d:600ms"><button class="btn" id="start">Start</button><a class="link" href="#/">Back</a></div>
    ${footer()}`);
  document.getElementById('start').addEventListener('click', () => { store.set('mock', newMock()); mockQuestion(); });
}

function mockQuestion() {
  const m = store.get('mock');
  if (!m) return mockIntro();
  const q = byId[m.ids[m.cur]];
  const save = () => store.set('mock', m);
  const multi = isMulti(q);
  const n = m.ids.length;

  mount(`
    <div class="meta fade" style="--d:0ms"><span>${pad(m.cur + 1)} / ${pad(n)} · ${esc(DOMAINS[q.d])}</span><span id="timer">${fmtTime((m.endsAt - Date.now()) / 1000)}</span></div>
    ${questionHtml(q, m.answers[m.cur])}
    <div class="actions fade" style="--d:500ms">
      <button class="link" id="prev" ${m.cur === 0 ? 'disabled' : ''}>← Prev</button>
      <button class="link${m.flags[m.cur] ? ' on' : ''}" id="flag">${m.flags[m.cur] ? 'Flagged' : 'Flag'}</button>
      <span class="spacer"></span>
      ${m.cur + 1 < n ? '<button class="btn" id="next">Next →</button>' : '<button class="btn" id="submit">Submit</button>'}
    </div>
    <div class="map fade" style="--d:700ms" aria-label="Questions">${m.ids.map((_, k) => {
      const a = m.answers[k], done = a != null && !(Array.isArray(a) && !a.length);
      return `<button data-k="${k}" class="${done ? 'done' : ''}${m.flags[k] ? ' flag' : ''}${k === m.cur ? ' cur' : ''}" aria-label="Question ${k + 1}">${k + 1}</button>`;
    }).join('')}</div>
    <div class="actions fade" style="--d:800ms"><button class="link" id="quit">Quit mock</button>${m.cur + 1 < n ? '<span class="spacer"></span><button class="link" id="submit">Submit now</button>' : ''}</div>
    ${footer()}`);

  const go = (k) => { m.cur = k; save(); mockQuestion(); };
  bindChoices(q, () => m.answers[m.cur] ?? (multi ? [] : null), (v) => {
    m.answers[m.cur] = v; save();
    const done = multi ? v.length > 0 : v != null;
    $page.querySelector(`.map [data-k="${m.cur}"]`).classList.toggle('done', done);
  });
  const answerKeys = keyHandler;
  keyHandler = (e) => {
    if (e.key === 'ArrowRight' && m.cur + 1 < n) return go(m.cur + 1);
    if (e.key === 'ArrowLeft' && m.cur > 0) return go(m.cur - 1);
    answerKeys(e);
  };
  document.getElementById('prev').addEventListener('click', () => go(m.cur - 1));
  document.getElementById('next')?.addEventListener('click', () => go(m.cur + 1));
  document.getElementById('flag').addEventListener('click', (e) => {
    m.flags[m.cur] = !m.flags[m.cur]; save();
    e.target.textContent = m.flags[m.cur] ? 'Flagged' : 'Flag';
    e.target.classList.toggle('on', m.flags[m.cur]);
    $page.querySelector(`.map [data-k="${m.cur}"]`).classList.toggle('flag', m.flags[m.cur]);
  });
  $page.querySelectorAll('.map button').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.k))));
  $page.querySelectorAll('#submit').forEach((b) => b.addEventListener('click', () => {
    const left = n - Object.values(m.answers).filter((a) => a != null && !(Array.isArray(a) && !a.length)).length;
    if (left && !confirm(`${left} unanswered. Submit anyway?`)) return;
    finishMock();
  }));
  document.getElementById('quit').addEventListener('click', () => {
    if (!confirm('Quit this mock? Answers are discarded.')) return;
    store.del('mock'); location.hash = '#/';
  });

  const $t = document.getElementById('timer');
  const tick = () => {
    const left = (m.endsAt - Date.now()) / 1000;
    if (left <= 0) { toast('Time is up'); finishMock(); return; }
    $t.textContent = fmtTime(left);
  };
  tick();
  if (store.get('mock')) timer = setInterval(tick, 1000);
}

function finishMock() {
  const m = store.get('mock');
  if (!m) return;
  const qs = m.ids.map((id) => byId[id]);
  const answers = qs.map((_, i) => m.answers[i]);
  const r = score(qs, answers);
  store.set('last', { ...r, at: Date.now(), ids: m.ids, answers });
  store.del('mock');
  stopTimer();
  if (location.hash === '#/result') result();
  else location.hash = '#/result';
}

function result() {
  const r = store.get('last');
  if (!r) return mockIntro();
  const qs = r.ids.map((id) => byId[id]).filter(Boolean);
  const missed = qs.map((q, i) => ({ q, a: r.answers[i] })).filter(({ q, a }) => !isCorrect(q, a));
  const domains = Object.entries(r.byDomain).sort((a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total);
  const fmtAns = (q, a) => [].concat(a ?? []).map((k) => q.c[k]).join(', ') || 'no answer';

  mount(`
    <h1 class="title">${r.pass ? 'pass' : 'not yet'}</h1>
    <div class="stats fade" style="--d:200ms">
      <div class="stat"><div class="big">${r.scaled}</div><div class="small">of 1000</div></div>
      <div class="stat"><div class="big">${r.correct}/${r.total}</div><div class="small">correct</div></div>
      <div class="stat"><div class="big">${r.pct}%</div><div class="small">700 to pass</div></div>
    </div>
    <div class="block">
      <div class="meta"><span>By domain</span><span>weakest first</span></div>
      <ul class="rows">${domains.map(([d, s], i) => linkRow(i, `#/practice/${d}`, DOMAINS[d], `${s.correct}/${s.total}`, 400)).join('')}</ul>
    </div>
    <div class="block fade" style="--d:1.3s">
      <div class="meta"><span>Missed</span><span>${pad(missed.length)}</span></div>
      ${missed.length ? `<ul class="rows">${missed.map(({ q, a }, i) => `
        <li style="--i:0;--base:0ms"><div class="review">
          <div class="q">${esc(q.q)}</div>
          <div class="a">Yours: ${esc(fmtAns(q, a))} · Answer: <span>${esc(fmtAns(q, q.a))}</span></div>
          <div class="a">${esc(q.x)}</div>
        </div></li>`).join('')}</ul>` : '<p class="muted">Nothing missed.</p>'}
    </div>
    <div class="actions fade" style="--d:1.4s"><button class="btn" id="again">New mock</button><a class="link" href="#/">Home</a></div>
    ${footer()}`);
  document.getElementById('again').addEventListener('click', () => { store.set('mock', newMock()); location.hash = '#/mock'; });
}

/* ---------- router ---------- */

function notFound() {
  mount(`<h1 class="display">404</h1><p class="muted">Nothing here.</p><div class="actions"><a class="link" href="#/">Back</a></div>`, { tool: false });
}

function route() {
  const [, a, b] = (location.hash || '#/').slice(1).split('/');
  if (!a) return home();
  if (a === 'mock') return mockIntro();
  if (a === 'result') return result();
  if (a === 'prep') return prep();
  if (a === 'practice') return b ? practice(b) : practiceIndex();
  notFound();
}

addEventListener('hashchange', route);
route();
