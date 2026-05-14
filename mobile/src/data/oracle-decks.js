export const oracleDecks = [
  {
    id: "angels",
    name: "Angel Oracle",
    description: "Connect with angelic guidance and divine protection",
    theme: "spiritual",
    cards: [
      {
        name: "Archangel Michael",
        meaning: "Protection, courage, truth, and strength",
      },
      { name: "Archangel Raphael", meaning: "Healing, travel, and wholeness" },
      {
        name: "Archangel Gabriel",
        meaning: "Communication, creativity, and new beginnings",
      },
      { name: "Archangel Uriel", meaning: "Wisdom, illumination, and clarity" },
      {
        name: "Guardian Angel",
        meaning: "Divine protection and loving guidance",
      },
      {
        name: "Angel of Love",
        meaning: "Romance, compassion, and heart healing",
      },
      {
        name: "Angel of Abundance",
        meaning: "Prosperity, gratitude, and manifestation",
      },
      { name: "Angel of Peace", meaning: "Serenity, calm, and inner harmony" },
      {
        name: "Angel of Joy",
        meaning: "Happiness, playfulness, and celebration",
      },
      { name: "Angel of Hope", meaning: "Optimism, faith, and renewal" },
    ],
  },
  {
    id: "goddess",
    name: "Goddess Oracle",
    description: "Tap into divine feminine wisdom and power",
    theme: "feminine",
    cards: [
      { name: "Aphrodite", meaning: "Love, beauty, passion, and self-worth" },
      { name: "Artemis", meaning: "Independence, focus, and wild nature" },
      {
        name: "Athena",
        meaning: "Wisdom, strategy, and creative intelligence",
      },
      { name: "Isis", meaning: "Magic, resurrection, and motherhood" },
      { name: "Kali", meaning: "Transformation, endings, and fierce love" },
      { name: "Brigid", meaning: "Inspiration, healing, and sacred fire" },
      { name: "Lakshmi", meaning: "Abundance, fortune, and grace" },
      { name: "Quan Yin", meaning: "Compassion, mercy, and gentle strength" },
      { name: "Sekhmet", meaning: "Power, courage, and righteous anger" },
      { name: "Freya", meaning: "Sensuality, war, and destiny" },
    ],
  },
  {
    id: "nature",
    name: "Nature Spirits Oracle",
    description: "Receive wisdom from elementals and nature beings",
    theme: "elemental",
    cards: [
      { name: "Oak Tree", meaning: "Strength, endurance, and deep roots" },
      { name: "Wolf Spirit", meaning: "Intuition, loyalty, and wild freedom" },
      { name: "Butterfly", meaning: "Transformation, grace, and lightness" },
      { name: "Ocean Wave", meaning: "Emotional flow, cleansing, and power" },
      { name: "Mountain", meaning: "Stability, perspective, and achievement" },
      {
        name: "Fire Spirit",
        meaning: "Passion, purification, and creative force",
      },
      {
        name: "Crystal Cave",
        meaning: "Inner reflection, clarity, and hidden treasures",
      },
      { name: "Raven", meaning: "Magic, mystery, and transformation" },
      { name: "Rose", meaning: "Love, beauty, and sacred vulnerability" },
      { name: "Thunder", meaning: "Awakening, power, and divine message" },
    ],
  },
  {
    id: "shadow",
    name: "Shadow Work Oracle",
    description: "Explore your inner darkness with compassion",
    theme: "shadow",
    cards: [
      { name: "The Wound", meaning: "Acknowledge your pain to begin healing" },
      {
        name: "The Mask",
        meaning: "Release false personas and embrace authenticity",
      },
      { name: "Inner Child", meaning: "Reconnect with innocence and wonder" },
      {
        name: "The Critic",
        meaning: "Transform self-judgment into self-compassion",
      },
      {
        name: "Shame",
        meaning: "Bring hidden shame into the light for healing",
      },
      { name: "Rage", meaning: "Channel anger into positive change" },
      { name: "Grief", meaning: "Honor your losses and allow tears to flow" },
      { name: "Fear", meaning: "Face your fears to discover your courage" },
      { name: "Integration", meaning: "Unite all parts of yourself with love" },
      { name: "Rebirth", meaning: "Emerge renewed from shadow work" },
    ],
  },
  {
    id: "career",
    name: "Career & Abundance Oracle",
    description: "Navigate professional growth and prosperity",
    theme: "business",
    cards: [
      {
        name: "The Entrepreneur",
        meaning: "Innovation, risk-taking, and leadership",
      },
      { name: "Collaboration", meaning: "Teamwork, partnerships, and synergy" },
      {
        name: "Strategic Planning",
        meaning: "Vision, goals, and clear direction",
      },
      {
        name: "Financial Flow",
        meaning: "Money management and prosperity mindset",
      },
      { name: "Creative Solution", meaning: "Think outside the box" },
      { name: "Negotiation", meaning: "Find win-win outcomes" },
      {
        name: "Time Management",
        meaning: "Prioritize and focus energy wisely",
      },
      {
        name: "Professional Growth",
        meaning: "Skills development and advancement",
      },
      {
        name: "Work-Life Balance",
        meaning: "Harmony between career and personal life",
      },
      { name: "Success", meaning: "Achievement, recognition, and fulfillment" },
    ],
  },
  {
    id: "lgbtq",
    name: "Pride & Love Oracle",
    description: "LGBTQ+ affirming guidance celebrating authentic love",
    theme: "inclusive",
    cards: [
      { name: "Coming Out", meaning: "Courage to live your truth openly" },
      { name: "Chosen Family", meaning: "The family you create with love" },
      { name: "Gender Euphoria", meaning: "Joy in authentic self-expression" },
      { name: "Queer Joy", meaning: "Celebration of LGBTQ+ identity" },
      {
        name: "Trans Resilience",
        meaning: "Strength in transition and becoming",
      },
      { name: "Love is Love", meaning: "All forms of love are sacred" },
      { name: "Pride", meaning: "Self-acceptance and community celebration" },
      { name: "Allyship", meaning: "Support, advocacy, and solidarity" },
      {
        name: "Breaking Barriers",
        meaning: "Challenge norms and create change",
      },
      { name: "Authentic Self", meaning: "Be unapologetically you" },
    ],
  },
];

export const getDeckById = (id) => {
  return oracleDecks.find((deck) => deck.id === id);
};

export const getRandomOracleCard = (deckId) => {
  const deck = getDeckById(deckId);
  if (!deck) return null;

  const randomIndex = Math.floor(Math.random() * deck.cards.length);
  return {
    ...deck.cards[randomIndex],
    deck: deck.name,
  };
};
