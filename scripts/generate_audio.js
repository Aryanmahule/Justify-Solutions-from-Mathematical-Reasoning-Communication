// ElevenLabs batch audio generator for Justify Solutions module
// Voice ID: Xb7hH8MSUJpSbSDYk0k2 ("Alice")
// Model: eleven_multilingual_v2

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_DIR = path.join(__dirname, '../public/assets/audio/justify');
const AUDIO_MAP_FILE = path.join(__dirname, '../src/utils/audioMap.js');
const MANIFEST_FILE = path.join(__dirname, 'audio-manifest.json');

const PRESETS = {
  statement: { stability: 0.50, similarity_boost: 0.75 },
  question: { stability: 0.40, similarity_boost: 0.80 },
  encouragement: { stability: 0.35, similarity_boost: 0.85 },
  celebration: { stability: 0.30, similarity_boost: 0.90 },
  emphasis: { stability: 0.45, similarity_boost: 0.80 },
  thinking: { stability: 0.60, similarity_boost: 0.70 },
  instruction: { stability: 0.55, similarity_boost: 0.75 },
};

const PHRASES = [
  // WONDER PHASE
  { id: 'wonder_intro', text: "Welcome to Ravi's mini courtroom! Maya says she has the right answer. But Ravi the Judge only says one thing: convince me!", style: 'statement' },
  { id: 'wonder_why', text: "An answer on its own could be a lucky guess. A reason shows why it is true, and lets other people check it for themselves.", style: 'statement' },
  { id: 'wonder_examples', text: "Not necessarily! Examples can support an idea, but they cannot prove it. Just one counterexample is enough to show a rule is false.", style: 'emphasis' },
  { id: 'wonder_check', text: "You can put it back into the problem, estimate to see if it is sensible, or solve it a different way. If they agree, you can be confident.", style: 'thinking' },

  // STORY PHASE (SLIDES 1 to 5)
  { id: 'story_slide1', text: "Welcome to Ravi's courtroom of maths! In reasoning, an answer on its own is never enough. You need an answer, a clear reason, and a conclusion to convince anyone.", style: 'statement' },
  { id: 'story_slide2', text: "The most reliable check is substitution. Put your answer back into the equation, work out both sides step by step, and verify they are exactly equal.", style: 'instruction' },
  { id: 'story_slide3', text: "Always check if your answer makes sense in the real world. Round the numbers to estimate quickly. If your exact answer is close to your estimate, you caught any big calculation slips!", style: 'emphasis' },
  { id: 'story_slide4', text: "Be careful with general claims! A hundred examples cannot prove a rule is always true, but finding just one single counterexample breaks the whole claim completely.", style: 'thinking' },
  { id: 'story_slide5', text: "Mathematical communication matters. Put everything together: state your answer, show your check, and write a complete concluding sentence with the proper units.", style: 'celebration' },

  // STATIONS PHASE
  { id: 'station1_intro', text: "Welcome to Station 1! Test each claim by putting the value back in. Compare both sides, then tell Ravi if the claim stands.", style: 'instruction' },
  { id: 'station2_intro', text: "Welcome to Station 2! Some of these rules are not always true. Find the one case that breaks each claim.", style: 'instruction' },
  { id: 'station3_intro', text: "Welcome to Station 3! Build a complete justification from real Singapore problems, with an answer, a check and a conclusion.", style: 'instruction' },

  // PRACTICE PHASE
  { id: 'practice_welcome', text: "Welcome to Practice Mode! Test your reasoning skills across six justification challenges. Check solutions, test reasonableness, and spot the flaws to build your streak!", style: 'instruction' },
  { id: 'practice_correct_1', text: "Brilliant reasoning! Your justification is completely sound and convincing.", style: 'encouragement' },
  { id: 'practice_correct_2', text: "Spot on! Ravi the Judge is convinced by your mathematical proof.", style: 'celebration' },
  { id: 'practice_wrong_1', text: "Not quite. A good justification gives a reason, not just an answer. Check it by putting the value back in.", style: 'thinking' },
  { id: 'practice_wrong_2', text: "Take another look! Check whether the reason truly supports the conclusion, or search for a counterexample.", style: 'thinking' },

  // REFLECT & SUMMARY
  { id: 'reflect_intro', text: "Think about today's discoveries. Which way of checking an answer would you trust the most?", style: 'thinking' },
  { id: 'summary_congrats', text: "Congratulations! You have mastered justifying solutions and earned your Reasoning Master badge!", style: 'celebration' },

  // INTRO MASCOT
  { id: 'intro_mascot', text: "Welcome to my courtroom! Maya has a claim, but I need proof. Can you help justify each solution with ironclad reasoning?", style: 'encouragement' }
];

function computeHash(text, style) {
  return crypto.createHash('sha1').update(`${text}::${style}`).digest('hex');
}

async function generateAll() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    } catch {
      manifest = {};
    }
  }

  console.log(`Found ${PHRASES.length} phrases to process using Voice ID: ${VOICE_ID}`);

  const mapEntries = {};

  for (const item of PHRASES) {
    const filename = `${item.id}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);
    const publicUrl = `/assets/audio/justify/${filename}`;
    mapEntries[item.text] = publicUrl;

    const hash = computeHash(item.text, item.style);

    if (fs.existsSync(filePath) && manifest[item.id] === hash) {
      console.log(`✓ Unchanged & cached: ${filename}`);
      continue;
    }

    if (!API_KEY) {
      console.warn(`⚠️ ELEVENLABS_API_KEY is not set. Skipping API call for ${filename}.`);
      continue;
    }

    console.log(`🎙️ Generating: ${filename} ("${item.text.substring(0, 35)}...")`);

    const preset = PRESETS[item.style] || PRESETS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: item.text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: preset.stability,
            similarity_boost: preset.similarity_boost
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ Error generating ${filename}: HTTP ${response.status}`, errText);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
      manifest[item.id] = hash;
      console.log(`✅ Saved ${filename}`);
    } catch (err) {
      console.error(`❌ Network error generating ${filename}:`, err.message);
    }
  }

  // Save updated manifest
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));

  // Write audioMap.js
  const mapContent = `// Auto-generated audio map for Justify Solutions module\n\nconst audioMap = ${JSON.stringify(mapEntries, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync(AUDIO_MAP_FILE, mapContent);
  console.log('✅ Updated src/utils/audioMap.js successfully.');
}

generateAll().catch(console.error);
