const skills = [
  {
    id: "boomerang_step",
    name: "瞬步連擊",
    name_en: "Boomerang Step",
    job: "shadower",
    type: "attack",
    min_level: 1,
    max_level: 30,
    default_level: 30,
    dmg_percent: { base: 250, per_level: 5 },
    hits: 2,
    latency: 720,
    metadata: null
  },
  {
    id: "venom",
    name: "飛毒殺",
    name_en: "Venom",
    job: "thief",
    type: "passive_dot",
    min_level: 0,
    max_level: 30,
    default_level: 1,
    dmg_percent: -1,
    hits: 1,
    latency: 1000,
    metadata: {
      basic_attack: { base: 30, per_level: 1 },
      success_rate: { base_percent: 20, per_ceil_step_percent: 2, ceil_divisor: 3 },
      duration_ms: { base: 1000, per_ceil_step: 1000, ceil_divisor: 10 },
      max_stack: 3,
      tick_interval_ms: 1000,
      dmg_coefficients: {
        max_main_stat_coeff: 18.5,
        min_main_stat_coeff: 8.0,
        secondary_stat_coeff: 2
      }
    }
  }
];
