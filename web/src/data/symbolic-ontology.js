/**
 * SYMBOLPATH — CANONICAL SYMBOLIC ONTOLOGY
 * Sprint 3: Complete Intelligence Layer
 *
 * Each archetype is now a structured intelligence entity with:
 *
 *   IDENTITY
 *     core_meaning          — what this symbol IS
 *     emotional_tone        — how it FEELS when active
 *     visual_language       — how it LOOKS in imagery
 *
 *   EXPRESSION
 *     shadow_expression     — its destructive/stuck form
 *     growth_expression     — its healthy/evolved form
 *     associated_behaviors  — real-world correlates
 *
 *   ATMOSPHERE
 *     atmospheric_influence — the emotional weather it creates
 *     ritual_associations   — practices that resonate
 *
 *   DYNAMICS
 *     stabilization_tendency  — how it behaves over time (decay/anchor/oscillate)
 *     typical_duration        — how long it usually stays active
 *     permanence_affinity     — how likely it is to anchor permanently
 *
 *   TOPOLOGY
 *     transition_tendencies   — what it precedes/follows
 *     symbolic_relatives      — its family
 *     counterbalance_symbols  — what naturally balances it
 *
 *   INTERFACE
 *     reflection_prompt       — the question it asks
 *     action_prompt           — the action it suggests
 *
 * This ontology powers:
 *   - The Reasoning Engine (symbolicReasoning.js)
 *   - The Gravity Engine (gravityEngine.js)
 *   - The Longitudinal Engine (longitudinalEngine.js)
 *   - The Narrative Layer (weekly/monthly insights)
 *   - The AI Interpretation Layer
 *   - The Predictive Layer (what comes next)
 *   - The Ritual Layer (what to do)
 */

export const SYMBOLIC_ONTOLOGY = [
  // ═══════════════════════════════════════════════
  // AWAKENING  (ids 1-4)
  // Something new is stirring. Not yet visible.
  // ═══════════════════════════════════════════════

  {
    id: 1,
    symbol: "Seed",
    stage: "Awakening",
    theme: "potential",
    visual: "\uD83C\uDF31",

    // IDENTITY
    core_meaning:
      "Latent potential waiting for conditions to activate. The fullness of what has not yet begun.",
    emotional_tone:
      "Quiet anticipation, vulnerability, not-yet-ness \u2014 the hush before the first move.",
    visual_language:
      "Soil, dormancy, containment, a small shoot pushing through dark earth.",

    // EXPRESSION
    shadow_expression:
      "Paralysis, fear of beginning, over-preparation that becomes permanent postponement.",
    growth_expression:
      "The first genuine movement toward becoming \u2014 permission granted, ground broken.",
    associated_behaviors: [
      "journaling new intentions",
      "withdrawal before action",
      "early-morning reflection",
      "researching without yet starting",
    ],

    // ATMOSPHERE
    atmospheric_influence: "hushed",
    ritual_associations: [
      "planting",
      "intention-setting",
      "new moon ceremony",
      "quiet reflection",
      "soil meditation",
    ],

    // DYNAMICS
    stabilization_tendency:
      "Dissolves quickly if not nurtured. Requires conscious attention to persist past initial impulse.",
    typical_duration:
      "Brief flashes \u2014 days to a week. Either transitions into action or fades back into dormancy.",
    permanence_affinity:
      "Low. Seeds are designed to become something else. Anchoring as Seed suggests a pattern of perpetual beginning without follow-through.",

    // TOPOLOGY
    transition_tendencies: [
      "Often precedes Dawn or Flame",
      "Follows Ouroboros or Abyss as a cycle restarts",
    ],
    symbolic_relatives: ["Dawn", "Egg"],
    counterbalance_symbols: ["Crown", "Tree"],

    // INTERFACE
    reflection_prompt:
      "What within you is ready to stir but hasn't yet been given permission?",
    action_prompt:
      "Name one thing you've been waiting to begin. Begin it today \u2014 even one sentence, one step.",
  },

  {
    id: 2,
    symbol: "Dawn",
    stage: "Awakening",
    theme: "new-beginnings",
    visual: "\uD83C\uDF05",

    core_meaning:
      "The moment awareness breaks through after a period of darkness. Something that could not be seen is now visible.",
    emotional_tone:
      "Hope, fragility, wonder \u2014 the edge of something genuinely new with no guarantee of continuation.",
    visual_language:
      "Horizon, first light, mist, the sky shifting before the sun appears.",

    shadow_expression:
      "False dawns, premature certainty, naive optimism that skips the work of real change.",
    growth_expression:
      "Authentic new beginning after a real ending \u2014 light that follows genuine night, not just sleep.",
    associated_behaviors: [
      "waking up to a new truth",
      "reconnecting after withdrawal",
      "first steps after grief",
      "allowing hope after resignation",
    ],

    atmospheric_influence: "luminous",
    ritual_associations: [
      "sunrise meditation",
      "morning pages",
      "gratitude practice",
      "threshold ceremony",
      "first-light journaling",
    ],

    stabilization_tendency:
      "Fragile. Can be extinguished by premature scrutiny. Needs protection in its early hours.",
    typical_duration:
      "A few days to a week. Dawn is inherently transitional \u2014 it is always becoming morning.",
    permanence_affinity:
      "Very low. Dawn that persists has stopped being dawn. Its purpose is to give way to the day.",

    transition_tendencies: [
      "Often follows Abyss or Storm",
      "Precedes Tree or River as momentum builds",
    ],
    symbolic_relatives: ["Seed", "Lantern"],
    counterbalance_symbols: ["Abyss", "Storm"],

    reflection_prompt:
      "What are you allowing yourself to see for the first time?",
    action_prompt:
      "Greet one thing today as if encountering it completely fresh.",
  },

  {
    id: 3,
    symbol: "Key",
    stage: "Awakening",
    theme: "discovery",
    visual: "\uD83D\uDD11",

    core_meaning:
      "Discovery of access to something previously locked. The realization that you have what is needed to open what was closed.",
    emotional_tone:
      "Curiosity, readiness, the slight weight of a possibility suddenly in your hand.",
    visual_language:
      "Thresholds, locks, doors slightly ajar, a found object that fits an unknown lock.",

    shadow_expression:
      "Hoarding access, refusing to unlock, using knowledge as power over others rather than passage for self.",
    growth_expression:
      "Opening what was closed \u2014 granting yourself the permission you were waiting for someone else to give.",
    associated_behaviors: [
      "seeking teachers or frameworks",
      "unlocking new creative or spiritual practices",
      "research that shifts perspective",
      "recognizing a path forward",
    ],

    atmospheric_influence: "anticipatory",
    ritual_associations: [
      "threshold crossing",
      "unlocking ceremony",
      "discovery journaling",
      "opening meditation",
      "key offering",
    ],

    stabilization_tendency:
      "Moderate. The Key remains active as long as doors remain to be opened. Fades once the passage is made.",
    typical_duration:
      "Days to weeks. Key is the recognition phase \u2014 longer than Seed but shorter than active Growth symbols.",
    permanence_affinity:
      "Low-moderate. Repeated Key patterns may indicate a searching personality \u2014 always seeking the next door rather than entering.",

    transition_tendencies: [
      "Often precedes Bridge or Lantern",
      "Follows Labyrinth when the way through becomes visible",
    ],
    symbolic_relatives: ["Lantern", "Compass"],
    counterbalance_symbols: ["Labyrinth", "Loom"],

    reflection_prompt:
      "What door have you been standing in front of without turning the handle?",
    action_prompt:
      "Take one concrete step toward what you've been circling without entering.",
  },

  {
    id: 4,
    symbol: "Egg",
    stage: "Awakening",
    theme: "incubation",
    visual: "\uD83E\uDD5A",

    core_meaning:
      "Protected incubation of something not yet ready to be named or seen. Development that must occur in private before it can be shared.",
    emotional_tone:
      "Containment, patient unknowing, the invisible pressure of becoming.",
    visual_language:
      "Shells, nests, warmth, enclosure, the form of the hidden thing just visible through translucence.",

    shadow_expression:
      "Permanent hiding, refusal to hatch, calcification into the safety of enclosure.",
    growth_expression:
      "Trusting the unseen process of formation \u2014 knowing that ripeness cannot be forced.",
    associated_behaviors: [
      "private projects",
      "dreams not yet shareable",
      "inner work without external expression",
      "creative gestation",
    ],

    atmospheric_influence: "contained",
    ritual_associations: [
      "silence practice",
      "gestation journaling",
      "patience meditation",
      "container ceremony",
      "dark room retreat",
    ],

    stabilization_tendency:
      "Stable while conditions support incubation. Cracks under external pressure. Naturally self-terminating when ready to hatch.",
    typical_duration:
      "Weeks to months. Egg is the longest-duration Awakening symbol \u2014 incubation cannot be rushed.",
    permanence_affinity:
      "Low-moderate. An anchored Egg signals chronic avoidance of birth \u2014 potential that never becomes kinetic.",

    transition_tendencies: [
      "Often precedes Seed or Flame",
      "A longer incubation before Awakening moves into Growth",
    ],
    symbolic_relatives: ["Seed", "Phoenix"],
    counterbalance_symbols: ["Flame", "Storm"],

    reflection_prompt:
      "What are you carrying that isn't ready to be seen yet \u2014 and is that okay?",
    action_prompt:
      "Protect your developing idea or self for one more week before exposing it to outside input.",
  },

  // ═══════════════════════════════════════════════
  // GROWTH  (ids 5-9)
  // Expansion. Building. Momentum that requires effort.
  // ═══════════════════════════════════════════════

  {
    id: 5,
    symbol: "Tree",
    stage: "Growth",
    theme: "resilience",
    visual: "\uD83C\uDF33",

    core_meaning:
      "Slow, rooted growth through cycles \u2014 strength built through endurance and weathering rather than speed.",
    emotional_tone:
      "Steadiness, quiet confidence, the long patience of something that cannot be hurried.",
    visual_language:
      "Growth rings, deep roots, wide canopy, bark weathered by seasons, the shape earned over decades.",

    shadow_expression:
      "Rigidity, refusal to bend in necessary wind, rooted in soil that is no longer nourishing.",
    growth_expression:
      "Flexible strength \u2014 yielding without breaking, growing wider and deeper through storms rather than despite them.",
    associated_behaviors: [
      "long-term projects",
      "relationship deepening over time",
      "consistent practice without dramatic results",
      "returning to fundamentals",
    ],

    atmospheric_influence: "grounding",
    ritual_associations: [
      "grounding meditation",
      "nature walk",
      "root visualization",
      "soil connection",
      "patience practice",
      "seasonal awareness",
    ],

    stabilization_tendency:
      "Highly stable. Gains weight slowly but loses it even more slowly. Tree is the most naturally persistent Growth symbol.",
    typical_duration:
      "Weeks to months. Tree energy builds gradually and sustains across seasons.",
    permanence_affinity:
      "High. Tree is among the most likely symbols to anchor. Rooted growth resists decay naturally.",

    transition_tendencies: [
      "Often follows Seed or Dawn",
      "Precedes Bridge or Mountain as momentum becomes directional",
    ],
    symbolic_relatives: ["River", "Mountain"],
    counterbalance_symbols: ["Storm", "Flame"],

    reflection_prompt:
      "Where are you growing slowly but surely, even if no one can see it yet?",
    action_prompt:
      "Invest time in something today that will matter in five years, not five days.",
  },

  {
    id: 6,
    symbol: "River",
    stage: "Growth",
    theme: "flow",
    visual: "\uD83C\uDFDE\uFE0F",

    core_meaning:
      "Movement through continuous, adaptive flow. The path of least resistance \u2014 not weakness, but intelligence of direction.",
    emotional_tone:
      "Ease, trust, momentum \u2014 the relief of movement that does not require forcing.",
    visual_language:
      "Current, banks that define without confining, stones smoothed by water, tributaries joining the main flow.",

    shadow_expression:
      "Stagnation, backtracking, flooding without banks \u2014 expansion without form.",
    growth_expression:
      "Flowing around obstacles rather than through them \u2014 discovering that the long way around is sometimes the only path forward.",
    associated_behaviors: [
      "creative work entering a productive phase",
      "collaboration and co-creation",
      "releasing control over timing",
      "trusting process over outcome",
    ],

    atmospheric_influence: "fluid",
    ritual_associations: [
      "water meditation",
      "flow journaling",
      "surrender practice",
      "stream walking",
      "releasing ceremony",
    ],

    stabilization_tendency:
      "Moderate. River energy flows naturally but can dry up or flood. Needs banks (structure) to remain productive.",
    typical_duration:
      "Days to weeks. Flow states are inherently periodic \u2014 they arrive, sustain, and recede.",
    permanence_affinity:
      "Moderate. Anchored River suggests a personality of adaptive ease \u2014 one of the healthier anchor patterns.",

    transition_tendencies: [
      "Often precedes Bridge or Compass",
      "Follows Dawn as energy begins to move",
    ],
    symbolic_relatives: ["Tree", "Chalice"],
    counterbalance_symbols: ["Mountain", "Tower"],

    reflection_prompt:
      "Where are you forcing movement instead of allowing flow?",
    action_prompt:
      "Identify one place where your resistance is creating friction. Release your grip on it today.",
  },

  {
    id: 7,
    symbol: "Flame",
    stage: "Growth",
    theme: "passion",
    visual: "\uD83D\uDD25",

    core_meaning:
      "Passionate engagement with something that matters. The energy of transformation through heat and light \u2014 presence that changes what it touches.",
    emotional_tone:
      "Intensity, aliveness, urgency, joy in effort \u2014 the feeling of being fully used.",
    visual_language:
      "Embers and sparks, warmth at the edge of shadow, brightness that casts its own dark.",

    shadow_expression:
      "Burnout, consumption beyond what was intended, the destruction of what was only meant to be warmed.",
    growth_expression:
      "Sustained warmth \u2014 the steady fire that illuminates without destroying, that gives heat without needing to burn.",
    associated_behaviors: [
      "creative output entering peak",
      "advocacy and full commitment",
      "romantic intensity",
      "the beginning of new deep investment",
    ],

    atmospheric_influence: "electric",
    ritual_associations: [
      "candle meditation",
      "fire ceremony",
      "passion journaling",
      "creative sprints",
      "devotional practice",
    ],

    stabilization_tendency:
      "Volatile. Burns hot but decays fast without fuel. The most oscillating Growth symbol \u2014 prone to flare and collapse cycles.",
    typical_duration:
      "Short intense bursts \u2014 days to a few weeks. Sustained Flame requires deliberate fueling.",
    permanence_affinity:
      "Low-moderate. Anchored Flame may indicate chronic intensity \u2014 always burning, never sustaining. The shadow of permanent passion.",

    transition_tendencies: [
      "Often precedes Storm when intensity exceeds structure",
      "Follows Seed as potential catches spark",
    ],
    symbolic_relatives: ["Phoenix", "Storm"],
    counterbalance_symbols: ["River", "Scale"],

    reflection_prompt:
      "What are you burning for right now? Is the fire warming you or consuming you?",
    action_prompt:
      "Channel your intensity into one focused act today. One thing, completely.",
  },

  {
    id: 8,
    symbol: "Bridge",
    stage: "Growth",
    theme: "transition",
    visual: "\uD83C\uDF09",

    core_meaning:
      "The crossing between two distinct states. A transition that requires commitment to complete \u2014 you cannot remain on the bridge.",
    emotional_tone:
      "Courage, in-between-ness, the vertigo of a crossing with no return to where you began.",
    visual_language:
      "Span, height, two shores, water or air below, wind from both directions.",

    shadow_expression:
      "Living on the bridge permanently \u2014 claiming transition as a home, refusing to land on either side.",
    growth_expression:
      "Making the crossing fully \u2014 leaving one shore with intention and arriving at the other with presence.",
    associated_behaviors: [
      "major life transitions",
      "relationship shifts that change their nature",
      "career pivots",
      "geographic moves",
      "committing to change that cannot be undone",
    ],

    atmospheric_influence: "liminal",
    ritual_associations: [
      "threshold ceremony",
      "farewell ritual",
      "crossing meditation",
      "bridge walking",
      "letting-go practice",
    ],

    stabilization_tendency:
      "Self-terminating. Bridge is designed to be crossed, not inhabited. Weight decays naturally once the transition completes.",
    typical_duration:
      "Days to weeks. Extended Bridge periods indicate resistance to completing the crossing.",
    permanence_affinity:
      "Very low. Anchored Bridge is a red flag \u2014 it means permanent liminality, never arriving anywhere.",

    transition_tendencies: [
      "Often follows Key or River",
      "Precedes Tree or Scale \u2014 arrival requiring new roots or new balance",
    ],
    symbolic_relatives: ["Key", "River"],
    counterbalance_symbols: ["Tree", "Crown"],

    reflection_prompt:
      "What shore are you still standing on that you've already decided to leave?",
    action_prompt:
      "Take one step that commits you to the crossing rather than preserving the option to return.",
  },

  {
    id: 9,
    symbol: "Mountain",
    stage: "Growth",
    theme: "ambition",
    visual: "\u26F0\uFE0F",

    core_meaning:
      "The long ascent toward a clear goal. Strength built through sustained effort across elevation and weather.",
    emotional_tone:
      "Determination, altitude, the ache and satisfaction of sustained effort toward a visible peak.",
    visual_language:
      "Trail, altitude, weather that changes with height, the view that expands the higher you go.",

    shadow_expression:
      "Summit obsession that misses the view along the way, domination of landscape rather than inhabiting it.",
    growth_expression:
      "The climb as the purpose \u2014 each step as the destination, the summit as confirmation rather than the point.",
    associated_behaviors: [
      "goal-driven long projects",
      "physical practice and training",
      "ambitious creative or professional work",
      "sustained daily commitment over months",
    ],

    atmospheric_influence: "elevating",
    ritual_associations: [
      "summit visualization",
      "endurance practice",
      "milestone celebration",
      "altitude meditation",
      "peak journaling",
    ],

    stabilization_tendency:
      "Steady climber. Gains weight consistently with sustained effort. Loses momentum sharply if effort stops \u2014 no coasting on Mountain.",
    typical_duration:
      "Weeks to months. Mountain demands sustained investment and rewards persistence.",
    permanence_affinity:
      "Moderate-high. Mountain anchors through sheer accumulated effort. An anchored Mountain represents deep ambition integrated into identity.",

    transition_tendencies: [
      "Often precedes Storm when the summit demands more than expected",
      "Follows Tree as steady growth becomes directed effort",
    ],
    symbolic_relatives: ["Tree", "Crown"],
    counterbalance_symbols: ["River", "Abyss"],

    reflection_prompt:
      "Are you climbing toward something worth the effort? Do you still want what's at the top?",
    action_prompt:
      "Describe the view from the summit. If it's still what you want, take today's step.",
  },

  // ═══════════════════════════════════════════════
  // CRISIS  (ids 10-15)
  // Tension, pressure, the breaking open of what was closed.
  // ═══════════════════════════════════════════════

  {
    id: 10,
    symbol: "Storm",
    stage: "Crisis",
    theme: "upheaval",
    visual: "\u26C8\uFE0F",

    core_meaning:
      "Disruptive force that dismantles the unsustainable to make way for new form. The pressure that has been building in the system, released.",
    emotional_tone:
      "Turbulence, pressure, the edge of overwhelm \u2014 with hidden electricity underneath.",
    visual_language:
      "Lightning, driving rain, rupture, the charged quality of air before and after.",

    shadow_expression:
      "Chaos as identity, destruction without resolution, emotional flooding that prevents the air from clearing.",
    growth_expression:
      "Necessary breakthrough \u2014 the storm that clears the air, the pressure that breaks a fever.",
    associated_behaviors: [
      "sudden confrontations",
      "emotional crises that erupt after long suppression",
      "sudden endings",
      "situations reaching a breaking point",
    ],

    atmospheric_influence: "turbulent",
    ritual_associations: [
      "release ceremony",
      "grief work",
      "storm watching",
      "cathartic writing",
      "cleansing ritual",
      "breath of fire",
    ],

    stabilization_tendency:
      "Decays slowly despite its explosive nature. Storm energy lingers in the system like atmospheric pressure. Harder to clear than expected.",
    typical_duration:
      "Short intense bursts \u2014 days to two weeks. But aftershocks can persist for weeks after the main event.",
    permanence_affinity:
      "Moderate-high. Crisis symbols anchor at lower thresholds because they leave deeper impressions. Storm is especially prone to anchoring in people with unresolved disruption patterns.",

    transition_tendencies: [
      "Often precedes Lantern or Dawn as clarity follows disruption",
      "Follows Flame or Mountain when intensity exceeds structure",
    ],
    symbolic_relatives: ["Mirror", "Flame"],
    counterbalance_symbols: ["Scale", "River", "Tree"],

    reflection_prompt: "What structure is no longer sustainable?",
    action_prompt:
      "Release your resistance to necessary change. Name what the storm is asking you to let go of.",
  },

  {
    id: 11,
    symbol: "Tower",
    stage: "Crisis",
    theme: "collapse",
    visual: "\uD83C\uDFDA\uFE0F",

    core_meaning:
      "Sudden collapse of a structure built on false foundation. Not random destruction \u2014 the inevitable fall of what could not hold.",
    emotional_tone:
      "Shock, destabilization, the vertigo of collapse \u2014 and underneath it, the strange relief of something that was always going to fall.",
    visual_language:
      "Falling structures, the moment before impact, lightning strike, cleared land, debris that reveals ground.",

    shadow_expression:
      "Rebuilding the same tower on the same foundation; using shock as reason to never build again.",
    growth_expression:
      "Liberation \u2014 what falls was always going to fall. Now you can build on ground that is actually true.",
    associated_behaviors: [
      "sudden endings of relationships, careers, or beliefs",
      "revelation of hidden truths that change everything",
      "external events that force internal restructuring",
    ],

    atmospheric_influence: "seismic",
    ritual_associations: [
      "demolition meditation",
      "rubble clearing",
      "foundation journaling",
      "grief ceremony",
      "truth-telling practice",
    ],

    stabilization_tendency:
      "Acute and sharp. Decays relatively fast after the initial shock. The tower falls once \u2014 its energy is in the aftermath.",
    typical_duration:
      "Very short \u2014 hours to days for the collapse itself. The rebuilding phase is what takes time.",
    permanence_affinity:
      "Moderate. Anchored Tower suggests repeated structural failures \u2014 a pattern of building on false foundations.",

    transition_tendencies: [
      "Often precedes Abyss when there is nothing left to stand on",
      "Follows Mountain when summit ambition outpaces foundation",
    ],
    symbolic_relatives: ["Storm", "Abyss"],
    counterbalance_symbols: ["Tree", "Loom"],

    reflection_prompt:
      "What did you build on a foundation that couldn't hold the weight you placed on it?",
    action_prompt:
      "Clear the rubble before laying new stone. Don't build on what just fell.",
  },

  {
    id: 12,
    symbol: "Labyrinth",
    stage: "Crisis",
    theme: "confusion",
    visual: "\uD83C\uDF00",

    core_meaning:
      "Disorientation within complexity. The loss of clear direction \u2014 not from failure but from being inside a system whose logic you cannot yet see.",
    emotional_tone:
      "Confusion, circling, the frustration of movement that produces no visible progress.",
    visual_language:
      "Walls that repeat, turning paths, the echo of your own movement, no clear sky above.",

    shadow_expression:
      "Resignation to the maze, frantic searching without method, mapping the wrong problem entirely.",
    growth_expression:
      "Trusting the path despite not seeing the exit \u2014 knowing that the labyrinth has a center and a way out, even when neither is visible.",
    associated_behaviors: [
      "mental spiraling",
      "over-analysis and decision paralysis",
      "lost sense of direction or purpose",
      "feeling lost inside a system you once understood",
    ],

    atmospheric_influence: "disorienting",
    ritual_associations: [
      "labyrinth walking",
      "single-thread meditation",
      "simplification practice",
      "compass journaling",
      "thread-following exercise",
    ],

    stabilization_tendency:
      "Oscillating. Labyrinth energy ebbs and flows as clarity momentarily surfaces then submerges again. Unstable until the exit is found.",
    typical_duration:
      "Weeks. Labyrinth is the longest-duration Crisis symbol \u2014 confusion takes time to resolve.",
    permanence_affinity:
      "Moderate. Anchored Labyrinth indicates chronic confusion \u2014 a personality that has mistaken the maze for the world.",

    transition_tendencies: [
      "Often precedes Mirror when the confusion leads inward",
      "Follows Tower when what was known is suddenly unknown",
    ],
    symbolic_relatives: ["Mirror", "Serpent"],
    counterbalance_symbols: ["Compass", "Key", "Lantern"],

    reflection_prompt:
      "Are you lost \u2014 or are you deeper into the center than you've ever been before?",
    action_prompt: "Stop mapping. Pick one thread and follow it.",
  },

  {
    id: 13,
    symbol: "Serpent",
    stage: "Crisis",
    theme: "transformation",
    visual: "\uD83D\uDC0D",

    core_meaning:
      "Transformation through shedding \u2014 the death of the old self as a literal requirement for the emergence of the new one.",
    emotional_tone:
      "Liminality, the rawness of an identity in mid-molt, dangerous aliveness during exposure.",
    visual_language:
      "Shed skin, the coil, the rawness of emergence, the moment before the old form falls away entirely.",

    shadow_expression:
      "Endless shedding with no integration \u2014 transformation as performance rather than genuine renewal.",
    growth_expression:
      "Embodied renewal \u2014 becoming genuinely new through full release of the old form, not just talking about change.",
    associated_behaviors: [
      "identity shifts that can't be undone",
      "leaving relationships or roles that defined you",
      "radical reinvention",
      "the discomfort of becoming someone you don't yet recognize",
    ],

    atmospheric_influence: "raw",
    ritual_associations: [
      "shedding ceremony",
      "skin release meditation",
      "identity journaling",
      "rebirth ritual",
      "letting-go-of-old-self practice",
    ],

    stabilization_tendency:
      "Accelerating decay. Serpent energy intensifies as the old form falls away, then drops sharply once the shedding is complete. High-energy but self-limiting.",
    typical_duration:
      "Days to weeks. The shedding itself is fast \u2014 the exposure afterward is what lingers.",
    permanence_affinity:
      "Low. Anchored Serpent means perpetual transformation without integration \u2014 always becoming, never arriving.",

    transition_tendencies: [
      "Often precedes Scale or Lantern \u2014 new form finding new ground",
      "Follows Tower or Labyrinth after the old structure falls",
    ],
    symbolic_relatives: ["Phoenix", "Ouroboros"],
    counterbalance_symbols: ["Scale", "Loom", "Tree"],

    reflection_prompt:
      "What version of yourself are you still wearing that no longer fits?",
    action_prompt:
      "Name one belief you've already outgrown. Stop defending it.",
  },

  {
    id: 14,
    symbol: "Mirror",
    stage: "Crisis",
    theme: "self-awareness",
    visual: "\uD83E\uDE9E",

    core_meaning:
      "Confrontation with one's own reflection \u2014 the moment of unavoidable self-knowing that crisis produces.",
    emotional_tone:
      "Discomfort, recognition, the specific ache of honest self-seeing \u2014 and the strange relief underneath it.",
    visual_language:
      "Reflection, glass, silver, the moment of recognition that cannot be unfelt.",

    shadow_expression:
      "Narcissism, self-loathing, endless self-examination that becomes substitution for action.",
    growth_expression:
      "Compassionate witness \u2014 seeing clearly and not looking away, with neither self-inflation nor self-punishment.",
    associated_behaviors: [
      "therapy",
      "journaling that breaks through surface narrative",
      "confronting long-avoided patterns",
      "receiving honest feedback",
    ],

    atmospheric_influence: "revealing",
    ritual_associations: [
      "mirror meditation",
      "self-inquiry practice",
      "shadow journaling",
      "honest conversation",
      "witness meditation",
    ],

    stabilization_tendency:
      "Persistent. Mirror energy lingers because self-knowledge, once gained, cannot be un-seen. Decays only when the insight is integrated.",
    typical_duration:
      "Days to weeks. Individual Mirror moments are brief, but the accumulated self-awareness persists.",
    permanence_affinity:
      "Moderate-high. Mirror frequently anchors because self-awareness is one of the more durable psychological patterns.",

    transition_tendencies: [
      "Often precedes Serpent or Scale as self-knowledge enables change",
      "Follows Labyrinth when inward reflection becomes the only path forward",
    ],
    symbolic_relatives: ["Lantern", "Scale"],
    counterbalance_symbols: ["River", "Chalice"],

    reflection_prompt:
      "What truth about yourself are you still refusing to see?",
    action_prompt:
      "Say the honest thing \u2014 to yourself first, before anyone else.",
  },

  {
    id: 15,
    symbol: "Abyss",
    stage: "Crisis",
    theme: "the-unknown",
    visual: "\uD83D\uDD73\uFE0F",

    core_meaning:
      "The void \u2014 total dissolution of certainty, identity, or meaning. The deepest point of the descent.",
    emotional_tone:
      "Emptiness, freefall, the absence of all known coordinates \u2014 and the strange, distant stars visible only from this depth.",
    visual_language:
      "Depth, darkness without a floor, the strange stillness of absolute depth, stars only visible from within.",

    shadow_expression:
      "Wallowing, nihilism, using the void as permanent shelter against the vulnerability of meaning.",
    growth_expression:
      "Surrender \u2014 allowing total dissolution as the only genuine gateway to new form. What you cannot hold down here, you do not need.",
    associated_behaviors: [
      "grief",
      "depression or spiritual emergency",
      "profound uncertainty about identity or future",
      "the quiet after catastrophic loss",
    ],

    atmospheric_influence: "abyssal",
    ritual_associations: [
      "darkness meditation",
      "void sitting",
      "grief ceremony",
      "deep rest",
      "surrender practice",
      "silence retreat",
    ],

    stabilization_tendency:
      "Deep and slow. Abyss energy does not decay quickly \u2014 it occupies space that other symbols cannot reach. Must be risen from, not waited out.",
    typical_duration:
      "Weeks to months. Abyss is the longest-enduring Crisis symbol. Attempting to shorten it artificially produces false dawns.",
    permanence_affinity:
      "High. The Abyss anchors easily because it represents fundamental existential encounters. Deeply anchored Abyss may be the most psychologically significant pattern.",

    transition_tendencies: [
      "Often precedes Dawn or Seed \u2014 the deepest dark before genuine new beginning",
      "Follows Tower or Storm at their most complete",
    ],
    symbolic_relatives: ["Tower", "Dawn"],
    counterbalance_symbols: ["Dawn", "Star", "Lantern"],

    reflection_prompt:
      "Can you allow yourself to not know who you are right now?",
    action_prompt: "Don't fill the silence. Stay with what is actually here.",
  },

  // ═══════════════════════════════════════════════
  // INTEGRATION  (ids 16-19)
  // Absorbing. Finding meaning. Restoring direction.
  // ═══════════════════════════════════════════════

  {
    id: 16,
    symbol: "Loom",
    stage: "Integration",
    theme: "weaving",
    visual: "\uD83E\uDDF5",

    core_meaning:
      "Weaving disparate threads \u2014 past and present, self and experience \u2014 into coherent pattern. The active work of making sense.",
    emotional_tone:
      "Patient engagement, the quiet satisfaction of things beginning to cohere, careful and deliberate assembly.",
    visual_language:
      "Threads, warp and weft, the pattern emerging from what looked like noise, hands steady at the work.",

    shadow_expression:
      "Over-complicating, weaving without purpose, using tangled threads as identity rather than material.",
    growth_expression:
      "Seeing the pattern in what seemed like chaos \u2014 the recognition that the design was always there, waiting to be woven into visibility.",
    associated_behaviors: [
      "meaning-making through reflection",
      "journaling synthesis",
      "therapy after crisis",
      "creative integration of disparate influences",
    ],

    atmospheric_influence: "weaving",
    ritual_associations: [
      "pattern journaling",
      "synthesis meditation",
      "thread ceremony",
      "tapestry visualization",
      "connection mapping",
    ],

    stabilization_tendency:
      "Steady accumulator. Loom gains weight gradually through the act of integration itself. Each woven thread adds stability.",
    typical_duration:
      "Weeks. Loom work cannot be rushed \u2014 it's the patient labor of meaning-making.",
    permanence_affinity:
      "Moderate-high. Loom anchors naturally because integration is inherently stabilizing. An anchored Loom represents a personality that makes meaning habitually.",

    transition_tendencies: [
      "Often precedes Scale or Star as pattern clarifies into direction",
      "Follows Serpent or Mirror as new form needs new structure",
    ],
    symbolic_relatives: ["Scale", "Compass"],
    counterbalance_symbols: ["Storm", "Flame"],

    reflection_prompt:
      "What threads from your past are you only now seeing as part of one pattern?",
    action_prompt:
      "Name three experiences that seemed unrelated. Find what they share.",
  },

  {
    id: 17,
    symbol: "Scale",
    stage: "Integration",
    theme: "balance",
    visual: "\u2696\uFE0F",

    core_meaning:
      "The return to equilibrium after imbalance. Discernment and right weighting \u2014 knowing what deserves priority and what does not.",
    emotional_tone:
      "Steadiness, careful deliberation, the specific relief of finding center after a long period off-balance.",
    visual_language:
      "Two pans, weight, stillness at the pivot point, the act of measurement becoming the act of choice.",

    shadow_expression:
      "Indecision as virtue, false balance that avoids choosing, weighing endlessly without committing to a verdict.",
    growth_expression:
      "Calibrated wisdom \u2014 the capacity to weigh accurately and choose accordingly, without needing certainty before deciding.",
    associated_behaviors: [
      "decision-making after crisis",
      "re-prioritizing what matters",
      "setting new values explicitly",
      "saying no to what no longer deserves weight",
    ],

    atmospheric_influence: "centering",
    ritual_associations: [
      "balance meditation",
      "priority journaling",
      "equinox ceremony",
      "weight-placing practice",
      "centering exercise",
    ],

    stabilization_tendency:
      "Self-regulating. Scale naturally seeks equilibrium. Weight oscillates gently around center rather than drifting.",
    typical_duration:
      "Days to weeks. Scale achieves its purpose relatively quickly once the weighing begins.",
    permanence_affinity:
      "Moderate. Anchored Scale represents calibrated judgment as a permanent character trait \u2014 generally positive unless it becomes chronic indecision.",

    transition_tendencies: [
      "Often precedes Compass or Crown as clarity enables direction",
      "Follows Serpent or Loom as new form finds its ground",
    ],
    symbolic_relatives: ["Mirror", "Loom"],
    counterbalance_symbols: ["Storm", "Flame"],

    reflection_prompt:
      "What are you still giving equal weight that doesn't deserve it?",
    action_prompt:
      "Make one decision you've been deferring. Trust your calibration.",
  },

  {
    id: 18,
    symbol: "Lantern",
    stage: "Integration",
    theme: "guidance",
    visual: "\uD83C\uDFEE",

    core_meaning:
      "Portable light \u2014 the ability to carry illumination through darkness as a guide for self and others. Earned clarity.",
    emotional_tone:
      "Quiet clarity, purposeful warmth, groundedness that comes only from having walked through real darkness.",
    visual_language:
      "Warm circle of light, shadows held gently at bay, the one who carries fire through the dark for others.",

    shadow_expression:
      "Shining light to avoid darkness within \u2014 performing wisdom rather than embodying it.",
    growth_expression:
      "Authentic guidance \u2014 illuminating without overwhelming, steady in uncertainty, carrying fire without needing to control where it falls.",
    associated_behaviors: [
      "mentorship from lived experience",
      "teaching what you've survived",
      "offering clarity to others in their confusion",
      "returning to help who you were before",
    ],

    atmospheric_influence: "illuminating",
    ritual_associations: [
      "lantern lighting",
      "guidance meditation",
      "wisdom journaling",
      "mentorship practice",
      "clarity ceremony",
    ],

    stabilization_tendency:
      "Warm and persistent. Lantern energy sustains naturally because earned wisdom resists decay. One of the most stable Integration symbols.",
    typical_duration:
      "Weeks to months. Lantern energy lasts because it's fed by the act of guiding.",
    permanence_affinity:
      "High. Lantern is among the most likely Integration symbols to anchor. Earned clarity tends to persist.",

    transition_tendencies: [
      "Often precedes Star or Crown as integrated wisdom becomes active presence",
      "Follows Storm or Abyss as the clarity that crisis eventually produces",
    ],
    symbolic_relatives: ["Dawn", "Key"],
    counterbalance_symbols: ["Abyss", "Labyrinth"],

    reflection_prompt:
      "What can you illuminate for others because you've walked through that darkness yourself?",
    action_prompt:
      "Share what you've learned \u2014 not to teach, but to offer.",
  },

  {
    id: 19,
    symbol: "Compass",
    stage: "Integration",
    theme: "direction",
    visual: "\uD83E\uDDED",

    core_meaning:
      "Internalized direction \u2014 finding true north from within rather than from external reference. The restoration of self-trust.",
    emotional_tone:
      "Orientation, the quiet confidence of re-established self-trust, the relief of knowing where you are going again.",
    visual_language:
      "The needle finding north, magnetic certainty, the quiet pointing of a thing that does not need to be told which way is true.",

    shadow_expression:
      "Compulsive navigation, distrust of stillness, constant recalibration that substitutes for actual movement.",
    growth_expression:
      "Moving from inner guidance \u2014 no longer needing external validation to know which way is right.",
    associated_behaviors: [
      "returning to values after crisis destabilized them",
      "renewed sense of purpose",
      "directional clarity after long confusion",
      "trusting your own read of a situation",
    ],

    atmospheric_influence: "orienting",
    ritual_associations: [
      "direction meditation",
      "values journaling",
      "north star visualization",
      "purpose ceremony",
      "compass walking",
    ],

    stabilization_tendency:
      "Steady once calibrated. Compass energy persists as long as the direction feels true. Can be disrupted by major value shifts.",
    typical_duration:
      "Weeks. Compass sustains through periods of directional clarity and fades during confusion.",
    permanence_affinity:
      "Moderate. Anchored Compass represents deep self-trust as character trait \u2014 knowing your own direction reliably.",

    transition_tendencies: [
      "Often precedes Crown or Star as integrated direction becomes expressed authority",
      "Follows Scale or Loom as clarity of values enables clarity of direction",
    ],
    symbolic_relatives: ["Key", "Scale"],
    counterbalance_symbols: ["Labyrinth", "Abyss"],

    reflection_prompt:
      "If you trusted your own sense of direction completely, where would you go?",
    action_prompt:
      "Take one step toward what your compass has already been pointing to.",
  },

  // ═══════════════════════════════════════════════
  // MASTERY  (ids 20-24)
  // Embodied wisdom. Completion. The cycle made whole.
  // ═══════════════════════════════════════════════

  {
    id: 20,
    symbol: "Crown",
    stage: "Mastery",
    theme: "sovereignty",
    visual: "\uD83D\uDC51",

    core_meaning:
      "The full assumption of one's authority and sovereign identity. Power that has been earned through the whole journey.",
    emotional_tone:
      "Presence, dignity, earned ease \u2014 and the quiet weight of genuine responsibility.",
    visual_language:
      "Height, weight, the head held still, clarity of silhouette, the earned ornament.",

    shadow_expression:
      "Domination, entitlement, sovereignty without accountability \u2014 power used to control rather than serve.",
    growth_expression:
      "Responsible power \u2014 wearing authority as service, acting from the fullness of who you've become without apology or performance.",
    associated_behaviors: [
      "leadership from genuine experience",
      "taking full ownership of creative or professional territory",
      "acting from authority without disclaimers",
      "public voice or creative signature",
    ],

    atmospheric_influence: "sovereign",
    ritual_associations: [
      "coronation ceremony",
      "authority meditation",
      "sovereignty journaling",
      "leadership practice",
      "dignified self-presentation",
    ],

    stabilization_tendency:
      "Highly stable once earned. Crown energy sustains through embodiment \u2014 it resists decay because it represents integrated identity.",
    typical_duration:
      "Months to permanent. Crown is one of the most enduring Mastery symbols.",
    permanence_affinity:
      "Very high. Crown is designed to anchor \u2014 sovereignty earned is sovereignty kept.",

    transition_tendencies: [
      "Often precedes Ouroboros or new Seed \u2014 completion that circles back",
      "Follows Compass or Mountain as direction and effort become embodied capacity",
    ],
    symbolic_relatives: ["Star", "Phoenix"],
    counterbalance_symbols: ["Abyss", "Mirror"],

    reflection_prompt:
      "Where are you waiting for permission to be who you already are?",
    action_prompt:
      "Act from your full authority in one area today. No disclaimers, no hedging.",
  },

  {
    id: 21,
    symbol: "Phoenix",
    stage: "Mastery",
    theme: "rebirth",
    visual: "\uD83D\uDD25",

    core_meaning:
      "Complete renewal through total destruction \u2014 the only way through is through. Not resurgence but genuine emergence of a form that could not have existed before the fire.",
    emotional_tone:
      "Power, earned resurrection, the specific beauty of what survives because it deserved to.",
    visual_language:
      "Ash, rising, wingspan, heat signature, the moment after emergence when the new form is still wet.",

    shadow_expression:
      "Performing resurrection, using cycles of destruction and rise as identity rather than as passage.",
    growth_expression:
      "True rebirth \u2014 not returning to who you were before, but emerging as someone the fire revealed.",
    associated_behaviors: [
      "post-crisis flourishing",
      "radical reinvention that actually holds",
      "new identity integrated fully",
      "thriving in a form others didn't expect you to reach",
    ],

    atmospheric_influence: "transcendent",
    ritual_associations: [
      "phoenix meditation",
      "ash ceremony",
      "rebirth journaling",
      "emergence ritual",
      "fire-to-light practice",
    ],

    stabilization_tendency:
      "Rising energy. Phoenix gains weight rapidly as the new form solidifies. Once established, highly stable \u2014 the rebirth holds.",
    typical_duration:
      "Weeks. The emergence is fast, the integration slower. Phoenix energy is most potent in the first weeks after the turning point.",
    permanence_affinity:
      "High. Phoenix anchors because the transformation it represents is real and irreversible. You cannot un-become who the fire revealed.",

    transition_tendencies: [
      "Often precedes Crown or Star",
      "Follows Abyss or Serpent at long remove \u2014 the gap between descent and emergence is real",
    ],
    symbolic_relatives: ["Serpent", "Ouroboros"],
    counterbalance_symbols: ["Egg", "Seed"],

    reflection_prompt:
      "What did the fire take that needed to go? What did it leave that couldn't burn?",
    action_prompt:
      "Name who you are now \u2014 not who you were before it happened.",
  },

  {
    id: 22,
    symbol: "Star",
    stage: "Mastery",
    theme: "transcendence",
    visual: "\u2B50",

    core_meaning:
      "Unconditional orientation \u2014 transcendent clarity that guides without needing to arrive. Light from a distance that helps others find their way.",
    emotional_tone:
      "Expansiveness, serenity, the quiet of deep perspective \u2014 being beyond urgency without being removed from care.",
    visual_language:
      "Fixed point in vast space, constancy, light that outlasts its source, guidance that requires no words.",

    shadow_expression:
      "Spiritual bypassing, detachment from embodied life, using wisdom as escape from the difficulty of presence.",
    growth_expression:
      "Light from a distance \u2014 presence that inspires without imposing, that guides through being rather than doing.",
    associated_behaviors: [
      "teaching from a place of genuine integration",
      "creative contribution that outlasts the moment",
      "purposeful living without needing recognition",
      "mentorship as offering",
    ],

    atmospheric_influence: "expansive",
    ritual_associations: [
      "star gazing",
      "transcendence meditation",
      "offering ceremony",
      "legacy journaling",
      "light-sending practice",
    ],

    stabilization_tendency:
      "Deeply stable. Star energy persists with minimal maintenance because it represents transcendent perspective. The most stable Mastery symbol.",
    typical_duration:
      "Months to permanent. Star represents arrived wisdom \u2014 it does not pass quickly.",
    permanence_affinity:
      "Very high. Star anchors naturally. It is arguably the end-state of the entire symbolic system \u2014 stable, luminous, guiding.",

    transition_tendencies: [
      "Often precedes Ouroboros or Seed \u2014 wisdom that enables conscious new beginning",
      "Follows Crown as authority becomes generative rather than personal",
    ],
    symbolic_relatives: ["Lantern", "Crown"],
    counterbalance_symbols: ["Abyss", "Labyrinth"],

    reflection_prompt:
      "What does your presence make possible for others, simply by being what you are?",
    action_prompt: "Offer what you carry without waiting to be asked.",
  },

  {
    id: 23,
    symbol: "Chalice",
    stage: "Mastery",
    theme: "fulfillment",
    visual: "\uD83C\uDFC6",

    core_meaning:
      "The capacity to receive, hold, and offer \u2014 the vessel that has become worthy of what it carries. Giving from fullness rather than depletion.",
    emotional_tone:
      "Deep receptivity, genuine fulfillment, the gratitude that comes from real abundance rather than performed contentment.",
    visual_language:
      "Cup and its overflow, what is held and what is given, the quality of the vessel itself \u2014 what it is made of.",

    shadow_expression:
      "Over-giving, martyrdom, the empty cup offered as gift \u2014 the performance of generosity that is actually a form of loss.",
    growth_expression:
      "Overflow \u2014 giving from fullness, receiving fully before offering, the generosity that does not cost the giver their substance.",
    associated_behaviors: [
      "generous creative output from a place of abundance",
      "emotional availability without depletion",
      "devotion and spiritual fulfillment",
      "giving that is received as well as offered",
    ],

    atmospheric_influence: "generous",
    ritual_associations: [
      "cup ceremony",
      "overflow meditation",
      "gratitude practice",
      "offering ritual",
      "receptivity exercise",
    ],

    stabilization_tendency:
      "Warm and steady. Chalice energy sustains through the act of giving and receiving. Depletes only when giving exceeds replenishment.",
    typical_duration:
      "Weeks to months. Chalice sustains as long as the source is tended.",
    permanence_affinity:
      "High. Chalice anchors because generosity-from-fullness is one of the most self-reinforcing psychological patterns.",

    transition_tendencies: [
      "Often follows Crown or Phoenix \u2014 mastery expressed as capacity to receive",
      "Precedes Ouroboros as fulfillment becomes ground for new beginning",
    ],
    symbolic_relatives: ["River", "Loom"],
    counterbalance_symbols: ["Abyss", "Storm"],

    reflection_prompt:
      "Are you giving from fullness, or from the performance of abundance?",
    action_prompt:
      "Fill yourself first. Tend to your own replenishment before you offer from it.",
  },

  {
    id: 24,
    symbol: "Ouroboros",
    stage: "Mastery",
    theme: "eternal-return",
    visual: "\u267E\uFE0F",

    core_meaning:
      "The eternal cycle \u2014 completion that is simultaneously beginning. The integration of all five stages into a single, continuous motion.",
    emotional_tone:
      "Deep peace, the acceptance of cyclical nature, non-attachment to any single phase \u2014 including completion.",
    visual_language:
      "The serpent consuming its own tail, the circle with no seam, the seamless boundary between completion and origin.",

    shadow_expression:
      "Stagnation disguised as wisdom \u2014 using the concept of cycles to avoid the vulnerability of genuine new beginning.",
    growth_expression:
      "Conscious re-entry \u2014 choosing to begin a new cycle with everything you have learned, returning to Seed as a master rather than a novice.",
    associated_behaviors: [
      "intentional new beginnings from a place of completion",
      "cyclical spiritual or creative practice",
      "bringing earned wisdom to new territory",
      "beginning again without forgetting what the journey taught",
    ],

    atmospheric_influence: "cyclical",
    ritual_associations: [
      "cycle closing ceremony",
      "completion meditation",
      "renewal ritual",
      "spiral walking",
      "return-to-beginning practice",
    ],

    stabilization_tendency:
      "Paradoxical. Ouroboros is both the most stable and most transitional symbol \u2014 it holds everything by releasing everything. Decays only through refusal to re-enter the cycle.",
    typical_duration:
      "Brief as a recognized moment \u2014 days. The insight of completion is flash-like. But its effects ripple into the next cycle indefinitely.",
    permanence_affinity:
      "The highest. Ouroboros is the only symbol that anchors through completion rather than accumulation. It represents the integration of the entire system.",

    transition_tendencies: [
      "Always precedes Seed or Dawn \u2014 the end that is a beginning",
      "The only archetype that directly loops the system",
    ],
    symbolic_relatives: ["Phoenix", "Serpent"],
    counterbalance_symbols: ["Egg", "Tower"],

    reflection_prompt:
      "What have you completed enough to begin again \u2014 consciously, with everything you now know?",
    action_prompt:
      "Identify where your ending is also your beginning. Name both.",
  },
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

export function getBySymbol(name) {
  return SYMBOLIC_ONTOLOGY.find((s) => s.symbol === name) || null;
}

export function getByStage(stage) {
  return SYMBOLIC_ONTOLOGY.filter((s) => s.stage === stage);
}

export function getCounterbalances(symbolName) {
  const sym = getBySymbol(symbolName);
  if (!sym) return [];
  return sym.counterbalance_symbols
    .map((name) => getBySymbol(name))
    .filter(Boolean);
}

export function getRelatives(symbolName) {
  const sym = getBySymbol(symbolName);
  if (!sym) return [];
  return sym.symbolic_relatives
    .map((name) => getBySymbol(name))
    .filter(Boolean);
}

export const STAGE_ORDER = [
  "Awakening",
  "Growth",
  "Crisis",
  "Integration",
  "Mastery",
];

export const PERMANENCE_AFFINITY_RANK = {
  "Very low": 1,
  Low: 2,
  "Low-moderate": 3,
  Moderate: 4,
  "Moderate-high": 5,
  High: 6,
  "Very high": 7,
  "The highest": 8,
};
