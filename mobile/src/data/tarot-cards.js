export const tarotCards = [
  // ── MAJOR ARCANA (22 cards) ────────────────────────────────────────────────
  {
    id: "the_fool",
    number: "0",
    name: "The Fool",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["New beginnings", "Freedom", "Innocence", "Risk"],
      meaning:
        "A fresh start, stepping into the unknown with faith and optimism. It represents the potential for a new journey where everything is possible.",
    },
    reversed: {
      keywords: ["Recklessness", "Hesitation", "Risk-taking", "Fear"],
      meaning:
        "Indicates a lack of direction or a fear of starting something new. It can also warn against being too impulsive or making foolish choices.",
    },
  },
  {
    id: "the_magician",
    number: "I",
    name: "The Magician",
    arcana: "major",
    suit: null,
    upright: {
      keywords: [
        "Manifestation",
        "Resourcefulness",
        "Power",
        "Inspired action",
      ],
      meaning:
        "The ability to take all the tools at your disposal and manifest your desires into reality. You have the skills and power to succeed.",
    },
    reversed: {
      keywords: [
        "Manipulation",
        "Poor planning",
        "Untapped talents",
        "Illusion",
      ],
      meaning:
        "Represents blocked creative energy or the use of one's skills for manipulative purposes. A reminder to check your intentions.",
    },
  },
  {
    id: "the_high_priestess",
    number: "II",
    name: "The High Priestess",
    arcana: "major",
    suit: null,
    upright: {
      keywords: [
        "Intuition",
        "Sacred knowledge",
        "Divine feminine",
        "Inner knowing",
      ],
      meaning:
        "A call to trust your inner voice and intuition. The answers you seek are within you, waiting to be revealed through stillness.",
    },
    reversed: {
      keywords: [
        "Secrets",
        "Disconnected from intuition",
        "Withdrawal",
        "Repression",
      ],
      meaning:
        "Suggests you are ignoring your gut feeling or that there are hidden factors at play. It's time to reconnect with your inner wisdom.",
    },
  },
  {
    id: "the_empress",
    number: "III",
    name: "The Empress",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Femininity", "Beauty", "Nature", "Abundance"],
      meaning:
        "A symbol of creation, nurturing, and the abundance of life. It encourages connecting with your senses and the natural world.",
    },
    reversed: {
      keywords: ["Creative block", "Dependence", "Smothering", "Emptiness"],
      meaning:
        "May indicate a lack of growth or feeling disconnected from your creative spark. Nurture yourself first before trying to nurture others.",
    },
  },
  {
    id: "the_emperor",
    number: "IV",
    name: "The Emperor",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Authority", "Structure", "Control", "Father figure"],
      meaning:
        "Represents leadership, stability, and the power of logic and reason. It's about creating order and setting firm boundaries.",
    },
    reversed: {
      keywords: ["Tyranny", "Rigidity", "Coldness", "Lack of discipline"],
      meaning:
        "A warning against being too controlling or inflexible. It can also represent a loss of authority or lack of direction.",
    },
  },
  {
    id: "the_hierophant",
    number: "V",
    name: "The Hierophant",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Tradition", "Conformity", "Morality", "Institutions"],
      meaning:
        "Represents conventional wisdom, spiritual guidance, and working within established structures. A mentor or institution may offer valuable counsel.",
    },
    reversed: {
      keywords: ["Rebellion", "Subversiveness", "New approaches", "Freedom"],
      meaning:
        "Encourages questioning the status quo and challenging outdated beliefs. It may be time to forge your own spiritual or ethical path.",
    },
  },
  {
    id: "the_lovers",
    number: "VI",
    name: "The Lovers",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Love", "Harmony", "Relationships", "Values alignment"],
      meaning:
        "Signifies deep connection, meaningful choices, and alignment between heart and mind. Relationships built on shared values will flourish.",
    },
    reversed: {
      keywords: ["Self-love", "Disharmony", "Imbalance", "Misalignment"],
      meaning:
        "Points to disharmony within relationships or a conflict between personal values. Look inward before seeking union with another.",
    },
  },
  {
    id: "the_chariot",
    number: "VII",
    name: "The Chariot",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Control", "Willpower", "Success", "Determination"],
      meaning:
        "Victory through discipline and determination. You have the drive and focus to overcome obstacles and reach your destination.",
    },
    reversed: {
      keywords: [
        "Lack of direction",
        "Opposition",
        "Loss of control",
        "Aggression",
      ],
      meaning:
        "Suggests scattered energy or loss of control over a situation. Regroup, refocus, and harness your willpower before moving forward.",
    },
  },
  {
    id: "strength",
    number: "VIII",
    name: "Strength",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Courage", "Patience", "Compassion", "Inner strength"],
      meaning:
        "True strength comes from compassion and patience, not brute force. You have the inner resources to tame any wild situation with grace.",
    },
    reversed: {
      keywords: ["Self-doubt", "Low energy", "Raw emotion", "Insecurity"],
      meaning:
        "Indicates inner weakness, self-doubt, or difficulty controlling impulses. Reconnect with your core confidence and trust in yourself.",
    },
  },
  {
    id: "the_hermit",
    number: "IX",
    name: "The Hermit",
    arcana: "major",
    suit: null,
    upright: {
      keywords: [
        "Soul-searching",
        "Introspection",
        "Inner guidance",
        "Solitude",
      ],
      meaning:
        "A time for retreat and inner reflection. Step back from the noise of the world and seek the lantern of your own wisdom.",
    },
    reversed: {
      keywords: ["Isolation", "Loneliness", "Withdrawal", "Lost your way"],
      meaning:
        "Cautions against excessive isolation or losing yourself in your own thoughts. Re-engage with the world when you're ready.",
    },
  },
  {
    id: "wheel_of_fortune",
    number: "X",
    name: "Wheel of Fortune",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Good luck", "Karma", "Life cycles", "Destiny"],
      meaning:
        "The wheel turns and brings change. A lucky break or turning point is at hand. Align yourself with the flow of life.",
    },
    reversed: {
      keywords: [
        "Bad luck",
        "Resistance to change",
        "Breaking cycles",
        "No control",
      ],
      meaning:
        "Suggests resisting inevitable change or being on the wrong side of a cycle. Reflect on patterns and what might be keeping you stuck.",
    },
  },
  {
    id: "justice",
    number: "XI",
    name: "Justice",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Fairness", "Truth", "Cause and effect", "Law"],
      meaning:
        "Truth and accountability prevail. Decisions made now carry real consequences — act with integrity and expect fair outcomes.",
    },
    reversed: {
      keywords: ["Unfairness", "Dishonesty", "Lack of accountability", "Bias"],
      meaning:
        "Points to injustice, dishonesty, or avoiding responsibility. Examine your own role before casting blame elsewhere.",
    },
  },
  {
    id: "the_hanged_man",
    number: "XII",
    name: "The Hanged Man",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Pause", "Surrender", "New perspectives", "Letting go"],
      meaning:
        "Wisdom gained through suspension and sacrifice. Pause, surrender control, and look at your situation from a completely new angle.",
    },
    reversed: {
      keywords: ["Delays", "Resistance", "Stalling", "Indecision"],
      meaning:
        "You may be delaying necessary change or refusing to see things differently. Release what no longer serves you.",
    },
  },
  {
    id: "death",
    number: "XIII",
    name: "Death",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Endings", "Transformation", "Transition", "Letting go"],
      meaning:
        "Not physical death, but a powerful transformation. Something is ending so that something new and better can begin.",
    },
    reversed: {
      keywords: [
        "Resistance to change",
        "Stagnation",
        "Slow transition",
        "Fear",
      ],
      meaning:
        "You may be clinging to the past and resisting necessary change. Allow the old to die so the new can emerge.",
    },
  },
  {
    id: "temperance",
    number: "XIV",
    name: "Temperance",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Balance", "Moderation", "Patience", "Purpose"],
      meaning:
        "A call to find the middle path, blending opposites into harmony. Patience and moderation will lead you to your higher purpose.",
    },
    reversed: {
      keywords: [
        "Imbalance",
        "Excess",
        "Lack of purpose",
        "Realignment needed",
      ],
      meaning:
        "An area of your life is out of balance. Identify where excess or extremity is causing harm and course-correct with intention.",
    },
  },
  {
    id: "the_devil",
    number: "XV",
    name: "The Devil",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Shadow self", "Attachment", "Addiction", "Restriction"],
      meaning:
        "Confronts the shadow — the parts of yourself tied to addiction, obsession, or unhealthy bonds. Awareness is the first step to freedom.",
    },
    reversed: {
      keywords: [
        "Releasing limiting beliefs",
        "Detachment",
        "Freedom",
        "Reclaiming power",
      ],
      meaning:
        "The chains begin to fall away. You are breaking free from self-imposed limitations, destructive patterns, or toxic bonds.",
    },
  },
  {
    id: "the_tower",
    number: "XVI",
    name: "The Tower",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Sudden change", "Upheaval", "Revelation", "Chaos"],
      meaning:
        "A sudden and unavoidable disruption that shatters the old to make room for truth. Though chaotic, it clears what no longer serves.",
    },
    reversed: {
      keywords: [
        "Fear of change",
        "Averting disaster",
        "Delayed crisis",
        "Internal upheaval",
      ],
      meaning:
        "You may be avoiding or delaying an inevitable reckoning. Inner turmoil is building — face it before it forces itself upon you.",
    },
  },
  {
    id: "the_star",
    number: "XVII",
    name: "The Star",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Hope", "Faith", "Renewal", "Spirituality"],
      meaning:
        "After the storm, the stars emerge. A time of healing, hope, and renewed faith in yourself and the universe.",
    },
    reversed: {
      keywords: ["Lack of faith", "Despair", "Disconnection", "Pessimism"],
      meaning:
        "Hope feels distant and trust has been lost. Reconnect with your inner light — even a small spark can guide you home.",
    },
  },
  {
    id: "the_moon",
    number: "XVIII",
    name: "The Moon",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Illusion", "Fear", "The unconscious", "Hidden truth"],
      meaning:
        "Things are not what they seem. Navigate carefully through uncertainty, dreams, and the murky waters of the subconscious.",
    },
    reversed: {
      keywords: [
        "Release of fear",
        "Repressed emotion",
        "Inner clarity",
        "Confusion lifting",
      ],
      meaning:
        "The fog is beginning to clear. Repressed fears or hidden truths are surfacing so they can be healed and released.",
    },
  },
  {
    id: "the_sun",
    number: "XIX",
    name: "The Sun",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Positivity", "Vitality", "Success", "Joy"],
      meaning:
        "Radiant energy, optimism, and success. The Sun illuminates your path — this is a time of joy, achievement, and abundance.",
    },
    reversed: {
      keywords: [
        "Inner child",
        "Feeling down",
        "Lack of enthusiasm",
        "Sadness",
      ],
      meaning:
        "Your light may be temporarily dimmed by doubt or disappointment. Reconnect with play, joy, and your inner child.",
    },
  },
  {
    id: "judgement",
    number: "XX",
    name: "Judgement",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Judgement", "Rebirth", "Inner calling", "Absolution"],
      meaning:
        "A powerful call to rise up and embrace your higher purpose. Reflect honestly on the past and step into a new, enlightened version of yourself.",
    },
    reversed: {
      keywords: [
        "Self-doubt",
        "Inner critic",
        "Ignoring the call",
        "Harsh judgment",
      ],
      meaning:
        "You may be too hard on yourself or ignoring the universe's invitation to evolve. Release self-judgment and listen to your calling.",
    },
  },
  {
    id: "the_world",
    number: "XXI",
    name: "The World",
    arcana: "major",
    suit: null,
    upright: {
      keywords: ["Completion", "Integration", "Accomplishment", "Wholeness"],
      meaning:
        "A cycle is complete. You've achieved a significant milestone and integrated its lessons. Celebrate before setting off on the next great adventure.",
    },
    reversed: {
      keywords: ["Shortcuts", "Delays", "Seeking closure", "Incompletion"],
      meaning:
        "You may be rushing to the finish line or leaving something unresolved. Tie up loose ends and fully integrate the lessons before moving on.",
    },
  },

  // ── MINOR ARCANA: WANDS (14 cards) ────────────────────────────────────────
  {
    id: "ace_of_wands",
    number: "Ace",
    name: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Inspiration", "New opportunity", "Growth", "Potential"],
      meaning:
        "A spark of creative inspiration arrives. Seize this new beginning with enthusiasm — the universe is handing you a torch to carry forward.",
    },
    reversed: {
      keywords: [
        "Delays",
        "Lack of direction",
        "Distractions",
        "Blocked creativity",
      ],
      meaning:
        "An exciting idea struggles to take root. Remove obstacles and reconnect with your passion before the spark fades.",
    },
  },
  {
    id: "two_of_wands",
    number: "2",
    name: "Two of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Planning", "Future vision", "Decisions", "Discovery"],
      meaning:
        "You've laid a foundation — now plan your next bold move. The world is within your reach; dare to look beyond the horizon.",
    },
    reversed: {
      keywords: [
        "Fear of unknown",
        "Playing it safe",
        "Lack of planning",
        "Misalignment",
      ],
      meaning:
        "Fear of what lies ahead keeps you rooted. Clarify your vision and take that first courageous step into uncharted territory.",
    },
  },
  {
    id: "three_of_wands",
    number: "3",
    name: "Three of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: [
        "Expansion",
        "Foresight",
        "Progress",
        "Overseas opportunities",
      ],
      meaning:
        "Your plans are in motion and the ships are sailing. Look ahead with confidence — growth and expansion are on their way.",
    },
    reversed: {
      keywords: ["Delays", "Playing small", "Lack of foresight", "Obstacles"],
      meaning:
        "Progress stalls or setbacks arise. Reassess your strategy and don't be afraid to take a bigger leap than feels comfortable.",
    },
  },
  {
    id: "four_of_wands",
    number: "4",
    name: "Four of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Celebration", "Joy", "Harmony", "Homecoming"],
      meaning:
        "A time to pause and celebrate your achievements with those you love. Community, belonging, and heartfelt joy surround you.",
    },
    reversed: {
      keywords: [
        "Conflict at home",
        "Transition",
        "Lack of support",
        "Inner harmony",
      ],
      meaning:
        "Tension disrupts the celebration. Seek inner harmony first and work to repair connections before looking for external validation.",
    },
  },
  {
    id: "five_of_wands",
    number: "5",
    name: "Five of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Conflict", "Disagreements", "Competition", "Tension"],
      meaning:
        "Competing energies create friction and discord. Channel this dynamic tension productively — healthy competition can spark growth.",
    },
    reversed: {
      keywords: ["Inner conflict", "Conflict avoidance", "Compromise", "Peace"],
      meaning:
        "The battle may be internal rather than external. Seek resolution and avoid suppressing conflict that genuinely needs addressing.",
    },
  },
  {
    id: "six_of_wands",
    number: "6",
    name: "Six of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: [
        "Success",
        "Public recognition",
        "Progress",
        "Self-confidence",
      ],
      meaning:
        "Victory is yours! Your hard work has paid off and you are being recognized for your achievements. Stand tall and own your success.",
    },
    reversed: {
      keywords: [
        "Fall from grace",
        "Egotism",
        "Lack of recognition",
        "Failure",
      ],
      meaning:
        "Success may be delayed or ego could be undermining your achievements. Stay grounded and let your work speak for itself.",
    },
  },
  {
    id: "seven_of_wands",
    number: "7",
    name: "Seven of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: [
        "Challenge",
        "Perseverance",
        "Defense",
        "Standing your ground",
      ],
      meaning:
        "You must fight for what you believe in and defend your position against challengers. Hold your ground with confidence.",
    },
    reversed: {
      keywords: ["Exhaustion", "Giving up", "Overwhelm", "Retreat"],
      meaning:
        "The relentless competition has worn you down. Know when to stand firm and when to strategically step back and regroup.",
    },
  },
  {
    id: "eight_of_wands",
    number: "8",
    name: "Eight of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Movement", "Speed", "Action", "Alignment"],
      meaning:
        "Things are moving fast! Energy is high and circumstances are aligning. Act quickly and decisively to ride this powerful current.",
    },
    reversed: {
      keywords: ["Delays", "Frustration", "Slow progress", "Miscommunication"],
      meaning:
        "Momentum is blocked or you're moving in too many directions. Slow down, communicate clearly, and wait for the right opening.",
    },
  },
  {
    id: "nine_of_wands",
    number: "9",
    name: "Nine of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Resilience", "Persistence", "Last stand", "Courage"],
      meaning:
        "You're nearly there — battered but still standing. Gather your courage for one final push. The finish line is closer than it looks.",
    },
    reversed: {
      keywords: ["Exhaustion", "Overwhelm", "Defensiveness", "Paranoia"],
      meaning:
        "Fatigue and past wounds are making you overly defensive. Rest and heal before pushing forward. It's okay to ask for help.",
    },
  },
  {
    id: "ten_of_wands",
    number: "10",
    name: "Ten of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Burden", "Responsibility", "Hard work", "Stress"],
      meaning:
        "You've taken on too much and the weight is showing. Success is near, but consider what you can delegate or release to lighten the load.",
    },
    reversed: {
      keywords: ["Releasing burden", "Delegation", "Easing off", "Burned out"],
      meaning:
        "You are close to burnout. Let go of tasks that aren't yours to carry and restore your energy before pressing on.",
    },
  },
  {
    id: "page_of_wands",
    number: "Page",
    name: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Inspiration", "Discovery", "Free spirit", "New ideas"],
      meaning:
        "A young and enthusiastic energy arrives bearing fresh ideas and boundless excitement. Embrace curiosity and explore without limits.",
    },
    reversed: {
      keywords: [
        "Self-limiting beliefs",
        "Hesitation",
        "Scattered energy",
        "Immaturity",
      ],
      meaning:
        "Exciting ideas stall before taking flight due to self-doubt or impulsiveness. Ground your enthusiasm with a practical first step.",
    },
  },
  {
    id: "knight_of_wands",
    number: "Knight",
    name: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Energy", "Passion", "Inspired action", "Adventure"],
      meaning:
        "Bold, fast-moving energy propels you toward your desires. Act on your passion with confidence — but don't forget to plan.",
    },
    reversed: {
      keywords: ["Haste", "Scattered energy", "Delays", "Recklessness"],
      meaning:
        "Passion without direction leads to burnout and mistakes. Channel your fire more deliberately and think before leaping.",
    },
  },
  {
    id: "queen_of_wands",
    number: "Queen",
    name: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Courage", "Confidence", "Independence", "Determination"],
      meaning:
        "A magnetic and courageous presence who leads with heart and conviction. Own your power, trust your instincts, and inspire others.",
    },
    reversed: {
      keywords: ["Self-doubt", "Jealousy", "Demanding", "Burnout"],
      meaning:
        "Insecurity or jealousy may be dimming your natural fire. Return to self-love and remember your inherent power.",
    },
  },
  {
    id: "king_of_wands",
    number: "King",
    name: "King of Wands",
    arcana: "minor",
    suit: "wands",
    upright: {
      keywords: ["Natural leader", "Vision", "Entrepreneur", "Bold action"],
      meaning:
        "A visionary leader who turns ambitious ideas into reality through charisma and decisive action. Step into your role with authority.",
    },
    reversed: {
      keywords: [
        "Impulsiveness",
        "Ruthlessness",
        "High expectations",
        "Arrogance",
      ],
      meaning:
        "Leadership gifts are being misused through arrogance or impulsivity. Temper your fire with patience and empathy for those you lead.",
    },
  },

  // ── MINOR ARCANA: CUPS (14 cards) ─────────────────────────────────────────
  {
    id: "ace_of_cups",
    number: "Ace",
    name: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Love", "New relationships", "Compassion", "Creativity"],
      meaning:
        "An overflowing cup of emotional potential. A new relationship, creative breakthrough, or spiritual gift is available to you now.",
    },
    reversed: {
      keywords: [
        "Self-love",
        "Repressed emotions",
        "Emotional blocks",
        "Emptiness",
      ],
      meaning:
        "Love is being blocked, either by self-neglect or emotional walls. Tend to your inner well before offering your heart to others.",
    },
  },
  {
    id: "two_of_cups",
    number: "2",
    name: "Two of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Partnership", "Mutual attraction", "Connection", "Unity"],
      meaning:
        "A beautiful and equal union — whether romantic, creative, or in business. Two energies find harmony and strengthen each other.",
    },
    reversed: {
      keywords: [
        "Disharmony",
        "Broken communication",
        "Separation",
        "Distrust",
      ],
      meaning:
        "Tension or imbalance disrupts a once-harmonious bond. Open and honest dialogue is needed to restore connection.",
    },
  },
  {
    id: "three_of_cups",
    number: "3",
    name: "Three of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Celebration", "Friendship", "Creativity", "Collaboration"],
      meaning:
        "Time to celebrate with your people! Community, joy, and creative collaboration are highlighted. Lift each other up.",
    },
    reversed: {
      keywords: ["Overindulgence", "Gossip", "Isolation", "Drama"],
      meaning:
        "Social events or group dynamics may be causing drama or encouraging excess. Seek meaningful connection over superficial gatherings.",
    },
  },
  {
    id: "four_of_cups",
    number: "4",
    name: "Four of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Contemplation", "Apathy", "Reevaluation", "Discontent"],
      meaning:
        "Lost in thought, you may be missing what's being offered. Step out of your introspection to see the cup being extended your way.",
    },
    reversed: {
      keywords: [
        "Renewed motivation",
        "Clarity",
        "Awareness",
        "New perspective",
      ],
      meaning:
        "You're emerging from a period of withdrawal with fresh eyes. A new opportunity or direction is now visible — seize it.",
    },
  },
  {
    id: "five_of_cups",
    number: "5",
    name: "Five of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Regret", "Grief", "Disappointment", "Pessimism"],
      meaning:
        "Grief and regret over what has been lost. Remember — not all cups have spilled. Turn and see what remains whole behind you.",
    },
    reversed: {
      keywords: ["Moving on", "Self-forgiveness", "Acceptance", "Recovery"],
      meaning:
        "Healing is underway. You are releasing the sorrow of past losses and turning toward hope and what is still possible.",
    },
  },
  {
    id: "six_of_cups",
    number: "6",
    name: "Six of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Nostalgia", "Childhood memories", "Innocence", "Joy"],
      meaning:
        "A gentle visit to the past — fond memories, childhood innocence, or a reunion. Let the warmth of the past nourish your present.",
    },
    reversed: {
      keywords: [
        "Living in the past",
        "Naivety",
        "Moving forward",
        "Letting go",
      ],
      meaning:
        "Too much focus on the past prevents you from living fully in the present. Honor the memories and then gently release them.",
    },
  },
  {
    id: "seven_of_cups",
    number: "7",
    name: "Seven of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Choices", "Wishful thinking", "Illusion", "Fantasy"],
      meaning:
        "A dazzling array of options and daydreams. Be careful not to get lost in fantasy — ground your vision in reality and choose wisely.",
    },
    reversed: {
      keywords: [
        "Alignment",
        "Clarity",
        "Decision",
        "Cutting through illusion",
      ],
      meaning:
        "The fog of indecision clears. You can now see what truly matters and make a grounded, purposeful choice.",
    },
  },
  {
    id: "eight_of_cups",
    number: "8",
    name: "Eight of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Disappointment", "Abandonment", "Withdrawal", "Moving on"],
      meaning:
        "You are walking away from something that no longer fulfills you. Though painful, this departure is a courageous act of self-respect.",
    },
    reversed: {
      keywords: [
        "Drifting",
        "Fear of commitment",
        "Indecision",
        "Staying too long",
      ],
      meaning:
        "Fear keeps you hovering between staying and leaving. Acknowledge what is no longer working and make a conscious choice.",
    },
  },
  {
    id: "nine_of_cups",
    number: "9",
    name: "Nine of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Contentment", "Satisfaction", "Gratitude", "Wish fulfilled"],
      meaning:
        "The wish card! Emotional satisfaction and the fulfillment of a heartfelt desire. Count your blessings and enjoy this abundance.",
    },
    reversed: {
      keywords: [
        "Materialism",
        "Dissatisfaction",
        "Overindulgence",
        "Inner happiness",
      ],
      meaning:
        "External success hasn't brought the happiness expected. True fulfillment comes from within — look beyond possessions for meaning.",
    },
  },
  {
    id: "ten_of_cups",
    number: "10",
    name: "Ten of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Divine love", "Bliss", "Harmony", "Family"],
      meaning:
        "The ultimate emotional fulfillment — loving relationships, a happy home, and deep alignment with your heart. All is well.",
    },
    reversed: {
      keywords: [
        "Disconnection",
        "Broken family",
        "Struggling relationships",
        "Disharmony",
      ],
      meaning:
        "The dream of harmony is being disrupted by conflict or misalignment. Invest in communication and empathy to rebuild loving bonds.",
    },
  },
  {
    id: "page_of_cups",
    number: "Page",
    name: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: [
        "Creative ideas",
        "Intuitive messages",
        "Curiosity",
        "Sensitivity",
      ],
      meaning:
        "A tender and imaginative energy brings surprising messages from the heart. Trust your intuition and welcome the unexpected.",
    },
    reversed: {
      keywords: [
        "Emotional immaturity",
        "Creative blocks",
        "Doubting intuition",
        "Moodiness",
      ],
      meaning:
        "Emotional sensitivity tips into immaturity or creative blocks. Ground your feelings and trust the quieter voice within.",
    },
  },
  {
    id: "knight_of_cups",
    number: "Knight",
    name: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Romance", "Charm", "Imagination", "Following the heart"],
      meaning:
        "A romantic and idealistic energy sweeps in, guided by feeling and vision. Follow your heart, but stay connected to reality.",
    },
    reversed: {
      keywords: ["Moodiness", "Jealousy", "Unrealistic ideals", "Escapism"],
      meaning:
        "The heart overrules reason, leading to impractical choices or emotional volatility. Bring balance between feeling and thinking.",
    },
  },
  {
    id: "queen_of_cups",
    number: "Queen",
    name: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Compassion", "Care", "Emotional stability", "Intuition"],
      meaning:
        "Emotionally wise and deeply empathic, this energy holds space for others without losing itself. Lead with the heart.",
    },
    reversed: {
      keywords: [
        "Emotional insecurity",
        "Co-dependency",
        "Self-neglect",
        "Martyrdom",
      ],
      meaning:
        "Emotional boundaries are blurred, leading to martyrdom or co-dependency. Practice self-care before caring for others.",
    },
  },
  {
    id: "king_of_cups",
    number: "King",
    name: "King of Cups",
    arcana: "minor",
    suit: "cups",
    upright: {
      keywords: ["Emotional balance", "Compassion", "Diplomacy", "Wisdom"],
      meaning:
        "Mastery of the emotional realm. You lead with wisdom and calm, navigating turbulent waters without losing your composure.",
    },
    reversed: {
      keywords: [
        "Emotional manipulation",
        "Moodiness",
        "Volatility",
        "Repression",
      ],
      meaning:
        "Emotional control slips into manipulation or repression. Reconnect with authentic feeling and lead with compassion, not control.",
    },
  },

  // ── MINOR ARCANA: SWORDS (14 cards) ───────────────────────────────────────
  {
    id: "ace_of_swords",
    number: "Ace",
    name: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Breakthrough", "Mental clarity", "Truth", "New ideas"],
      meaning:
        "A sword cuts through confusion to reveal truth. A breakthrough in thinking, a new idea, or a moment of profound clarity arrives.",
    },
    reversed: {
      keywords: [
        "Clouded judgment",
        "Confusion",
        "Misinformation",
        "Miscommunication",
      ],
      meaning:
        "The mind is foggy and clear thinking is elusive. Pause before making decisions and seek the truth beneath the noise.",
    },
  },
  {
    id: "two_of_swords",
    number: "2",
    name: "Two of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Indecision", "Stalemate", "Impasse", "Avoidance"],
      meaning:
        "A difficult decision is being avoided. Remove the blindfold, gather the facts, and choose — even choosing not to choose has consequences.",
    },
    reversed: {
      keywords: [
        "Information overload",
        "Indecision lifted",
        "Confusion",
        "Delayed decisions",
      ],
      meaning:
        "Too much information creates paralysis. Trust your gut when logic fails and make the call that aligns with your core values.",
    },
  },
  {
    id: "three_of_swords",
    number: "3",
    name: "Three of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Heartbreak", "Grief", "Sorrow", "Emotional pain"],
      meaning:
        "Pain that cuts deep — heartbreak, loss, or betrayal. Allow yourself to grieve fully. This wound, though real, will ultimately heal.",
    },
    reversed: {
      keywords: ["Recovery", "Forgiveness", "Releasing pain", "Moving forward"],
      meaning:
        "The worst has passed and healing begins. Release resentment and forgive — not for others, but for your own liberation.",
    },
  },
  {
    id: "four_of_swords",
    number: "4",
    name: "Four of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Rest", "Recovery", "Contemplation", "Retreat"],
      meaning:
        "Your mind and body need rest. This is not defeat — it is the wisdom to pause, recover, and return stronger than before.",
    },
    reversed: {
      keywords: ["Burnout", "Stagnation", "Restlessness", "Forced rest"],
      meaning:
        "Rest becomes stagnation or burnout forces you to stop. Listen to your body and address root causes before re-engaging.",
    },
  },
  {
    id: "five_of_swords",
    number: "5",
    name: "Five of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Conflict", "Defeat", "Winning at all costs", "Betrayal"],
      meaning:
        "A hollow victory won through aggression or betrayal. Consider whether the battle was worth it and what was truly lost.",
    },
    reversed: {
      keywords: [
        "Reconciliation",
        "Making amends",
        "Moving on",
        "Releasing resentment",
      ],
      meaning:
        "After bitter conflict, an opportunity for reconciliation arrives. Choose to release resentment and rebuild what was broken.",
    },
  },
  {
    id: "six_of_swords",
    number: "6",
    name: "Six of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Transition", "Moving on", "Calmer waters", "Letting go"],
      meaning:
        "You are moving away from turbulence toward calmer shores. This journey may be bittersweet, but calmer waters await you.",
    },
    reversed: {
      keywords: [
        "Resistance to change",
        "Unfinished business",
        "Lingering trauma",
        "Stuck",
      ],
      meaning:
        "Unresolved issues make it difficult to move on. Address what lingers so you can navigate toward the peace you deserve.",
    },
  },
  {
    id: "seven_of_swords",
    number: "7",
    name: "Seven of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Deception", "Betrayal", "Strategy", "Getting away with it"],
      meaning:
        "Trickery, strategic thinking, or someone acting in bad faith. Be alert to deception — by others and, importantly, by yourself.",
    },
    reversed: {
      keywords: [
        "Coming clean",
        "Releasing deception",
        "Conscience",
        "Exposure",
      ],
      meaning:
        "Secrets are coming to light. This is a chance to come clean, make things right, and release the weight of dishonesty.",
    },
  },
  {
    id: "eight_of_swords",
    number: "8",
    name: "Eight of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: [
        "Self-imposed restriction",
        "Victim mentality",
        "Trapped",
        "Fear",
      ],
      meaning:
        "The prison is largely of your own making. The blindfold can be removed and the bindings loosened — the way out begins in your mind.",
    },
    reversed: {
      keywords: ["Freedom", "Release", "Empowerment", "Facing fears"],
      meaning:
        "You are breaking free from the mental cages that once held you. Face your fears with courage and reclaim your autonomy.",
    },
  },
  {
    id: "nine_of_swords",
    number: "9",
    name: "Nine of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Anxiety", "Worry", "Fear", "Nightmares"],
      meaning:
        "The darkest hour before dawn — anxiety and worry run rampant in the mind. Seek support and remember that fear is not fact.",
    },
    reversed: {
      keywords: [
        "Inner turmoil releasing",
        "Facing fears",
        "Hope returning",
        "Healing",
      ],
      meaning:
        "You are beginning to process deep fears and anxieties. Healing is underway — be gentle with yourself in this vulnerable time.",
    },
  },
  {
    id: "ten_of_swords",
    number: "10",
    name: "Ten of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Painful endings", "Betrayal", "Crisis", "Rock bottom"],
      meaning:
        "A painful but final ending. Though this moment is brutal, the darkest point marks the turning — from here, the only way is up.",
    },
    reversed: {
      keywords: ["Recovery", "Regeneration", "Resisting the end", "New dawn"],
      meaning:
        "Survival and slow recovery follow the fall. Refuse to stay down — rise, learn, and begin the ascent with hard-won wisdom.",
    },
  },
  {
    id: "page_of_swords",
    number: "Page",
    name: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: [
        "Curiosity",
        "Thirst for knowledge",
        "New ideas",
        "Sharp mind",
      ],
      meaning:
        "Quick-witted and bursting with ideas, this energy brings news, mental agility, and a desire to learn and communicate.",
    },
    reversed: {
      keywords: ["All talk", "Haphazard action", "Gossip", "Miscommunication"],
      meaning:
        "Sharp words without substance, or clever ideas that never become action. Focus your mental energy before speaking or acting.",
    },
  },
  {
    id: "knight_of_swords",
    number: "Knight",
    name: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Action-oriented", "Driven", "Fast-thinking", "Ambitious"],
      meaning:
        "A charging force of mental energy and decisive action. Act swiftly and boldly — but ensure you've thought through the consequences.",
    },
    reversed: {
      keywords: ["Impulsiveness", "Burn-out", "Recklessness", "Unfocused"],
      meaning:
        "Speed without direction leads to costly mistakes. Slow down, recalibrate, and make sure your charge is toward the right goal.",
    },
  },
  {
    id: "queen_of_swords",
    number: "Queen",
    name: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: [
        "Clear boundaries",
        "Direct communication",
        "Independent",
        "Truth",
      ],
      meaning:
        "Razor-sharp perception and honest communication. This energy cuts through illusion with compassion and calls things as they are.",
    },
    reversed: {
      keywords: ["Overly emotional", "Cold-hearted", "Bitter", "Manipulative"],
      meaning:
        "Pain has hardened the heart into bitterness. Soften without losing your discernment — wisdom and compassion can coexist.",
    },
  },
  {
    id: "king_of_swords",
    number: "King",
    name: "King of Swords",
    arcana: "minor",
    suit: "swords",
    upright: {
      keywords: ["Mental clarity", "Intellectual power", "Authority", "Truth"],
      meaning:
        "A master of logic, fairness, and clear communication. Lead with intellectual integrity and make decisions based on truth.",
    },
    reversed: {
      keywords: [
        "Manipulation",
        "Tyranny",
        "Quiet power",
        "Misuse of authority",
      ],
      meaning:
        "Intelligence is being weaponized for control or manipulation. Realign with ethical principles and use your power justly.",
    },
  },

  // ── MINOR ARCANA: PENTACLES (14 cards) ────────────────────────────────────
  {
    id: "ace_of_pentacles",
    number: "Ace",
    name: "Ace of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: [
        "New financial opportunity",
        "Manifestation",
        "Abundance",
        "Prosperity",
      ],
      meaning:
        "A golden seed is being placed in your hands — a new financial opportunity, career breakthrough, or material gift. Plant it wisely.",
    },
    reversed: {
      keywords: [
        "Missed opportunity",
        "Lack of planning",
        "Poor financial decisions",
        "Scarcity",
      ],
      meaning:
        "An opportunity slips through fingers due to poor planning or fear. Review your financial foundations and try again with more care.",
    },
  },
  {
    id: "two_of_pentacles",
    number: "2",
    name: "Two of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: [
        "Multiple priorities",
        "Time management",
        "Adaptability",
        "Balance",
      ],
      meaning:
        "You are juggling many demands with surprising grace. Stay flexible and prioritize ruthlessly to keep all the balls in the air.",
    },
    reversed: {
      keywords: ["Disorganization", "Over-committed", "Imbalance", "Overwhelm"],
      meaning:
        "Too many plates are spinning and something is about to drop. Simplify your obligations and focus on what truly matters most.",
    },
  },
  {
    id: "three_of_pentacles",
    number: "3",
    name: "Three of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Teamwork", "Collaboration", "Skill", "Implementation"],
      meaning:
        "Great things are built together. Collaboration, craftsmanship, and mutual respect create something far stronger than any solo effort.",
    },
    reversed: {
      keywords: ["Ego", "Disharmony", "Misalignment", "Working alone"],
      meaning:
        "Ego or poor communication disrupts team efforts. Align on shared goals and check your pride at the door to move forward.",
    },
  },
  {
    id: "four_of_pentacles",
    number: "4",
    name: "Four of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Security", "Saving money", "Conservatism", "Control"],
      meaning:
        "Holding on tightly to what you have. Security is important, but ask whether hoarding material wealth is preventing abundance from flowing.",
    },
    reversed: {
      keywords: [
        "Generosity",
        "Releasing control",
        "Greed",
        "Financial insecurity",
      ],
      meaning:
        "Either over-spending or extreme miserliness. Find the healthy middle ground between generosity and wise financial stewardship.",
    },
  },
  {
    id: "five_of_pentacles",
    number: "5",
    name: "Five of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Financial loss", "Isolation", "Poverty mindset", "Hardship"],
      meaning:
        "A difficult period of financial or spiritual hardship. Look up — support and sanctuary may be closer than you realize.",
    },
    reversed: {
      keywords: [
        "Recovery",
        "Improved finances",
        "Spiritual poverty",
        "Finding help",
      ],
      meaning:
        "The tide of hardship is beginning to turn. Financial recovery begins, but examine whether material focus has come at a spiritual cost.",
    },
  },
  {
    id: "six_of_pentacles",
    number: "6",
    name: "Six of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Generosity", "Sharing wealth", "Giving", "Receiving"],
      meaning:
        "Wealth and resources flow freely in acts of generous giving and gracious receiving. True abundance is meant to be shared.",
    },
    reversed: {
      keywords: [
        "One-sided generosity",
        "Debt",
        "Strings attached",
        "Power imbalance",
      ],
      meaning:
        "Charity may come with hidden conditions, or you may be giving more than you can afford. Examine the power dynamics in exchange.",
    },
  },
  {
    id: "seven_of_pentacles",
    number: "7",
    name: "Seven of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Perseverance", "Long-term vision", "Investment", "Patience"],
      meaning:
        "You've been working hard and the harvest is near. Step back, assess your progress, and trust that your patient investment will pay off.",
    },
    reversed: {
      keywords: [
        "Lack of reward",
        "Poor investment",
        "Impatience",
        "Limited vision",
      ],
      meaning:
        "Effort isn't producing the expected results. Reassess your strategy or whether this investment of energy is truly worthwhile.",
    },
  },
  {
    id: "eight_of_pentacles",
    number: "8",
    name: "Eight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Mastery", "Skill development", "Diligence", "Craftsmanship"],
      meaning:
        "Dedicated practice brings mastery. Show up fully every day for your craft — excellence is built one deliberate repetition at a time.",
    },
    reversed: {
      keywords: [
        "Perfectionism",
        "Misdirected effort",
        "Boredom",
        "Lack of focus",
      ],
      meaning:
        "Hard work is being applied to the wrong task, or perfectionism is stalling progress. Refocus your effort with clear intention.",
    },
  },
  {
    id: "nine_of_pentacles",
    number: "9",
    name: "Nine of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: [
        "Abundance",
        "Luxury",
        "Self-sufficiency",
        "Financial independence",
      ],
      meaning:
        "The rewards of hard work are now yours to enjoy. You stand in a place of independence and gracious abundance — savor it.",
    },
    reversed: {
      keywords: [
        "Hustling",
        "Over-investment in work",
        "Self-worth issues",
        "Hollow success",
      ],
      meaning:
        "Success feels hollow, or you are sacrificing wellbeing in pursuit of wealth. True abundance includes rest, joy, and inner peace.",
    },
  },
  {
    id: "ten_of_pentacles",
    number: "10",
    name: "Ten of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Wealth", "Legacy", "Family", "Long-term success"],
      meaning:
        "The pinnacle of material success — lasting wealth, a secure family, and a meaningful legacy built over time. A life well lived.",
    },
    reversed: {
      keywords: [
        "Financial loss",
        "Family conflict",
        "Breaking tradition",
        "Instability",
      ],
      meaning:
        "Family tensions or poor financial decisions threaten long-term security. Rebuild on honest foundations and address conflicts with care.",
    },
  },
  {
    id: "page_of_pentacles",
    number: "Page",
    name: "Page of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: [
        "Manifestation",
        "Financial opportunity",
        "Ambition",
        "Diligence",
      ],
      meaning:
        "An eager and practical energy arrives, ready to learn and work hard. A new financial or educational path is opening up.",
    },
    reversed: {
      keywords: [
        "Procrastination",
        "Lack of progress",
        "Learn from failure",
        "Laziness",
      ],
      meaning:
        "Ambition lacks follow-through. Stop planning and start doing — even small consistent steps build real momentum over time.",
    },
  },
  {
    id: "knight_of_pentacles",
    number: "Knight",
    name: "Knight of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Hard work", "Productivity", "Routine", "Reliability"],
      meaning:
        "Slow, steady, and utterly reliable. This energy shows up every day and does the work — no shortcuts, just solid, consistent progress.",
    },
    reversed: {
      keywords: [
        "Perfectionism",
        "Boredom",
        "Feeling stuck",
        "Self-discipline issues",
      ],
      meaning:
        "Routine has become a rut. Infuse your steady work ethic with a spark of inspiration to reignite your forward momentum.",
    },
  },
  {
    id: "queen_of_pentacles",
    number: "Queen",
    name: "Queen of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Nurturing", "Practical", "Financial security", "Warmth"],
      meaning:
        "Abundant, warm, and grounded — this energy creates a beautiful and secure home while also managing material affairs with skill.",
    },
    reversed: {
      keywords: [
        "Work-life imbalance",
        "Self-neglect",
        "Financial dependence",
        "Smothering",
      ],
      meaning:
        "Caring for others has come at the cost of self-care. Rebalance and tend to your own needs with the same love you give others.",
    },
  },
  {
    id: "king_of_pentacles",
    number: "King",
    name: "King of Pentacles",
    arcana: "minor",
    suit: "pentacles",
    upright: {
      keywords: ["Wealth", "Leadership", "Security", "Entrepreneurship"],
      meaning:
        "The ultimate provider — disciplined, successful, and deeply reliable. Build with patience, lead with generosity, and share your harvest.",
    },
    reversed: {
      keywords: [
        "Obsessed with status",
        "Stubbornness",
        "Materialism",
        "Financial ineptitude",
      ],
      meaning:
        "Wealth and status have become obsessions that crowd out deeper values. Reconnect with what truly matters beyond material success.",
    },
  },
];
