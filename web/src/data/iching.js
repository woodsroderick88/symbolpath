// I‑Ching Hexagram data — 64 hexagrams with trigrams, meanings, and symbol mappings
export const TRIGRAMS = {
  111: {
    name: "Heaven (Qián)",
    symbol: "☰",
    element: "Metal",
    quality: "Creative",
  },
  "000": {
    name: "Earth (Kūn)",
    symbol: "☷",
    element: "Earth",
    quality: "Receptive",
  },
  100: {
    name: "Thunder (Zhèn)",
    symbol: "☳",
    element: "Wood",
    quality: "Arousing",
  },
  "010": {
    name: "Water (Kǎn)",
    symbol: "☵",
    element: "Water",
    quality: "Abysmal",
  },
  "001": {
    name: "Mountain (Gèn)",
    symbol: "☶",
    element: "Earth",
    quality: "Keeping Still",
  },
  "011": {
    name: "Wind (Xùn)",
    symbol: "☴",
    element: "Wood",
    quality: "Gentle",
  },
  101: { name: "Fire (Lí)", symbol: "☲", element: "Fire", quality: "Clinging" },
  110: { name: "Lake (Duì)", symbol: "☱", element: "Metal", quality: "Joyous" },
};

export const HEXAGRAMS = [
  {
    num: 1,
    name: "The Creative",
    chinese: "乾",
    upper: "111",
    lower: "111",
    judgment:
      "The Creative works sublime success, furthering through perseverance.",
    image: "Heaven above, heaven below — tireless creative force.",
    symbolId: 7,
    keywords: ["initiative", "power", "creativity"],
  },
  {
    num: 2,
    name: "The Receptive",
    chinese: "坤",
    upper: "000",
    lower: "000",
    judgment:
      "The Receptive brings about sublime success, furthering through the perseverance of a mare.",
    image: "Earth above, earth below — yielding devotion.",
    symbolId: 6,
    keywords: ["receptivity", "patience", "nurturing"],
  },
  {
    num: 3,
    name: "Difficulty at the Beginning",
    chinese: "屯",
    upper: "010",
    lower: "100",
    judgment:
      "Difficulty at the beginning works supreme success. Nothing should be undertaken without appointed helpers.",
    image: "Water over thunder — chaos giving birth to order.",
    symbolId: 1,
    keywords: ["birth", "struggle", "perseverance"],
  },
  {
    num: 4,
    name: "Youthful Folly",
    chinese: "蒙",
    upper: "001",
    lower: "010",
    judgment:
      "Youthful folly has success. It is not I who seek the young fool; the young fool seeks me.",
    image: "Mountain over water — a spring at the foot of the mountain.",
    symbolId: 4,
    keywords: ["innocence", "learning", "guidance"],
  },
  {
    num: 5,
    name: "Waiting",
    chinese: "需",
    upper: "010",
    lower: "111",
    judgment:
      "Waiting. If you are sincere, you have light and success. Perseverance brings good fortune.",
    image: "Water over heaven — clouds rising, rain awaited.",
    symbolId: 5,
    keywords: ["patience", "nourishment", "faith"],
  },
  {
    num: 6,
    name: "Conflict",
    chinese: "讼",
    upper: "111",
    lower: "010",
    judgment:
      "Conflict. You are sincere but are being obstructed. Seek counsel.",
    image: "Heaven over water — opposing directions.",
    symbolId: 17,
    keywords: ["dispute", "justice", "caution"],
  },
  {
    num: 7,
    name: "The Army",
    chinese: "师",
    upper: "000",
    lower: "010",
    judgment:
      "The army needs perseverance and a strong leader. Good fortune without blame.",
    image: "Earth over water — groundwater gathered.",
    symbolId: 9,
    keywords: ["discipline", "leadership", "strategy"],
  },
  {
    num: 8,
    name: "Holding Together",
    chinese: "比",
    upper: "010",
    lower: "000",
    judgment:
      "Holding together brings good fortune. Those who are uncertain should consult the oracle again.",
    image: "Water over earth — streams uniting.",
    symbolId: 8,
    keywords: ["unity", "support", "alliance"],
  },
  {
    num: 9,
    name: "Small Taming",
    chinese: "小畜",
    upper: "011",
    lower: "111",
    judgment:
      "The Taming Power of the Small has success. Dense clouds, no rain.",
    image: "Wind over heaven — gentle restraint.",
    symbolId: 16,
    keywords: ["restraint", "small-steps", "patience"],
  },
  {
    num: 10,
    name: "Treading",
    chinese: "履",
    upper: "111",
    lower: "110",
    judgment: "Treading upon the tail of the tiger. It does not bite. Success.",
    image: "Heaven over lake — conduct and propriety.",
    symbolId: 19,
    keywords: ["conduct", "courage", "propriety"],
  },
  {
    num: 11,
    name: "Peace",
    chinese: "泰",
    upper: "000",
    lower: "111",
    judgment:
      "Peace. The small departs, the great approaches. Good fortune. Success.",
    image: "Earth over heaven — heaven and earth unite.",
    symbolId: 17,
    keywords: ["harmony", "prosperity", "unity"],
  },
  {
    num: 12,
    name: "Standstill",
    chinese: "否",
    upper: "111",
    lower: "000",
    judgment:
      "Standstill. Evil people do not further the perseverance of the superior.",
    image: "Heaven over earth — separation and stagnation.",
    symbolId: 11,
    keywords: ["stagnation", "withdrawal", "patience"],
  },
  {
    num: 13,
    name: "Fellowship",
    chinese: "同人",
    upper: "111",
    lower: "101",
    judgment:
      "Fellowship with others in the open. Success. Crossing the great water furthers.",
    image: "Heaven over fire — light reaching upward.",
    symbolId: 8,
    keywords: ["community", "openness", "shared-purpose"],
  },
  {
    num: 14,
    name: "Great Possession",
    chinese: "大有",
    upper: "101",
    lower: "111",
    judgment: "Great Possession. Supreme success.",
    image: "Fire over heaven — supreme clarity.",
    symbolId: 23,
    keywords: ["abundance", "clarity", "generosity"],
  },
  {
    num: 15,
    name: "Modesty",
    chinese: "谦",
    upper: "000",
    lower: "001",
    judgment:
      "Modesty creates success. The superior person carries things through.",
    image: "Earth over mountain — leveling the high, filling the low.",
    symbolId: 17,
    keywords: ["humility", "balance", "merit"],
  },
  {
    num: 16,
    name: "Enthusiasm",
    chinese: "豫",
    upper: "100",
    lower: "000",
    judgment:
      "Enthusiasm. It furthers one to install helpers and to set armies marching.",
    image: "Thunder over earth — energy bursting forth.",
    symbolId: 7,
    keywords: ["inspiration", "momentum", "joy"],
  },
  {
    num: 17,
    name: "Following",
    chinese: "随",
    upper: "110",
    lower: "100",
    judgment: "Following has supreme success. Perseverance furthers. No blame.",
    image: "Lake over thunder — joy following movement.",
    symbolId: 6,
    keywords: ["adaptability", "trust", "flow"],
  },
  {
    num: 18,
    name: "Work on What Has Been Spoiled",
    chinese: "蛊",
    upper: "001",
    lower: "011",
    judgment:
      "Work on what has been spoiled has supreme success. Crossing the great water furthers.",
    image: "Mountain over wind — decay requiring renewal.",
    symbolId: 13,
    keywords: ["repair", "renewal", "responsibility"],
  },
  {
    num: 19,
    name: "Approach",
    chinese: "临",
    upper: "000",
    lower: "110",
    judgment: "Approach has supreme success. Perseverance furthers.",
    image: "Earth over lake — the approach of spring.",
    symbolId: 2,
    keywords: ["spring", "opportunity", "growth"],
  },
  {
    num: 20,
    name: "Contemplation",
    chinese: "观",
    upper: "011",
    lower: "000",
    judgment:
      "Contemplation. The ablution has been made, but not yet the offering.",
    image: "Wind over earth — viewing from above.",
    symbolId: 14,
    keywords: ["observation", "reflection", "perspective"],
  },
  {
    num: 21,
    name: "Biting Through",
    chinese: "噬嗑",
    upper: "101",
    lower: "100",
    judgment:
      "Biting Through has success. It furthers one to let justice be administered.",
    image: "Fire over thunder — decisive action.",
    symbolId: 10,
    keywords: ["justice", "decisiveness", "obstacles"],
  },
  {
    num: 22,
    name: "Grace",
    chinese: "贲",
    upper: "001",
    lower: "101",
    judgment:
      "Grace has success. In small matters it furthers one to undertake something.",
    image: "Mountain over fire — beauty illuminating stillness.",
    symbolId: 22,
    keywords: ["beauty", "form", "adornment"],
  },
  {
    num: 23,
    name: "Splitting Apart",
    chinese: "剥",
    upper: "001",
    lower: "000",
    judgment: "Splitting apart. It does not further one to go anywhere.",
    image: "Mountain over earth — erosion of the old.",
    symbolId: 11,
    keywords: ["collapse", "letting-go", "acceptance"],
  },
  {
    num: 24,
    name: "Return",
    chinese: "复",
    upper: "000",
    lower: "100",
    judgment:
      "Return. Success. Going out and coming in without error. The movement is natural.",
    image: "Earth over thunder — the return of light.",
    symbolId: 21,
    keywords: ["renewal", "cycle", "recovery"],
  },
  {
    num: 25,
    name: "Innocence",
    chinese: "无妄",
    upper: "111",
    lower: "100",
    judgment: "Innocence. Supreme success. Perseverance furthers.",
    image: "Heaven over thunder — natural, uncorrupted action.",
    symbolId: 4,
    keywords: ["authenticity", "naturalness", "trust"],
  },
  {
    num: 26,
    name: "Great Taming",
    chinese: "大畜",
    upper: "001",
    lower: "111",
    judgment:
      "The Taming Power of the Great. Perseverance furthers. Not eating at home brings good fortune.",
    image: "Mountain over heaven — accumulated strength.",
    symbolId: 9,
    keywords: ["restraint", "accumulation", "power"],
  },
  {
    num: 27,
    name: "Nourishment",
    chinese: "颐",
    upper: "001",
    lower: "100",
    judgment: "The Corners of the Mouth. Perseverance brings good fortune.",
    image: "Mountain over thunder — nourishment of body and mind.",
    symbolId: 5,
    keywords: ["nourishment", "self-care", "words"],
  },
  {
    num: 28,
    name: "Great Exceeding",
    chinese: "大过",
    upper: "110",
    lower: "011",
    judgment:
      "Preponderance of the Great. The ridgepole sags. It furthers to have somewhere to go.",
    image: "Lake over wind — extraordinary pressure.",
    symbolId: 10,
    keywords: ["crisis", "breakthrough", "extraordinary"],
  },
  {
    num: 29,
    name: "The Abysmal",
    chinese: "坎",
    upper: "010",
    lower: "010",
    judgment:
      "The Abysmal repeated. If you are sincere, you have success in your heart.",
    image: "Water above, water below — danger repeated.",
    symbolId: 15,
    keywords: ["danger", "depth", "faith"],
  },
  {
    num: 30,
    name: "The Clinging",
    chinese: "离",
    upper: "101",
    lower: "101",
    judgment:
      "The Clinging. Perseverance furthers. Success. Care of the cow brings good fortune.",
    image: "Fire above, fire below — dependence on what endures.",
    symbolId: 7,
    keywords: ["clarity", "dependence", "illumination"],
  },
  {
    num: 31,
    name: "Influence",
    chinese: "咸",
    upper: "110",
    lower: "001",
    judgment:
      "Influence. Success. Perseverance furthers. To take a maiden to wife brings good fortune.",
    image: "Lake over mountain — mutual attraction.",
    symbolId: 3,
    keywords: ["attraction", "sensitivity", "openness"],
  },
  {
    num: 32,
    name: "Duration",
    chinese: "恒",
    upper: "100",
    lower: "011",
    judgment: "Duration. Success. No blame. Perseverance furthers.",
    image: "Thunder over wind — enduring consistency.",
    symbolId: 5,
    keywords: ["endurance", "consistency", "marriage"],
  },
  {
    num: 33,
    name: "Retreat",
    chinese: "遁",
    upper: "111",
    lower: "001",
    judgment: "Retreat. Success. In what is small, perseverance furthers.",
    image: "Heaven over mountain — strategic withdrawal.",
    symbolId: 18,
    keywords: ["withdrawal", "timing", "wisdom"],
  },
  {
    num: 34,
    name: "Great Power",
    chinese: "大壮",
    upper: "100",
    lower: "111",
    judgment: "The Power of the Great. Perseverance furthers.",
    image: "Thunder over heaven — great power rising.",
    symbolId: 20,
    keywords: ["strength", "power", "responsibility"],
  },
  {
    num: 35,
    name: "Progress",
    chinese: "晋",
    upper: "101",
    lower: "000",
    judgment:
      "Progress. The powerful prince is honored with horses in large numbers.",
    image: "Fire over earth — sunrise, steady advance.",
    symbolId: 2,
    keywords: ["advancement", "recognition", "sunrise"],
  },
  {
    num: 36,
    name: "Darkening of the Light",
    chinese: "明夷",
    upper: "000",
    lower: "101",
    judgment:
      "Darkening of the Light. In adversity, it furthers one to be persevering.",
    image: "Earth over fire — the sun sinks below the earth.",
    symbolId: 18,
    keywords: ["adversity", "concealment", "perseverance"],
  },
  {
    num: 37,
    name: "The Family",
    chinese: "家人",
    upper: "011",
    lower: "101",
    judgment: "The Family. The perseverance of the woman furthers.",
    image: "Wind over fire — warmth radiating outward.",
    symbolId: 16,
    keywords: ["family", "roles", "warmth"],
  },
  {
    num: 38,
    name: "Opposition",
    chinese: "睽",
    upper: "101",
    lower: "110",
    judgment: "Opposition. In small matters, good fortune.",
    image: "Fire over lake — opposing forces seeking balance.",
    symbolId: 14,
    keywords: ["polarity", "tension", "complementarity"],
  },
  {
    num: 39,
    name: "Obstruction",
    chinese: "蹇",
    upper: "010",
    lower: "001",
    judgment: "Obstruction. The southwest furthers. Not the northeast.",
    image: "Water over mountain — dangerous water on a steep cliff.",
    symbolId: 12,
    keywords: ["obstacles", "detour", "help"],
  },
  {
    num: 40,
    name: "Deliverance",
    chinese: "解",
    upper: "100",
    lower: "010",
    judgment:
      "Deliverance. The southwest furthers. If there is nothing that requires one to go, return brings good fortune.",
    image: "Thunder over water — release after tension.",
    symbolId: 21,
    keywords: ["release", "relief", "forgiveness"],
  },
  {
    num: 41,
    name: "Decrease",
    chinese: "损",
    upper: "001",
    lower: "110",
    judgment:
      "Decrease combined with sincerity brings about supreme good fortune.",
    image: "Mountain over lake — simplification.",
    symbolId: 17,
    keywords: ["sacrifice", "simplicity", "sincerity"],
  },
  {
    num: 42,
    name: "Increase",
    chinese: "益",
    upper: "011",
    lower: "100",
    judgment:
      "Increase. It furthers one to undertake something. It furthers one to cross the great water.",
    image: "Wind over thunder — increase through giving.",
    symbolId: 23,
    keywords: ["growth", "generosity", "opportunity"],
  },
  {
    num: 43,
    name: "Breakthrough",
    chinese: "夬",
    upper: "110",
    lower: "111",
    judgment:
      "Breakthrough. One must resolutely make the matter known at the court of the king.",
    image: "Lake over heaven — determination rising.",
    symbolId: 13,
    keywords: ["resolution", "truth", "determination"],
  },
  {
    num: 44,
    name: "Coming to Meet",
    chinese: "姤",
    upper: "111",
    lower: "011",
    judgment:
      "Coming to Meet. The maiden is powerful. One should not marry such a maiden.",
    image: "Heaven over wind — unexpected encounter.",
    symbolId: 3,
    keywords: ["encounter", "temptation", "awareness"],
  },
  {
    num: 45,
    name: "Gathering Together",
    chinese: "萃",
    upper: "110",
    lower: "000",
    judgment: "Gathering Together. Success. The king approaches his temple.",
    image: "Lake over earth — water collected on the earth.",
    symbolId: 8,
    keywords: ["community", "leadership", "devotion"],
  },
  {
    num: 46,
    name: "Pushing Upward",
    chinese: "升",
    upper: "000",
    lower: "011",
    judgment: "Pushing Upward has supreme success. One must see the great man.",
    image: "Earth over wind — wood growing upward through earth.",
    symbolId: 9,
    keywords: ["effort", "growth", "ascent"],
  },
  {
    num: 47,
    name: "Oppression",
    chinese: "困",
    upper: "110",
    lower: "010",
    judgment:
      "Oppression. Success. Perseverance. The great person brings about good fortune.",
    image: "Lake over water — water drained away, exhaustion.",
    symbolId: 15,
    keywords: ["exhaustion", "adversity", "inner-strength"],
  },
  {
    num: 48,
    name: "The Well",
    chinese: "井",
    upper: "010",
    lower: "011",
    judgment:
      "The Well. The town may be changed, but the well cannot be changed.",
    image: "Water over wind — drawing water from depth.",
    symbolId: 23,
    keywords: ["nourishment", "depth", "community"],
  },
  {
    num: 49,
    name: "Revolution",
    chinese: "革",
    upper: "110",
    lower: "101",
    judgment: "Revolution. On your own day you are believed. Supreme success.",
    image: "Lake over fire — fire beneath water, transformation.",
    symbolId: 13,
    keywords: ["change", "renewal", "timing"],
  },
  {
    num: 50,
    name: "The Cauldron",
    chinese: "鼎",
    upper: "101",
    lower: "011",
    judgment: "The Cauldron. Supreme good fortune. Success.",
    image: "Fire over wind — nourishing flame, transformation.",
    symbolId: 16,
    keywords: ["nourishment", "culture", "transformation"],
  },
  {
    num: 51,
    name: "The Arousing",
    chinese: "震",
    upper: "100",
    lower: "100",
    judgment:
      "Shock brings success. Shock comes — oh, oh! Laughing words — ha, ha!",
    image: "Thunder above, thunder below — sudden awakening.",
    symbolId: 10,
    keywords: ["shock", "awakening", "renewal"],
  },
  {
    num: 52,
    name: "Keeping Still",
    chinese: "艮",
    upper: "001",
    lower: "001",
    judgment:
      "Keeping Still. Keeping his back still so he no longer feels his body.",
    image: "Mountain above, mountain below — deep stillness.",
    symbolId: 5,
    keywords: ["meditation", "stillness", "clarity"],
  },
  {
    num: 53,
    name: "Development",
    chinese: "渐",
    upper: "011",
    lower: "001",
    judgment:
      "Development. The maiden is given in marriage. Good fortune. Perseverance furthers.",
    image: "Wind over mountain — gradual progress.",
    symbolId: 6,
    keywords: ["gradual", "patience", "development"],
  },
  {
    num: 54,
    name: "The Marrying Maiden",
    chinese: "归妹",
    upper: "100",
    lower: "110",
    judgment:
      "The Marrying Maiden. Undertakings bring misfortune. Nothing furthers.",
    image: "Thunder over lake — improper union.",
    symbolId: 12,
    keywords: ["subordination", "patience", "propriety"],
  },
  {
    num: 55,
    name: "Abundance",
    chinese: "丰",
    upper: "100",
    lower: "101",
    judgment: "Abundance has success. The king attains abundance. Be not sad.",
    image: "Thunder over fire — fullness of light and movement.",
    symbolId: 23,
    keywords: ["fullness", "peak", "generosity"],
  },
  {
    num: 56,
    name: "The Wanderer",
    chinese: "旅",
    upper: "101",
    lower: "001",
    judgment:
      "The Wanderer. Success through smallness. Perseverance brings good fortune.",
    image: "Fire over mountain — a traveler's fire on the peak.",
    symbolId: 19,
    keywords: ["journey", "detachment", "adaptability"],
  },
  {
    num: 57,
    name: "The Gentle",
    chinese: "巽",
    upper: "011",
    lower: "011",
    judgment:
      "The Gentle. Success through small things. It furthers one to have somewhere to go.",
    image: "Wind above, wind below — penetrating influence.",
    symbolId: 6,
    keywords: ["gentleness", "penetration", "persistence"],
  },
  {
    num: 58,
    name: "The Joyous",
    chinese: "兑",
    upper: "110",
    lower: "110",
    judgment: "The Joyous. Success. Perseverance is favorable.",
    image: "Lake above, lake below — shared joy and communication.",
    symbolId: 23,
    keywords: ["joy", "communication", "friendship"],
  },
  {
    num: 59,
    name: "Dispersion",
    chinese: "涣",
    upper: "011",
    lower: "010",
    judgment:
      "Dispersion. Success. The king approaches his temple. Crossing the great water furthers.",
    image: "Wind over water — dissolving barriers.",
    symbolId: 21,
    keywords: ["dissolution", "unity", "spiritual-practice"],
  },
  {
    num: 60,
    name: "Limitation",
    chinese: "节",
    upper: "010",
    lower: "110",
    judgment:
      "Limitation. Success. Galling limitation must not be persevered in.",
    image: "Water over lake — restraint and boundaries.",
    symbolId: 17,
    keywords: ["boundaries", "moderation", "structure"],
  },
  {
    num: 61,
    name: "Inner Truth",
    chinese: "中孚",
    upper: "011",
    lower: "110",
    judgment:
      "Inner Truth. Pigs and fishes. Good fortune. Crossing the great water furthers.",
    image: "Wind over lake — truth penetrating inward.",
    symbolId: 14,
    keywords: ["sincerity", "insight", "trust"],
  },
  {
    num: 62,
    name: "Small Exceeding",
    chinese: "小过",
    upper: "100",
    lower: "001",
    judgment:
      "Preponderance of the Small. Success. Perseverance furthers. Small things may be done; great things should not.",
    image: "Thunder over mountain — modest action.",
    symbolId: 16,
    keywords: ["modesty", "attention", "small-steps"],
  },
  {
    num: 63,
    name: "After Completion",
    chinese: "既济",
    upper: "010",
    lower: "101",
    judgment:
      "After Completion. Success in small matters. Perseverance furthers.",
    image: "Water over fire — everything in place, vigilance needed.",
    symbolId: 20,
    keywords: ["completion", "vigilance", "order"],
  },
  {
    num: 64,
    name: "Before Completion",
    chinese: "未济",
    upper: "101",
    lower: "010",
    judgment:
      "Before Completion. Success. But if the little fox, after nearly completing the crossing, gets his tail in the water, there is nothing that would further.",
    image: "Fire over water — not yet across, almost there.",
    symbolId: 1,
    keywords: ["transition", "hope", "caution"],
  },
];

export const castHexagram = () => {
  const lines = [];
  for (let i = 0; i < 6; i++) {
    // Traditional coin-toss method: three coins, heads=3 tails=2
    const coins = [
      Math.random() > 0.5 ? 3 : 2,
      Math.random() > 0.5 ? 3 : 2,
      Math.random() > 0.5 ? 3 : 2,
    ];
    const total = coins[0] + coins[1] + coins[2];
    // 6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing)
    lines.push({
      value: total,
      isYang: total === 7 || total === 9,
      isChanging: total === 6 || total === 9,
      binary: total === 7 || total === 9 ? "1" : "0",
    });
  }

  const lower = lines
    .slice(0, 3)
    .map((l) => l.binary)
    .join("");
  const upper = lines
    .slice(3, 6)
    .map((l) => l.binary)
    .join("");

  const primary =
    HEXAGRAMS.find((h) => h.upper === upper && h.lower === lower) ||
    HEXAGRAMS[0];

  // Calculate relating hexagram (from changing lines)
  const hasChanging = lines.some((l) => l.isChanging);
  let relating = null;
  if (hasChanging) {
    const changedLines = lines.map((l) => ({
      ...l,
      binary: l.isChanging ? (l.isYang ? "0" : "1") : l.binary,
    }));
    const changedLower = changedLines
      .slice(0, 3)
      .map((l) => l.binary)
      .join("");
    const changedUpper = changedLines
      .slice(3, 6)
      .map((l) => l.binary)
      .join("");
    relating =
      HEXAGRAMS.find(
        (h) => h.upper === changedUpper && h.lower === changedLower,
      ) || null;
  }

  return {
    lines,
    primary,
    relating,
    hasChanging,
    changingLineNumbers: lines
      .map((l, i) => (l.isChanging ? i + 1 : null))
      .filter(Boolean),
    upperTrigram: TRIGRAMS[upper],
    lowerTrigram: TRIGRAMS[lower],
  };
};

export const getHexagramByNumber = (num) =>
  HEXAGRAMS.find((h) => h.num === num);
