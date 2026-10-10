// Audio mapping for Justify Solutions module
// Maps narration text to static ElevenLabs MP3 paths under /assets/audio/justify/

const audioMap = {
  // Wonder Phase
  "Welcome to Ravi's mini courtroom! Maya says she has the right answer. But Ravi the Judge only says one thing: convince me!": "/assets/audio/justify/wonder_intro.mp3",
  "An answer on its own could be a lucky guess. A reason shows why it is true, and lets other people check it for themselves.": "/assets/audio/justify/wonder_why.mp3",
  "Not necessarily! Examples can support an idea, but they cannot prove it. Just one counterexample is enough to show a rule is false.": "/assets/audio/justify/wonder_examples.mp3",
  "You can put it back into the problem, estimate to see if it is sensible, or solve it a different way. If they agree, you can be confident.": "/assets/audio/justify/wonder_check.mp3",

  // Story Phase
  "Welcome to Ravi's courtroom of maths! In reasoning, an answer on its own is never enough. You need an answer, a clear reason, and a conclusion to convince anyone.": "/assets/audio/justify/story_slide1.mp3",
  "The most reliable check is substitution. Put your answer back into the equation, work out both sides step by step, and verify they are exactly equal.": "/assets/audio/justify/story_slide2.mp3",
  "Always check if your answer makes sense in the real world. Round the numbers to estimate quickly. If your exact answer is close to your estimate, you caught any big calculation slips!": "/assets/audio/justify/story_slide3.mp3",
  "Be careful with general claims! A hundred examples cannot prove a rule is always true, but finding just one single counterexample breaks the whole claim completely.": "/assets/audio/justify/story_slide4.mp3",
  "Mathematical communication matters. Put everything together: state your answer, show your check, and write a complete concluding sentence with the proper units.": "/assets/audio/justify/story_slide5.mp3",

  // Stations Phase
  "Welcome to Station 1! Test each claim by putting the value back in. Compare both sides, then tell Ravi if the claim stands.": "/assets/audio/justify/station1_intro.mp3",
  "Welcome to Station 2! Some of these rules are not always true. Find the one case that breaks each claim.": "/assets/audio/justify/station2_intro.mp3",
  "Welcome to Station 3! Build a complete justification from real Singapore problems, with an answer, a check and a conclusion.": "/assets/audio/justify/station3_intro.mp3",

  // Practice Phase
  "Welcome to Practice Mode! Test your reasoning skills across six justification challenges. Check solutions, test reasonableness, and spot the flaws to build your streak!": "/assets/audio/justify/practice_welcome.mp3",
  "Brilliant reasoning! Your justification is completely sound and convincing.": "/assets/audio/justify/practice_correct_1.mp3",
  "Spot on! Ravi the Judge is convinced by your mathematical proof.": "/assets/audio/justify/practice_correct_2.mp3",
  "Not quite. A good justification gives a reason, not just an answer. Check it by putting the value back in.": "/assets/audio/justify/practice_wrong_1.mp3",
  "Take another look! Check whether the reason truly supports the conclusion, or search for a counterexample.": "/assets/audio/justify/practice_wrong_2.mp3",

  // Reflect & Summary
  "Think about today's discoveries. Which way of checking an answer would you trust the most?": "/assets/audio/justify/reflect_intro.mp3",
  "Congratulations! You have mastered justifying solutions and earned your Reasoning Master badge!": "/assets/audio/justify/summary_congrats.mp3",

  // Intro Mascot
  "Welcome to my courtroom! Maya has a claim, but I need proof. Can you help justify each solution with ironclad reasoning?": "/assets/audio/justify/intro_mascot.mp3"
};

export default audioMap;
