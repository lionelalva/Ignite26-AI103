/* AI-103 Trainer: dependency-free study + quiz app. State lives in localStorage. */
(function () {
  "use strict";
  const Q = window.QUESTIONS, D = window.DOMAINS;
  const KEY = "ai103.progress.v1";
  const $app = document.getElementById("app");
  document.getElementById("guide").href = window.GUIDE_URL;

  // ---------- helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  const domName = (id) => D.find((d) => d.id === id).name;
  const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

  // ---------- storage ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { q: {}, history: [] }; }
    catch (e) { return { q: {}, history: [] }; }
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ } }
  let store = load();
  function record(id, ok) {
    const r = store.q[id] || { seen: 0, right: 0, last: null };
    r.seen++; if (ok) r.right++; r.last = ok; store.q[id] = r; save(store);
  }

  // ---------- router ----------
  let view = "home";
  const nav = document.getElementById("nav");
  nav.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go(b.dataset.view); });
  function go(v) {
    stopTimer(); view = v;
    nav.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    ({ home: renderHome, study: renderStudy, flash: renderFlash, quiz: renderQuizSetup })[v]();
    window.scrollTo(0, 0);
  }

  // ---------- dashboard ----------
  function domainStats() {
    return D.map((d) => {
      const qs = Q.filter((q) => q.domain === d.id);
      let seen = 0, right = 0, answered = 0;
      qs.forEach((q) => { const r = store.q[q.id]; if (r) { answered++; seen += r.seen; right += r.right; } });
      return { d, total: qs.length, answered, acc: pct(right, seen), seen };
    });
  }
  function renderHome() {
    const st = domainStats();
    const totalSeen = st.reduce((a, s) => a + s.seen, 0);
    const totalRight = Object.values(store.q).reduce((a, r) => a + r.right, 0);
    const missed = Q.filter((q) => store.q[q.id] && store.q[q.id].last === false).length;
    const weakest = st.filter((s) => s.seen).sort((a, b) => a.acc - b.acc)[0];
    $app.innerHTML = `
      <h1>Developing AI Apps and Agents on Azure</h1>
      <p class="sub">Exam AI-103 · pass score 700 · ${Q.length} practice questions across 5 skill domains</p>
      <div class="grid">
        <div class="card stat"><b>${pct(totalRight, totalSeen)}%</b><span>overall accuracy (${totalSeen} answers)</span></div>
        <div class="card stat"><b>${Object.keys(store.q).length}/${Q.length}</b><span>questions attempted</span></div>
        <div class="card stat"><b>${missed}</b><span>currently missed</span></div>
        <div class="card stat"><b>${store.history.length}</b><span>quiz sessions</span></div>
      </div>
      <div class="card"><h2>Domain mastery</h2>
        ${st.map((s) => `<div class="dom"><div><b>${esc(s.d.name)}</b> <span class="tag">${s.d.weight}</span></div><small>${s.seen ? s.acc + "%" : "—"}</small>
          <div class="bar"><i style="width:${s.seen ? s.acc : 0}%"></i></div></div>`).join("")}
        ${weakest ? `<p class="sub">Weakest so far: <b>${esc(weakest.d.name)}</b> (${weakest.acc}%).</p>` : `<p class="sub">Take a quiz to start tracking mastery.</p>`}
      </div>
      <div class="row">
        <button class="btn primary" id="go-quiz">Start a quiz</button>
        <button class="btn" id="go-study">Review study notes</button>
        ${weakest ? `<button class="btn" id="go-weak">Drill weakest domain</button>` : ""}
        <span class="spacer"></span><button class="btn" id="reset">Reset progress</button>
      </div>
      ${store.history.length ? `<div class="card" style="margin-top:14px"><h2>Recent sessions</h2>${store.history.slice(-5).reverse().map((h) =>
        `<div class="row"><span>${new Date(h.date).toLocaleString()}</span><span class="tag">${esc(h.mode)}</span><span class="tag">${esc(h.scope)}</span><span class="spacer"></span><b>${h.score}/${h.total} (${pct(h.score, h.total)}%)</b></div>`).join("")}</div>` : ""}`;
    document.getElementById("go-quiz").onclick = () => go("quiz");
    document.getElementById("go-study").onclick = () => go("study");
    const w = document.getElementById("go-weak"); if (w) w.onclick = () => startQuiz({ scope: weakest.d.id, count: 10, mode: "practice" });
    document.getElementById("reset").onclick = () => { if (confirm("Erase all saved progress?")) { store = { q: {}, history: [] }; save(store); renderHome(); } };
  }

  // ---------- study ----------
  function renderStudy() {
    $app.innerHTML = `<h1>Study</h1><p class="sub">Official skills outline, with the key points that most often decide answers. <a href="${window.GUIDE_URL}" target="_blank" rel="noopener">Full study guide</a></p>` +
      D.map((d) => `<div class="card"><h2>${esc(d.name)} <span class="tag">${d.weight}</span></h2>
        <h3>Key points</h3><ul>${d.keyPoints.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>
        <h3>Skills measured</h3>
        ${d.groups.map((g) => `<details><summary>${esc(g.title)}</summary><ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></details>`).join("")}
        <h3>Docs</h3><div class="row">${d.links.map((l) => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${esc(l[0])}</a>`).join(" · ")}</div>
        <div class="row" style="margin-top:12px"><button class="btn" data-quiz="${d.id}">Quiz this domain</button></div></div>`).join("");
    $app.querySelectorAll("[data-quiz]").forEach((b) => (b.onclick = () => startQuiz({ scope: b.dataset.quiz, count: 10, mode: "practice" })));
  }

  // ---------- flashcards ----------
  function renderFlash() {
    let scope = "all", deck = [], i = 0, flipped = false;
    const build = () => { deck = shuffle(Q.filter((q) => scope === "all" || q.domain === scope)); i = 0; flipped = false; draw(); };
    function draw() {
      const q = deck[i];
      const ans = q.answer.map((a) => q.options[a]).join(" · ");
      $app.innerHTML = `<h1>Flashcards</h1>
        <div class="row" style="margin-bottom:12px"><select id="fscope"><option value="all">All domains</option>${D.map((d) => `<option value="${d.id}" ${scope === d.id ? "selected" : ""}>${esc(d.name)}</option>`).join("")}</select>
        <span class="spacer"></span><span class="tag">${i + 1} / ${deck.length}</span></div>
        <div class="card flash" id="fc" tabindex="0">${flipped ? `<div><b>${esc(ans)}</b><p class="sub" style="font-size:15px;margin-top:12px">${esc(q.explain)}</p></div>` : esc(q.q)}</div>
        <div class="row"><button class="btn" id="prev">Previous</button><button class="btn primary" id="flip">${flipped ? "Show question" : "Show answer"}</button><button class="btn" id="next">Next</button></div>
        <p class="kbd">Space flips · ← → navigate</p>`;
      document.getElementById("fscope").onchange = (e) => { scope = e.target.value; build(); };
      const flip = () => { flipped = !flipped; draw(); };
      const step = (d) => { i = (i + d + deck.length) % deck.length; flipped = false; draw(); };
      document.getElementById("fc").onclick = flip; document.getElementById("flip").onclick = flip;
      document.getElementById("prev").onclick = () => step(-1); document.getElementById("next").onclick = () => step(1);
      keyHandler = (e) => { if (e.key === " ") { e.preventDefault(); flip(); } else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); };
    }
    build();
  }

  // ---------- quiz ----------
  let keyHandler = null, timer = null, run = null;
  document.addEventListener("keydown", (e) => {
    if (!keyHandler) return;
    const t = e.target, typing = t.tagName === "SELECT" || t.tagName === "TEXTAREA" || (t.tagName === "INPUT" && t.type === "number");
    if (!typing) keyHandler(e);
  });
  function stopTimer() { if (timer) clearInterval(timer); timer = null; keyHandler = null; }

  function renderQuizSetup() {
    const missed = Q.filter((q) => store.q[q.id] && store.q[q.id].last === false).length;
    $app.innerHTML = `<h1>Quiz</h1><p class="sub">Practice mode gives instant feedback. Exam mode is timed and reveals results at the end.</p>
      <div class="card">
        <div class="row"><label>Scope <select id="scope"><option value="all">All domains (weighted by bank)</option>
          ${D.map((d) => `<option value="${d.id}">${esc(d.name)}</option>`).join("")}
          <option value="missed">Previously missed (${missed})</option></select></label>
        <label>Questions <input id="count" type="number" min="1" max="${Q.length}" value="${Math.min(15, Q.length)}" style="width:80px"></label>
        <label>Mode <select id="mode"><option value="practice">Practice</option><option value="exam">Exam (timed)</option></select></label></div>
        <p class="sub" style="margin-top:12px">Exam mode allows about 1.5 minutes per question.</p>
        <button class="btn primary" id="start">Start</button></div>`;
    document.getElementById("start").onclick = () => startQuiz({
      scope: document.getElementById("scope").value,
      count: Math.max(1, Math.min(Q.length, parseInt(document.getElementById("count").value, 10) || 10)),
      mode: document.getElementById("mode").value });
  }

  function startQuiz(cfg) {
    view = "quiz"; nav.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b.dataset.view === "quiz"));
    let pool = Q.filter((q) => cfg.scope === "all" || (cfg.scope === "missed" ? store.q[q.id] && store.q[q.id].last === false : q.domain === cfg.scope));
    if (!pool.length) { alert("No questions in that scope yet."); return renderQuizSetup(); }
    // prefer unseen questions first, then shuffle within groups
    const unseen = shuffle(pool.filter((q) => !store.q[q.id])), seen = shuffle(pool.filter((q) => store.q[q.id]));
    const items = unseen.concat(seen).slice(0, cfg.count).map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { q, order, picked: [], done: false };
    });
    run = { cfg, items, i: 0, deadline: cfg.mode === "exam" ? Date.now() + items.length * 90000 : null };
    stopTimer();
    if (run.deadline) timer = setInterval(tick, 500);
    drawQ();
  }
  function tick() {
    const el = document.getElementById("clock"); if (!el) return;
    const left = Math.max(0, run.deadline - Date.now());
    el.textContent = Math.floor(left / 60000) + ":" + String(Math.floor(left / 1000) % 60).padStart(2, "0");
    if (!left) finish();
  }
  function drawQ() {
    const it = run.items[run.i], q = it.q, exam = run.cfg.mode === "exam", multi = !!q.multi;
    const showFb = it.done && !exam;
    $app.innerHTML = `<div class="row" style="margin-bottom:10px"><span class="tag">Q ${run.i + 1} / ${run.items.length}</span><span class="tag">${esc(domName(q.domain))}</span>
      <span class="spacer"></span>${exam ? `<span class="timer" id="clock"></span>` : ""}</div>
      <div class="bar" style="margin-bottom:14px"><i style="width:${pct(run.i, run.items.length)}%"></i></div>
      <div class="card"><h2>${esc(q.q)}</h2>${multi ? `<p class="sub">Choose ${q.answer.length}.</p>` : ""}
      <div id="opts">${it.order.map((oi, pos) => {
        const picked = it.picked.includes(oi), right = q.answer.includes(oi);
        const cls = showFb ? (right ? "good" : picked ? "bad" : "") : (picked ? "sel" : "");
        return `<label class="opt ${cls}"><input type="${multi ? "checkbox" : "radio"}" name="o" value="${oi}" ${picked ? "checked" : ""} ${showFb ? "disabled" : ""}><span><b>${"ABCDEFG"[pos]}.</b> ${esc(q.options[oi])}</span></label>`;
      }).join("")}</div>
      ${showFb ? `<div class="expl"><b class="verdict ${same(it.picked, q.answer) ? "ok" : "no"}">${same(it.picked, q.answer) ? "Correct" : "Not quite"}</b> — ${esc(q.explain)}<br><span class="kbd">Skill: ${esc(q.objective)}</span></div>` : ""}
      </div>
      <div class="row"><button class="btn" id="back" ${run.i === 0 ? "disabled" : ""}>Back</button><span class="spacer"></span>
      ${!exam && !it.done ? `<button class="btn primary" id="check" ${it.picked.length ? "" : "disabled"}>Check answer</button>` : ""}
      ${(exam || it.done) ? `<button class="btn primary" id="next">${run.i === run.items.length - 1 ? "Finish" : "Next"}</button>` : ""}</div>
      <p class="kbd">Keys: 1-${q.options.length} select · Enter check/next</p>`;
    if (exam) tick();
    $app.querySelectorAll("#opts input").forEach((inp) => inp.addEventListener("change", () => {
      const v = +inp.value;
      if (multi) it.picked = inp.checked ? it.picked.concat(v) : it.picked.filter((x) => x !== v); else it.picked = [v];
      drawQ();
    }));
    const on = (id, fn) => { const b = document.getElementById(id); if (b) b.onclick = fn; };
    on("back", () => { run.i--; drawQ(); });
    on("check", () => checkCurrent());
    on("next", () => advance());
    keyHandler = (e) => {
      if (e.key === "Enter") { if (!exam && !it.done) { if (it.picked.length) checkCurrent(); } else advance(); }
      else if (/^[1-7]$/.test(e.key) && !showFb) {
        const oi = it.order[+e.key - 1]; if (oi === undefined) return;
        if (multi) it.picked = it.picked.includes(oi) ? it.picked.filter((x) => x !== oi) : it.picked.concat(oi); else it.picked = [oi];
        drawQ();
      }
    };
  }
  function checkCurrent() {
    const it = run.items[run.i]; if (!it.picked.length || it.done) return;
    it.done = true; record(it.q.id, same(it.picked, it.q.answer)); it.recorded = true; drawQ();
  }
  function advance() {
    const it = run.items[run.i];
    if (run.cfg.mode === "exam") it.done = true;
    if (run.i < run.items.length - 1) { run.i++; drawQ(); } else finish();
  }
  function finish() {
    stopTimer();
    run.items.forEach((it) => { if (!it.recorded && it.picked.length) record(it.q.id, same(it.picked, it.q.answer)); else if (!it.recorded) record(it.q.id, false); it.recorded = true; });
    const score = run.items.filter((it) => same(it.picked, it.q.answer)).length, total = run.items.length, p = pct(score, total);
    store.history.push({ date: Date.now(), mode: run.cfg.mode, scope: run.cfg.scope === "all" ? "all" : run.cfg.scope === "missed" ? "missed" : run.cfg.scope, score, total });
    save(store);
    const byDom = D.map((d) => { const its = run.items.filter((it) => it.q.domain === d.id); return { d, n: its.length, ok: its.filter((it) => same(it.picked, it.q.answer)).length }; }).filter((x) => x.n);
    $app.innerHTML = `<h1>Results</h1>
      <div class="card" style="text-align:center"><div class="score ${p >= 70 ? "pass" : "fail"}">${p}%</div><p class="sub">${score} of ${total} correct. The exam passes at a scaled score of 700, which is not the same as 70% of questions, but aim consistently above ~75-80% here.</p></div>
      <div class="card"><h2>By domain</h2>${byDom.map((x) => `<div class="dom"><div>${esc(x.d.name)}</div><small>${x.ok}/${x.n}</small><div class="bar"><i style="width:${pct(x.ok, x.n)}%"></i></div></div>`).join("")}</div>
      <div class="card"><h2>Review</h2>${run.items.map((it, n) => {
        const ok = same(it.picked, it.q.answer);
        return `<details ${ok ? "" : "open"}><summary>${ok ? "✅" : "❌"} ${n + 1}. ${esc(it.q.q)}</summary>
          <p><b>Your answer:</b> ${it.picked.length ? esc(it.picked.map((i) => it.q.options[i]).join(" · ")) : "<i>none</i>"}<br>
          <b>Correct:</b> ${esc(it.q.answer.map((i) => it.q.options[i]).join(" · "))}</p><div class="expl">${esc(it.q.explain)}<br><span class="kbd">Skill: ${esc(it.q.objective)}</span></div></details>`;
      }).join("")}</div>
      <div class="row"><button class="btn primary" id="again">New quiz</button><button class="btn" id="home">Dashboard</button></div>`;
    document.getElementById("again").onclick = () => go("quiz");
    document.getElementById("home").onclick = () => go("home");
  }

  go("home");
})();
