// === Constants ===
const WEAPON = {
  dagger: { min_multiplier: 3.6, max_multiplier: 4.2 }
};

const JOB = {
  shadower: { mastery: 0.6 }
};

const STORAGE_KEY = 'nshot-inputs';
const THEME_KEY = 'nshot-theme';

// === DOM references (assigned in init) ===
let strInput, dexInput, intInput, lukInput;
let atkMinInput, atkMaxInput;
let watkValue;
let monsterSelect, skillSelect, skillLevelInput, venomEnabledCheck, venomLevelInput;
let monsterInfo, skillInfo, venomInfo;
let calculateBtn, resultsDiv;
let themeToggle;

// ============================================================
// Initialization
// ============================================================

function init() {
  // Cache DOM
  strInput = document.getElementById('str');
  dexInput = document.getElementById('dex');
  intInput = document.getElementById('int');
  lukInput = document.getElementById('luk');
  atkMinInput = document.getElementById('atk-min');
  atkMaxInput = document.getElementById('atk-max');
  watkValue = document.getElementById('watk-value');
  monsterSelect = document.getElementById('monster-select');
  skillSelect = document.getElementById('skill-select');
  skillLevelInput = document.getElementById('skill-level');
  venomEnabledCheck = document.getElementById('venom-enabled');
  venomLevelInput = document.getElementById('venom-level');
  monsterInfo = document.getElementById('monster-info');
  skillInfo = document.getElementById('skill-info');
  venomInfo = document.getElementById('venom-info');
  calculateBtn = document.getElementById('calculate-btn');
  resultsDiv = document.getElementById('results');
  themeToggle = document.getElementById('theme-toggle');

  // Theme
  loadTheme();
  themeToggle.addEventListener('click', toggleTheme);

  // Populate dropdowns before restoring saved values
  populateMonsters();
  populateSkills();

  // Restore saved inputs
  loadFromStorage();

  updateWATK();
  updateMonsterInfo();
  updateSkillInfo();
  updateVenomInfo();

  // Save on every input change
  const allInputs = [strInput, dexInput, intInput, lukInput, atkMinInput, atkMaxInput,
    skillLevelInput, venomLevelInput];
  allInputs.forEach(el => el.addEventListener('input', saveToStorage));
  monsterSelect.addEventListener('change', saveToStorage);
  skillSelect.addEventListener('change', saveToStorage);
  venomEnabledCheck.addEventListener('change', saveToStorage);
  venomEnabledCheck.addEventListener('change', updateVenomInfo);

  // Sanitize stat/range inputs on blur: clamp to non-negative integer
  [strInput, dexInput, intInput, lukInput, atkMinInput, atkMaxInput].forEach(el =>
    el.addEventListener('blur', () => {
      el.value = Math.max(0, Math.floor(parseFloat(el.value) || 0));
      saveToStorage();
    })
  );
  // Validate skill level inputs on input
  [skillLevelInput, venomLevelInput].forEach(el =>
    el.addEventListener('input', () => validateSkillLevel(el))
  );

  // Listeners
  [strInput, dexInput, lukInput, atkMinInput, atkMaxInput].forEach(el =>
    el.addEventListener('input', updateWATK)
  );
  [strInput, dexInput, lukInput].forEach(el =>
    el.addEventListener('input', updateVenomInfo)
  );
  monsterSelect.addEventListener('change', updateMonsterInfo);
  skillSelect.addEventListener('change', updateSkillInfo);
  skillLevelInput.addEventListener('input', updateSkillInfo);
  venomLevelInput.addEventListener('input', updateVenomInfo);
  calculateBtn.addEventListener('click', onCalculate);
}

// ============================================================
// Populate dropdowns
// ============================================================

function populateMonsters() {
  monsters.forEach((m, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = m.name;
    monsterSelect.appendChild(opt);
  });
}

function populateSkills() {
  skills.filter(s => s.type === 'attack').forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.name_en})`;
    skillSelect.appendChild(opt);
  });
}

// ============================================================
// Info displays
// ============================================================

function updateWATK() {
  const luk = num(lukInput);
  const dex = num(dexInput);
  const str = num(strInput);
  const maxAtk = num(atkMaxInput);
  const denom = luk * WEAPON.dagger.max_multiplier + dex + str;
  if (denom === 0 || maxAtk === 0) {
    watkValue.textContent = '-';
    return;
  }
  watkValue.textContent = Math.round(maxAtk * 100 / denom);
}

function updateMonsterInfo() {
  const m = monsters[monsterSelect.value];
  if (!m) { monsterInfo.innerHTML = ''; return; }
  monsterInfo.innerHTML =
    `HP: <b>${m.hp.toLocaleString()}</b> ｜ 物防: <b>${m.weapon_def}</b> ｜ 魔防: <b>${m.magic_def}</b>`;
}

function updateSkillInfo() {
  const skill = getSelectedAttackSkill();
  if (!skill) { skillInfo.innerHTML = ''; return; }
  const level = clampLevel(skillLevelInput, skill);
  const pct = calcDmgPercent(skill, level);
  skillInfo.innerHTML =
    `Lv.${level}: <b>${pct}%</b> &times; ${skill.hits} hit ｜ 延遲 ${skill.latency}ms`;
}

function updateVenomInfo() {
  const enabled = venomEnabledCheck.checked;
  const level = parseInt(venomLevelInput.value) || 0;
  if (!enabled || level <= 0) {
    venomInfo.innerHTML = '<span style="color:var(--text-muted)">已停用</span>';
    return;
  }
  const vp = calcVenomParams(level, num(strInput), num(dexInput), num(lukInput));
  venomInfo.innerHTML =
    `Lv.${level}: 成功率 <b>${(vp.successRate * 100).toFixed(0)}%</b> ｜ ` +
    `持續 <b>${vp.duration}ms</b> ｜ 最大 <b>${vp.maxStack}</b> 層<br>` +
    `基本攻擊力: <b>${vp.basicAttack}</b> ｜ ` +
    `每層傷害: <b>${Math.floor(vp.dmgMin)}</b> ~ <b>${Math.floor(vp.dmgMax)}</b>/tick`;
}

// ============================================================
// Skill / Venom calculation helpers
// ============================================================

function calcDmgPercent(skill, level) {
  if (skill.dmg_percent === -1) return -1;
  return skill.dmg_percent.base + skill.dmg_percent.per_level * level;
}

function calcVenomParams(level, str, dex, luk) {
  const meta = skills.find(s => s.id === 'venom').metadata;
  const basicAttack = meta.basic_attack.base + meta.basic_attack.per_level * level;
  const successRate =
    (meta.success_rate.base_percent +
      meta.success_rate.per_ceil_step_percent * Math.ceil(level / meta.success_rate.ceil_divisor)) / 100;
  const duration =
    meta.duration_ms.base +
    meta.duration_ms.per_ceil_step * Math.ceil(level / meta.duration_ms.ceil_divisor);
  const maxStack = meta.max_stack;
  const tickInterval = meta.tick_interval_ms;
  const c = meta.dmg_coefficients;
  const dmgMax = (c.max_main_stat_coeff * (str + luk) + dex * c.secondary_stat_coeff) / 100 * basicAttack;
  const dmgMin = (c.min_main_stat_coeff * (str + luk) + dex * c.secondary_stat_coeff) / 100 * basicAttack;
  return { basicAttack, successRate, duration, maxStack, tickInterval, dmgMax, dmgMin };
}

// ============================================================
// Simulation
// ============================================================

/**
 * Simulate one fight and return the number of skill casts to kill the mob.
 *
 * Timeline events:
 *   - Skill casts at t = 0, latency, 2*latency, …
 *   - Venom ticks at t = 1000, 2000, 3000, …
 * Events are processed in chronological order (cast first if tied).
 */
function simulateOnce(playerMin, playerMax, monster, skillPercent, hits, latency, venomParams) {
  let hp = monster.hp;
  const wDef = monster.weapon_def;
  const pctMul = skillPercent / 100;   // e.g. 400 → 4.0

  const venomOn = venomParams !== null;

  let castCount = 0;
  let venomStacks = [];  // each entry = expiry timestamp
  let nextCast = 0;
  let nextTick = 1000;

  const MAX_ITER = 10000;
  let iter = 0;

  while (hp > 0 && iter < MAX_ITER) {
    iter++;

    // Pick next event
    if (!venomOn || nextCast <= nextTick) {
      // --- Skill cast ---
      const t = nextCast;
      castCount++;

      for (let h = 0; h < hits; h++) {
        const atk = randInt(playerMin, playerMax);
        const dmg = Math.max(1, Math.floor((atk - 0.55 * wDef) * pctMul));
        hp -= dmg;

        // Venom proc check per hit
        if (venomOn) {
          pruneStacks(venomStacks, t);
          if (Math.random() < venomParams.successRate) {
            if (venomStacks.length >= venomParams.maxStack) {
              venomStacks.shift(); // drop oldest
            }
            venomStacks.push(t + venomParams.duration);
          }
        }
        if (hp <= 0) break;
      }

      nextCast += latency;
    } else {
      // --- Venom tick ---
      const t = nextTick;
      pruneStacks(venomStacks, t);
      const stacks = venomStacks.length;
      if (stacks > 0) {
        const roll = Math.random() * (venomParams.dmgMax - venomParams.dmgMin) + venomParams.dmgMin;
        hp -= Math.max(1, Math.floor(roll * stacks));
      }
      nextTick += 1000;
    }
  }

  return castCount;
}

function runSimulation(playerMin, playerMax, monster, skill, skillLevel, venomParams) {
  const pct = calcDmgPercent(skill, skillLevel);
  const distribution = {};
  const simCount = config.simulation_count;

  for (let i = 0; i < simCount; i++) {
    const shots = simulateOnce(
      playerMin, playerMax, monster,
      pct, skill.hits, skill.latency,
      venomParams
    );
    distribution[shots] = (distribution[shots] || 0) + 1;
  }

  return distribution;
}

// ============================================================
// UI: Calculate button handler
// ============================================================

function onCalculate() {
  const playerMin = num(atkMinInput);
  const playerMax = num(atkMaxInput);
  if (playerMin <= 0 || playerMax <= 0 || playerMin > playerMax) {
    resultsDiv.innerHTML = '<p style="color:red">請輸入有效的攻擊力範圍</p>';
    return;
  }

  const monster = monsters[monsterSelect.value];
  const skill = getSelectedAttackSkill();
  const skillLevel = clampLevel(skillLevelInput, skill);

  const venomEnabled = venomEnabledCheck.checked;
  const venomLevel = parseInt(venomLevelInput.value) || 0;
  let venomParams = null;
  if (venomEnabled && venomLevel > 0) {
    venomParams = calcVenomParams(venomLevel, num(strInput), num(dexInput), num(lukInput));
  }

  // Show loading
  calculateBtn.disabled = true;
  resultsDiv.innerHTML = '<p class="loading-text">模擬中…</p>';

  // Run async to let the UI update
  setTimeout(() => {
    const distribution = runSimulation(playerMin, playerMax, monster, skill, skillLevel, venomParams);
    displayResults(distribution, config.simulation_count);
    calculateBtn.disabled = false;
  }, 20);
}

// ============================================================
// Display results
// ============================================================

function displayResults(distribution, total) {
  const keys = Object.keys(distribution).map(Number).sort((a, b) => a - b);

  // Find max percentage for bar scaling
  let maxPct = 0;
  for (const k of keys) {
    const p = distribution[k] / total * 100;
    if (p > maxPct) maxPct = p;
  }

  let html = '<h3>擊殺次數分佈</h3>';

  for (const shots of keys) {
    const count = distribution[shots];
    const pct = (count / total * 100).toFixed(2);
    const barW = (count / total * 100 / maxPct * 100).toFixed(1); // relative to max
    html +=
      `<div class="result-row">` +
        `<span class="result-label">${shots}下擊殺:</span>` +
        `<span class="result-bar-container">` +
          `<span class="result-bar" style="width:${barW}%"></span>` +
        `</span>` +
        `<span class="result-percent">${pct}%</span>` +
      `</div>`;
  }

  // Expected value
  let expected = 0;
  for (const k of keys) expected += k * distribution[k] / total;

  html +=
    `<div class="result-summary">` +
      `期望值: ${expected.toFixed(2)} 下擊殺<br>` +
      `模擬次數: ${total.toLocaleString()}` +
    `</div>`;

  resultsDiv.innerHTML = html;
}

// ============================================================
// Utility helpers
// ============================================================

/** Parse number from input element, default 0, clamp to >= 0 integer */
function num(el) {
  return Math.max(0, Math.floor(parseFloat(el.value) || 0));
}

/** Random integer in [min, max] inclusive */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Remove expired venom stacks (expiry <= t) */
function pruneStacks(stacks, t) {
  let i = 0;
  while (i < stacks.length) {
    if (stacks[i] <= t) {
      stacks.splice(i, 1);
    } else {
      i++;
    }
  }
}

/** Get the currently selected attack skill object */
function getSelectedAttackSkill() {
  return skills.find(s => s.id === skillSelect.value) || skills.find(s => s.type === 'attack');
}

/** Clamp skill level input to valid range (for calculation only) */
function clampLevel(input, skill) {
  let v = parseInt(input.value) || skill.default_level;
  v = Math.max(skill.min_level, Math.min(skill.max_level, v));
  return v;
}

/** Show/hide validation tooltip on skill level inputs */
function validateSkillLevel(el) {
  const min = parseInt(el.min) || 0;
  const max = parseInt(el.max) || 30;
  const v = parseInt(el.value);
  const invalid = isNaN(v) || v < min || v > max || el.value !== String(Math.floor(v));
  el.classList.toggle('input-invalid', invalid);
  // Manage tooltip span
  let tip = el.parentElement.querySelector('.validation-tip');
  if (invalid) {
    if (!tip) {
      tip = document.createElement('span');
      tip.className = 'validation-tip';
      el.parentElement.appendChild(tip);
    }
    tip.textContent = `請輸入 ${min}~${max} 的整數`;
  } else if (tip) {
    tip.remove();
  }
}

// ============================================================
// Theme
// ============================================================

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  // Default to dark (no class = dark)
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    themeToggle.textContent = '🌙';
  }
  // Remove the early-flash class
  document.documentElement.classList.remove('light-early');
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light-theme');
  localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
}

// ============================================================
// LocalStorage
// ============================================================

function saveToStorage() {
  const data = {
    str: strInput.value,
    dex: dexInput.value,
    int: intInput.value,
    luk: lukInput.value,
    atkMin: atkMinInput.value,
    atkMax: atkMaxInput.value,
    monster: monsterSelect.value,
    skill: skillSelect.value,
    skillLevel: skillLevelInput.value,
    venomEnabled: venomEnabledCheck.checked,
    venomLevel: venomLevelInput.value
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.str !== undefined) strInput.value = data.str;
    if (data.dex !== undefined) dexInput.value = data.dex;
    if (data.int !== undefined) intInput.value = data.int;
    if (data.luk !== undefined) lukInput.value = data.luk;
    if (data.atkMin !== undefined) atkMinInput.value = data.atkMin;
    if (data.atkMax !== undefined) atkMaxInput.value = data.atkMax;
    if (data.monster !== undefined) monsterSelect.value = data.monster;
    if (data.skill !== undefined) skillSelect.value = data.skill;
    if (data.skillLevel !== undefined) skillLevelInput.value = data.skillLevel;
    if (data.venomEnabled !== undefined) venomEnabledCheck.checked = data.venomEnabled;
    if (data.venomLevel !== undefined) venomLevelInput.value = data.venomLevel;
  } catch (e) {
    // Ignore corrupt data
  }
}

// ============================================================
// Entry point
// ============================================================
document.addEventListener('DOMContentLoaded', init);
