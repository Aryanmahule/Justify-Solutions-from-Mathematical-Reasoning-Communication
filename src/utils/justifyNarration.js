// Narration lines and transcript data for Justify Solutions — Mathematical Reasoning & Communication
// Voice: "Alice" (ElevenLabs ID: Xb7hH8MSUJpSbSDYk0k2, Model: eleven_multilingual_v2)

export const NARRATION = {
  wonder: {
    intro: {
      text: "Welcome to Ravi's mini courtroom! Maya says she has the right answer. But Ravi the Judge only says one thing: convince me!",
      style: "statement"
    },
    why: {
      question: "Why isn't an answer enough?",
      answer: "An answer on its own could be a lucky guess. A reason shows why it is true, and lets other people check it for themselves.",
      style: "statement"
    },
    examples: {
      question: "If a rule works for one example, is it always true?",
      answer: "Not necessarily! Examples can support an idea, but they cannot prove it. Just one counterexample is enough to show a rule is false.",
      style: "emphasis"
    },
    check: {
      question: "How can you check an answer?",
      answer: "You can put it back into the problem, estimate to see if it is sensible, or solve it a different way. If they agree, you can be confident.",
      style: "thinking"
    }
  },

  story: [
    {
      id: 1,
      title: "Convince Me!",
      subtitle: "Answer + Reason + Conclusion = Complete Justification",
      capsule: "Answer ✓ + Reason ✓ + Conclusion ✓",
      story: "Welcome to Ravi's courtroom of maths! Ravi the robot fox wears his tiny judge's wig and issues a challenge: 'Convince me!' An answer alone is just a claim. True mathematical communication requires three parts: what you found, why it is true, and a conclusion with context.",
      question: "What three parts make a complete mathematical justification?",
      narration: "Welcome to Ravi's courtroom of maths! In reasoning, an answer on its own is never enough. You need an answer, a clear reason, and a conclusion to convince anyone.",
      style: "statement",
      image: "/images/story/slide1_courtroom.jpg",
      badge: "Concept 01"
    },
    {
      id: 2,
      title: "Check by Substituting",
      subtitle: "Put the value back into both sides to verify equality",
      capsule: "Claim: x = 6 in 3x − 4 = 14 → 3(6) − 4 = 14 ✓",
      story: "Maya tests a solution claim. To verify that x = 6 satisfies 3x − 4 = 14, she substitutes 6 in brackets: 3(6) − 4 = 18 − 4 = 14. Left-Hand Side equals Right-Hand Side! But if she tests x = 5, 3(5) − 4 = 11 ≠ 14. The claim is proven false immediately.",
      question: "How does substituting into both sides prove a solution?",
      narration: "The most reliable check is substitution. Put your answer back into the equation, work out both sides step by step, and verify they are exactly equal.",
      style: "instruction",
      image: "/images/story/slide2_substitute.jpg",
      badge: "Concept 02"
    },
    {
      id: 3,
      title: "Does It Make Sense?",
      subtitle: "Estimate by rounding to catch big slips and check reasonableness",
      capsule: "49 × 21 ≈ 50 × 20 = 1000 → Exact 1029 is sensible ✓",
      story: "Ravi reminds Maya to check reasonableness. Suppose Maya calculates 49 × 21 and gets 10,290 by accident. Rounding each number gives 50 × 20 = 1000. Comparing with the estimate instantly exposes a ten-fold slip! An exact answer of 1029 is close to 1000 and completely sensible.",
      question: "How does rounding help detect calculation mistakes?",
      narration: "Always check if your answer makes sense in the real world. Round the numbers to estimate quickly. If your exact answer is close to your estimate, you caught any big calculation slips!",
      style: "emphasis",
      image: "/images/story/slide3_estimate.jpg",
      badge: "Concept 03"
    },
    {
      id: 4,
      title: "Break It With One Case",
      subtitle: "Counterexamples disprove claims; examples never prove general rules",
      capsule: "Claim: 'Multiplying always increases' → 5 × 0.5 = 2.5 ✗",
      story: "Maya meets a bold claim: 'Multiplying always makes a number bigger!' It works for 5 × 2 = 10 and 4 × 3 = 12. But Maya finds a single counterexample: 5 × 0.5 = 2.5, which is smaller than 5! A thousand supporting examples cannot prove a general rule, but one counterexample shatters it.",
      question: "Why is one counterexample enough to disprove a rule?",
      narration: "Be careful with general claims! A hundred examples cannot prove a rule is always true, but finding just one single counterexample breaks the whole claim completely.",
      style: "thinking",
      image: "/images/story/slide4_counterexample.jpg",
      badge: "Concept 04"
    },
    {
      id: 5,
      title: "Say It Clearly",
      subtitle: "Communicate findings in full sentences with units, because, and therefore",
      capsule: "3 tickets + $2 fee = $17 → 3(5) + 2 = 17 ✓ → 'Each ticket costs $5.'",
      story: "In real-world problem solving across Singapore, an answer like '5' is incomplete. Maya writes: 'Let each ticket cost $t. 3(5) + 2 = 15 + 2 = $17. Therefore, each ticket costs $5.' Using connecting words like 'because' and 'therefore' and stating units makes the conclusion crystal clear.",
      question: "Why must a mathematical conclusion include units and context?",
      narration: "Mathematical communication matters. Put everything together: state your answer, show your check, and write a complete concluding sentence with the proper units.",
      style: "celebration",
      image: "/images/story/slide5_conclusion.jpg",
      badge: "Concept 05"
    }
  ],

  stations: {
    station1: {
      title: "Check & Verify",
      subtitle: "Substitute, Compare Both Sides & Deliver the Verdict",
      intro: "Welcome to Station 1! Test each claim by putting the value back in. Compare both sides, then tell Ravi if the claim stands.",
      style: "instruction"
    },
    station2: {
      title: "Break the Claim",
      subtitle: "Hunt for Counterexamples to Shatter False Rules",
      intro: "Welcome to Station 2! Some of these rules are not always true. Find the one case that breaks each claim.",
      style: "instruction"
    },
    station3: {
      title: "Explain It in Singapore",
      subtitle: "Assemble Answer → Reason → Conclusion for Real Problems",
      intro: "Welcome to Station 3! Build a complete justification from real Singapore problems, with an answer, a check and a conclusion.",
      style: "instruction"
    }
  },

  practice: {
    welcome: "Welcome to Practice Mode! Test your reasoning skills across six justification challenges. Check solutions, test reasonableness, and spot the flaws to build your streak!",
    correct: [
      "Brilliant reasoning! Your justification is completely sound and convincing.",
      "Spot on! Ravi the Judge is convinced by your mathematical proof."
    ],
    wrong: [
      "Not quite. A good justification gives a reason, not just an answer. Check it by putting the value back in.",
      "Take another look! Check whether the reason truly supports the conclusion, or search for a counterexample."
    ]
  },

  reflect: {
    intro: "Think about today's discoveries. Which way of checking an answer would you trust the most?",
    style: "thinking",
    prompts: [
      {
        id: "counterexamples",
        question: "Why is one counterexample enough to disprove a claim, but many examples cannot prove it?",
        hint: "Think about general rules that must hold for every single number without exception."
      },
      {
        id: "reasonableness",
        question: "How do you decide if an answer is reasonable in everyday life?",
        hint: "Consider rounding numbers to get a quick estimate and comparing magnitude."
      },
      {
        id: "three_parts",
        question: "What three parts make a complete mathematical justification?",
        hint: "Remember Maya and Ravi's golden habit: Answer, Reason, and Conclusion."
      }
    ]
  },

  summary: {
    congrats: "Congratulations! You have mastered justifying solutions and earned your Reasoning Master badge!",
    style: "celebration",
    badgeName: "Reasoning Master",
    badgeDesc: "Expert at verifying mathematical solutions, finding counterexamples, and communicating reasoning clearly."
  }
};
