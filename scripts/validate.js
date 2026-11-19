// Validates the question bank. Run: node scripts/validate.js
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadGlobal(file) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), ctx, { filename: file });
  return ctx.window;
}

const { QUESTIONS } = loadGlobal("questions.js");
const { DOMAINS } = loadGlobal("study.js");
const domains = new Set(DOMAINS.map((d) => d.id));
const errors = [];
const ids = new Set();

QUESTIONS.forEach((q) => {
  const where = q.id || "(no id)";
  if (!q.id) errors.push(`${where}: missing id`);
  if (ids.has(q.id)) errors.push(`${where}: duplicate id`);
  ids.add(q.id);
  if (!domains.has(q.domain)) errors.push(`${where}: unknown domain ${q.domain}`);
  if (!q.q || !q.explain || !q.objective) errors.push(`${where}: missing q/explain/objective`);
  if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${where}: needs 2+ options`);
  else {
    if (new Set(q.options).size !== q.options.length) errors.push(`${where}: duplicate options`);
    if (!Array.isArray(q.answer) || !q.answer.length) errors.push(`${where}: missing answer`);
    else if (q.answer.some((a) => !Number.isInteger(a) || a < 0 || a >= q.options.length)) errors.push(`${where}: answer index out of range`);
    else if (!q.multi && q.answer.length !== 1) errors.push(`${where}: single-choice must have 1 answer`);
    else if (q.multi && q.answer.length < 2) errors.push(`${where}: multi must have 2+ answers`);
  }
});

const counts = {};
QUESTIONS.forEach((q) => (counts[q.domain] = (counts[q.domain] || 0) + 1));
DOMAINS.forEach((d) => { if (!counts[d.id]) errors.push(`domain ${d.id}: no questions`); });

if (errors.length) { console.error("FAILED\n" + errors.join("\n")); process.exit(1); }
console.log(`OK: ${QUESTIONS.length} questions`, counts);
