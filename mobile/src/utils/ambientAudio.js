import { Audio } from "expo-av";

// ── Expanded Ambient Track Library ──────────────────────────────────────────
// Free CC0 / royalty-free ambient tracks organized by mood
export const AMBIENT_TRACKS = {
  // Original tracks
  crystalBowls:
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_cd34ea49b4.mp3?filename=tibetan-bowls-6384.mp3",
  forest:
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_0e5a7a84aa.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3",
  rain: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=rain-and-thunder-16705.mp3",
  mystical:
    "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9aba5f9f3c.mp3?filename=space-120280.mp3",
  meditation:
    "https://cdn.pixabay.com/download/audio/2022/11/22/audio_fb3c05d67f.mp3?filename=healing-river-124357.mp3",

  // New expanded tracks
  ocean:
    "https://cdn.pixabay.com/download/audio/2022/04/26/audio_f6a1faeec0.mp3?filename=calm-sea-ambience-10720.mp3",
  fireplace:
    "https://cdn.pixabay.com/download/audio/2022/10/30/audio_e18b2a2a69.mp3?filename=fireplace-with-crackling-sounds-119594.mp3",
  windChimes:
    "https://cdn.pixabay.com/download/audio/2023/09/27/audio_f9e92b3d5c.mp3?filename=wind-chimes-nature-sounds-meditation-170036.mp3",
  nightAmbience:
    "https://cdn.pixabay.com/download/audio/2022/01/20/audio_16c4a67024.mp3?filename=crickets-and-insects-in-the-florida-everglades-at-night-ambience-7110.mp3",
  cosmicDrone:
    "https://cdn.pixabay.com/download/audio/2023/01/14/audio_3c69e84e9a.mp3?filename=ambient-drone-132187.mp3",
  etherealPad:
    "https://cdn.pixabay.com/download/audio/2023/07/05/audio_a0a1e8cc23.mp3?filename=ambient-piano-ampamp-strings-10711.mp3",
};

// Track metadata for UI display
export const TRACK_INFO = {
  crystalBowls: {
    name: "Crystal Bowls",
    emoji: "🔔",
    description: "Resonant singing bowls for spiritual clarity",
    mood: "sacred",
  },
  forest: {
    name: "Forest Stream",
    emoji: "🌿",
    description: "Gentle river and birdsong among the trees",
    mood: "grounding",
  },
  rain: {
    name: "Rain & Thunder",
    emoji: "🌧️",
    description: "Cleansing rain with distant rolling thunder",
    mood: "emotional",
  },
  mystical: {
    name: "Cosmic Space",
    emoji: "🌌",
    description: "Deep space ambient for intuitive work",
    mood: "mystical",
  },
  meditation: {
    name: "Healing River",
    emoji: "🧘",
    description: "Flowing water for deep meditation",
    mood: "peaceful",
  },
  ocean: {
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Gentle ocean waves on a calm shore",
    mood: "emotional",
  },
  fireplace: {
    name: "Crackling Fire",
    emoji: "🔥",
    description: "Warm hearth fire for shadow work",
    mood: "transformative",
  },
  windChimes: {
    name: "Wind Chimes",
    emoji: "🎐",
    description: "Gentle chimes with nature sounds",
    mood: "airy",
  },
  nightAmbience: {
    name: "Night Garden",
    emoji: "🌙",
    description: "Crickets and nighttime serenity",
    mood: "lunar",
  },
  cosmicDrone: {
    name: "Cosmic Drone",
    emoji: "✨",
    description: "Deep ambient drone for profound readings",
    mood: "mystical",
  },
  etherealPad: {
    name: "Ethereal Piano",
    emoji: "🎹",
    description: "Soft piano with ambient strings",
    mood: "reflective",
  },
};

// ── Enhanced Card-Based Ambient Selection ───────────────────────────────────
export function getAmbientForCards(cards) {
  if (!cards || cards.length === 0) return "mystical";

  const cardNames = cards.map((c) => c?.name?.toLowerCase() || "");
  const cardIds = cards.map((c) => c?.id?.toLowerCase() || "");

  // Major Arcana specific matches
  if (cardNames.some((n) => n.includes("hermit") || n.includes("star"))) {
    return "meditation";
  }
  if (
    cardNames.some((n) => n.includes("moon") || n.includes("high priestess"))
  ) {
    return "nightAmbience";
  }
  if (cardNames.some((n) => n.includes("sun") || n.includes("world"))) {
    return "windChimes";
  }
  if (cardNames.some((n) => n.includes("tower") || n.includes("death"))) {
    return "cosmicDrone";
  }
  if (cardNames.some((n) => n.includes("devil") || n.includes("hanged man"))) {
    return "fireplace";
  }
  if (
    cardNames.some((n) => n.includes("judgement") || n.includes("hierophant"))
  ) {
    return "crystalBowls";
  }
  if (cardNames.some((n) => n.includes("empress") || n.includes("strength"))) {
    return "forest";
  }
  if (cardNames.some((n) => n.includes("lovers") || n.includes("temperance"))) {
    return "etherealPad";
  }

  // Suit-based matching
  const suitCounts = { cups: 0, wands: 0, swords: 0, pentacles: 0 };
  for (const id of cardIds) {
    if (id.includes("cups")) suitCounts.cups++;
    if (id.includes("wands")) suitCounts.wands++;
    if (id.includes("swords")) suitCounts.swords++;
    if (id.includes("pentacles")) suitCounts.pentacles++;
  }

  const dominantSuit = Object.entries(suitCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];
  if (dominantSuit[1] > 0) {
    const suitAmbient = {
      cups: "ocean",
      wands: "fireplace",
      swords: "windChimes",
      pentacles: "forest",
    };
    return suitAmbient[dominantSuit[0]];
  }

  return "mystical";
}

// ── Moon Phase-Specific Ambient ─────────────────────────────────────────────
export function getAmbientForMoonPhase(phaseName) {
  const phaseAmbient = {
    "New Moon": "nightAmbience",
    "Waxing Crescent": "windChimes",
    "First Quarter": "forest",
    "Waxing Gibbous": "etherealPad",
    "Full Moon": "crystalBowls",
    "Waning Gibbous": "meditation",
    "Last Quarter": "ocean",
    "Waning Crescent": "cosmicDrone",
  };
  return phaseAmbient[phaseName] || "mystical";
}

// ── Expo Audio Player with Crossfade ────────────────────────────────────────
export class AmbientPlayer {
  constructor() {
    this.sound = null;
    this.currentTrack = null;
    this.currentVolume = 0.3;
    this._initializeAudio();
  }

  async _initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.log("Audio init error:", error);
    }
  }

  async play(trackKey, volume = 0.3) {
    if (this.currentTrack === trackKey && this.sound) {
      return; // Already playing
    }

    // Crossfade: fade out existing track
    if (this.sound) {
      await this._fadeOut(this.sound, 500);
      await this.sound.unloadAsync();
      this.sound = null;
    }

    const trackUrl = AMBIENT_TRACKS[trackKey];
    if (!trackUrl) return;

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: trackUrl },
        { shouldPlay: true, isLooping: true, volume: 0 },
      );

      this.sound = sound;
      this.currentTrack = trackKey;
      this.currentVolume = volume;

      // Fade in
      await this._fadeIn(sound, volume, 800);
    } catch (error) {
      console.log("Error playing ambient audio:", error);
    }
  }

  async _fadeIn(sound, targetVolume, durationMs) {
    const steps = 10;
    const stepDuration = durationMs / steps;
    const volumeStep = targetVolume / steps;

    for (let i = 1; i <= steps; i++) {
      try {
        await sound.setVolumeAsync(Math.min(volumeStep * i, targetVolume));
        await new Promise((r) => setTimeout(r, stepDuration));
      } catch (e) {
        break;
      }
    }
  }

  async _fadeOut(sound, durationMs) {
    const steps = 8;
    const stepDuration = durationMs / steps;
    let currentVol = this.currentVolume;
    const volumeStep = currentVol / steps;

    for (let i = 1; i <= steps; i++) {
      try {
        const newVol = Math.max(currentVol - volumeStep * i, 0);
        await sound.setVolumeAsync(newVol);
        await new Promise((r) => setTimeout(r, stepDuration));
      } catch (e) {
        break;
      }
    }
  }

  async stop() {
    if (this.sound) {
      try {
        await this._fadeOut(this.sound, 400);
        await this.sound.unloadAsync();
      } catch (e) {
        console.log("Error stopping audio:", e);
      }
      this.sound = null;
      this.currentTrack = null;
    }
  }

  async setVolume(volume) {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.currentVolume = clampedVolume;
    if (this.sound) {
      try {
        await this.sound.setVolumeAsync(clampedVolume);
      } catch (e) {
        console.log("Error setting volume:", e);
      }
    }
  }

  async switchTrack(trackKey, volume) {
    const vol = volume !== undefined ? volume : this.currentVolume;
    await this.play(trackKey, vol);
  }
}

// Singleton instance
let globalPlayer = null;

export function getAmbientPlayer() {
  if (!globalPlayer) {
    globalPlayer = new AmbientPlayer();
  }
  return globalPlayer;
}
