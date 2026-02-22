const jobs = [
  // 劍士 (Warrior) — main STR / sec DEX
  { id: 'hero', name: '英雄', name_en: 'Hero', category: 'warrior', category_name: '劍士',
    main_stat: 'STR', secondary_stat: 'DEX',
    weapons: [
      { id: '1h_sword', name: '單手劍', name_en: '1H Sword', max_multiplier: 4.2, min_multiplier: 4.2 },
      { id: '2h_sword', name: '雙手劍', name_en: '2H Sword', max_multiplier: 4.8, min_multiplier: 4.8 },
      { id: '1h_axe',   name: '單手斧', name_en: '1H Axe',   max_multiplier: 4.8, min_multiplier: 3.6 },
      { id: '2h_axe',   name: '雙手斧', name_en: '2H Axe',   max_multiplier: 5.2, min_multiplier: 4.0 },
    ],
    mastery: 0.6, disabled: false, implemented: false },
  { id: 'paladin', name: '聖騎士', name_en: 'Paladin', category: 'warrior', category_name: '劍士',
    main_stat: 'STR', secondary_stat: 'DEX',
    weapons: [
      { id: '1h_sword', name: '單手劍', name_en: '1H Sword', max_multiplier: 4.2, min_multiplier: 4.2 },
      { id: '2h_sword', name: '雙手劍', name_en: '2H Sword', max_multiplier: 4.8, min_multiplier: 4.8 },
      { id: '1h_mace',  name: '單手棍', name_en: '1H Mace',  max_multiplier: 4.8, min_multiplier: 3.6 },
      { id: '2h_mace',  name: '雙手棍', name_en: '2H Mace',  max_multiplier: 5.2, min_multiplier: 4.0 },
    ],
    mastery: 0.6, disabled: false, implemented: false },
  { id: 'dark_knight', name: '黑騎士', name_en: 'Dark Knight', category: 'warrior', category_name: '劍士',
    main_stat: 'STR', secondary_stat: 'DEX',
    weapons: [
      { id: 'spear',   name: '槍', name_en: 'Spear',   max_multiplier: 5.1, min_multiplier: 3.6 },
      { id: 'polearm', name: '矛', name_en: 'Polearm', max_multiplier: 5.2, min_multiplier: 3.5 },
    ],
    mastery: 0.6, disabled: false, implemented: false },

  // 法師 (Mage) — main INT / sec LUK — disabled (magic formula differs)
  { id: 'arch_mage_il', name: '大魔導士冰雷', name_en: 'Arch Mage I/L', category: 'mage', category_name: '法師',
    main_stat: 'INT', secondary_stat: 'LUK',
    weapons: [], mastery: 0, disabled: true, implemented: false },
  { id: 'arch_mage_fp', name: '大魔導士火毒', name_en: 'Arch Mage F/P', category: 'mage', category_name: '法師',
    main_stat: 'INT', secondary_stat: 'LUK',
    weapons: [], mastery: 0, disabled: true, implemented: false },
  { id: 'bishop', name: '主教', name_en: 'Bishop', category: 'mage', category_name: '法師',
    main_stat: 'INT', secondary_stat: 'LUK',
    weapons: [], mastery: 0, disabled: true, implemented: false },

  // 弓箭手 (Archer) — main DEX / sec STR
  { id: 'bow_master', name: '箭神', name_en: 'Bow Master', category: 'archer', category_name: '弓箭手',
    main_stat: 'DEX', secondary_stat: 'STR',
    weapons: [
      { id: 'bow', name: '弓', name_en: 'Bow', max_multiplier: 3.4, min_multiplier: 3.4 },
    ],
    mastery: 0.6, disabled: false, implemented: false },
  { id: 'marksman', name: '神射手', name_en: 'Marksman', category: 'archer', category_name: '弓箭手',
    main_stat: 'DEX', secondary_stat: 'STR',
    weapons: [
      { id: 'crossbow', name: '弩', name_en: 'Crossbow', max_multiplier: 3.6, min_multiplier: 3.6 },
    ],
    mastery: 0.6, disabled: false, implemented: false },

  // 盜賊 (Thief) — main LUK / sec STR+DEX
  { id: 'shadower', name: '暗影神偷', name_en: 'Shadower', category: 'thief', category_name: '盜賊',
    main_stat: 'LUK', secondary_stat: 'STR+DEX',
    weapons: [
      { id: 'dagger', name: '短劍', name_en: 'Dagger', max_multiplier: 4.2, min_multiplier: 3.6 },
    ],
    mastery: 0.6, disabled: false, implemented: true },
  { id: 'night_lord', name: '夜使者', name_en: 'Night Lord', category: 'thief', category_name: '盜賊',
    main_stat: 'LUK', secondary_stat: 'STR+DEX',
    weapons: [
      { id: 'claw', name: '拳套', name_en: 'Claw', max_multiplier: 3.6, min_multiplier: 3.6 },
    ],
    mastery: 0.6, disabled: false, implemented: false },

  // 海盜 (Pirate)
  { id: 'corsair', name: '槍神', name_en: 'Corsair', category: 'pirate', category_name: '海盜',
    main_stat: 'DEX', secondary_stat: 'STR',
    weapons: [
      { id: 'gun', name: '槍(火槍)', name_en: 'Gun', max_multiplier: 3.6, min_multiplier: 3.6 },
    ],
    mastery: 0.6, disabled: false, implemented: false },
  { id: 'viper', name: '拳霸', name_en: 'Viper', category: 'pirate', category_name: '海盜',
    main_stat: 'STR', secondary_stat: 'DEX',
    weapons: [
      { id: 'knuckle', name: '指虎', name_en: 'Knuckle', max_multiplier: 4.8, min_multiplier: 4.8 },
    ],
    mastery: 0.6, disabled: false, implemented: false },
];
