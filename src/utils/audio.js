// Audio engine for Justify Solutions module
// Supports static ElevenLabs MP3s and high-quality Natural Web Speech Synthesis fallback.
// Ensures rich, clear, uninterrupted audio narration across all browsers and devices.

import audioMap from './audioMap.js';

export const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
export const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

let isMuted = false;
let currentAudio = null;
let audioContext = null;
let currentUtterance = null;
let isAudioUnlocked = false;

// Normalize text for reliable matching (casing, punctuation, whitespace)
function normalizeText(txt) {
  if (!txt) return '';
  return txt
    .toLowerCase()
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// Pre-build normalized audio map
const normalizedAudioMap = {};
for (const [key, value] of Object.entries(audioMap)) {
  normalizedAudioMap[normalizeText(key)] = value;
}

export function isNarrationMuted() {
  return isMuted;
}

export function setNarrationMuted(muted) {
  isMuted = muted;
  if (isMuted) {
    stopNarration();
  }
}

export function toggleMute() {
  setNarrationMuted(!isMuted);
  return isMuted;
}

export function stopNarration() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  currentUtterance = null;
}

// Select the best natural female voice available in the browser
function getBestVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Prefer natural English female voices (Alice-like clear tone)
  const preferredNames = [
    'Google UK English Female',
    'Google US English',
    'Microsoft Zira',
    'Samantha',
    'Victoria',
    'Karen',
    'Moira',
    'Tessa',
    'Fiona',
    'en-GB',
    'en-US'
  ];

  for (const name of preferredNames) {
    const found = voices.find(v => v.name.includes(name) || v.lang.includes(name));
    if (found) return found;
  }

  // Fallback to any English voice
  const enVoice = voices.find(v => v.lang.startsWith('en'));
  return enVoice || voices[0];
}

// Unlock audio playback on first interaction
export function unlockAudio() {
  if (isAudioUnlocked) return;
  isAudioUnlocked = true;

  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  } catch {
    // ignore
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true });
  window.addEventListener('keydown', unlockAudio, { once: true });
}

// Find mapped audio file with exact or normalized matching only (Bug #2 fixed)
function findAudioFile(text) {
  if (!text) return null;
  const trimmed = text.trim();

  // 1. Direct exact match
  if (audioMap[trimmed]) return audioMap[trimmed];

  // 2. Normalized match (ignores casing, punctuation, emojis)
  const norm = normalizeText(trimmed);
  if (normalizedAudioMap[norm]) return normalizedAudioMap[norm];

  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Audio] No static audio mapping found for text: "${trimmed.substring(0, 40)}..."`);
  }

  return null;
}

// Speak using high quality natural speech synthesis fallback
function speakFallback(text, style = 'statement', onEnd = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text of emojis for speech clarity
    const cleanText = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Voice prosody settings based on style presets
    if (style === 'celebration' || style === 'encouragement') {
      utterance.pitch = 1.15;
      utterance.rate = 1.0;
    } else if (style === 'emphasis') {
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
    } else if (style === 'thinking') {
      utterance.pitch = 1.0;
      utterance.rate = 0.92;
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 0.98;
    }

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (onEnd) onEnd();
  }
}

export function narrate(text, style = 'statement', onEnd = null) {
  if (isMuted || !text) {
    if (onEnd) onEnd();
    return;
  }

  stopNarration();
  unlockAudio();

  const audioFile = findAudioFile(text);

  if (audioFile) {
    try {
      const audio = new Audio(audioFile);
      currentAudio = audio;

      let hasEnded = false;
      const finish = () => {
        if (!hasEnded) {
          hasEnded = true;
          currentAudio = null;
          if (onEnd) onEnd();
        }
      };

      audio.onended = finish;
      audio.onerror = () => {
        // Fallback gracefully if static file is not found (e.g., pending API key generation)
        currentAudio = null;
        speakFallback(text, style, onEnd);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          currentAudio = null;
          speakFallback(text, style, onEnd);
        });
      }
      return;
    } catch {
      speakFallback(text, style, onEnd);
    }
  } else {
    speakFallback(text, style, onEnd);
  }
}

// Web Audio API Sound Effects Synthesizer
function getAudioContext() {
  if (!audioContext && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export const sounds = {
  pop() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio error ignored
    }
  },

  correct() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.25, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.26);
      });
    } catch {
      // Audio error ignored
    }
  },

  wrong() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      [330, 246.94].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.2, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.22);
      });
    } catch {
      // Audio error ignored
    }
  },

  celebration() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.3, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.42);
      });
    } catch {
      // Audio error ignored
    }
  },

  click() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio error ignored
    }
  },

  ding() {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {
      // Audio error ignored
    }
  }
};
