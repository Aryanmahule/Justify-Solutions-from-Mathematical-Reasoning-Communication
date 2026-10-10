// Question Engine for Justify Solutions — Mathematical Reasoning & Communication
// Generates authentic questions across 6 categories with misconception-driven distractors.

export const QUESTION_TYPES = [
  { id: 'checkClaim', label: 'Check It', color: 'teal', icon: '⚖️' },
  { id: 'reasonable', label: 'Make Sense?', color: 'purple', icon: '🎯' },
  { id: 'counterexample', label: 'Break It', color: 'gold', icon: '🔨' },
  { id: 'spotTheFlaw', label: 'Spot the Flaw', color: 'coral', icon: '🔍' },
  { id: 'bestJustification', label: 'Best Reason', color: 'teal', icon: '📜' },
  { id: 'wordProblem', label: 'Real-World', color: 'green', icon: '🏙️' }
];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Ensure 4 unique options including the correct answer
function buildFourOptions(correct, candidateDistractors) {
  const filtered = Array.from(new Set(candidateDistractors.filter(d => d !== correct && d !== undefined && d !== null)));
  
  while (filtered.length < 3) {
    filtered.push(`Alternative ${filtered.length + 2}`);
  }

  const selectedDistractors = filtered.slice(0, 3);
  const options = shuffle([correct, ...selectedDistractors]);
  return {
    options,
    correctAnswer: correct
  };
}

export function generateQuestion(index = 0, specificType = null) {
  const typeObj = specificType
    ? QUESTION_TYPES.find(t => t.id === specificType) || QUESTION_TYPES[index % QUESTION_TYPES.length]
    : QUESTION_TYPES[index % QUESTION_TYPES.length];

  const type = typeObj.id;

  switch (type) {
    // ----------------------------------------------------
    // 1. checkClaim (Verify solution by substitution)
    // ----------------------------------------------------
    case 'checkClaim': {
      const a = randomChoice([2, 3, 4, 5]);
      const xTrue = randomChoice([3, 4, 5, 6, 7]);
      const b = randomChoice([2, 3, 4, 5]);
      const rhs = a * xTrue + b;

      const isClaimTrue = Math.random() > 0.4;
      const claimedX = isClaimTrue ? xTrue : xTrue + randomChoice([-2, -1, 1, 2]);
      const claimedLhs = a * claimedX + b;
      const reallyMatches = claimedLhs === rhs;

      const prompt = `Maya claims that x = ${claimedX} is the solution to ${a}x + ${b} = ${rhs}. How do you justify whether she is correct?`;

      const correctOption = reallyMatches
        ? `Substitute: ${a}(${claimedX}) + ${b} = ${claimedLhs} = ${rhs} ✓ (Claim is valid)`
        : `Substitute: ${a}(${claimedX}) + ${b} = ${claimedLhs} ≠ ${rhs} ✗ (Claim is false)`;

      const distractors = [
        `Concatenate: ${a}${claimedX} + ${b} = ${parseInt(`${a}${claimedX}`, 10) + b} (Forget to multiply)`,
        `Compare only: ${a}(${claimedX}) = ${a * claimedX} (Forget to add ${b})`,
        reallyMatches
          ? `Substitute: ${a}(${claimedX}) + ${b} = ${claimedLhs} ≠ ${rhs} ✗ (Incorrect verdict)`
          : `Substitute: ${a}(${claimedX}) + ${b} = ${claimedLhs} = ${rhs} ✓ (Incorrect verdict)`,
        `Guess: Any whole number between 1 and 10 works.`
      ];

      const { options, correctAnswer } = buildFourOptions(correctOption, distractors);

      return {
        id: `q_check_${Date.now()}_${Math.random()}`,
        type: 'checkClaim',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt,
        formula: `${a}x + ${b} = ${rhs}`,
        variables: { x: claimedX },
        expression: {
          lhs: `${a}x + ${b}`,
          rhs,
          evaluatedLhs: claimedLhs,
          evalSteps: [`${a}(${claimedX}) + ${b}`, `${a * claimedX} + ${b}`, `${claimedLhs}`]
        },
        options,
        correctAnswer,
        explanation: `Substitute x = ${claimedX} into ${a}x + ${b}: ${a}(${claimedX}) + ${b} = ${a * claimedX} + ${b} = ${claimedLhs}. Comparing LHS with RHS (${rhs}) proves the claim is ${reallyMatches ? 'CORRECT' : 'FALSE'}.`
      };
    }

    // ----------------------------------------------------
    // 2. reasonable (Estimating by rounding)
    // ----------------------------------------------------
    case 'reasonable': {
      const pair = randomChoice([
        { a: 49, b: 21, roundA: 50, roundB: 20 },
        { a: 38, b: 19, roundA: 40, roundB: 20 },
        { a: 52, b: 31, roundA: 50, roundB: 30 },
        { a: 98, b: 11, roundA: 100, roundB: 10 },
        { a: 29, b: 41, roundA: 30, roundB: 40 }
      ]);

      const exact = pair.a * pair.b;
      const estimate = pair.roundA * pair.roundB;

      const prompt = `A student calculates ${pair.a} × ${pair.b} and writes down an answer. Which estimate best checks if the answer is reasonable?`;

      const correctOption = `Round to ${pair.roundA} × ${pair.roundB} ≈ ${estimate.toLocaleString()}`;
      const distractors = [
        `Round down to ${pair.roundA - 10} × ${pair.roundB} ≈ ${(pair.roundA - 10) * pair.roundB}`,
        `Off by factor of 10: ≈ ${(estimate * 10).toLocaleString()}`,
        `Off by factor of 100: ≈ ${(estimate / 10).toLocaleString()}`,
        `Round only one number: ${pair.roundA} × ${pair.b} ≈ ${pair.roundA * pair.b}`
      ];

      const { options, correctAnswer } = buildFourOptions(correctOption, distractors);

      return {
        id: `q_reason_${Date.now()}_${Math.random()}`,
        type: 'reasonable',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt,
        numbers: [pair.a, pair.b],
        options,
        correctAnswer,
        explanation: `Round each factor to the nearest ten: ${pair.a} ≈ ${pair.roundA} and ${pair.b} ≈ ${pair.roundB}. Therefore ${pair.roundA} × ${pair.roundB} = ${estimate.toLocaleString()} provides a rapid sanity check for the exact answer of ${exact.toLocaleString()}.`
      };
    }

    // ----------------------------------------------------
    // 3. counterexample (Single case disproves claim)
    // ----------------------------------------------------
    case 'counterexample': {
      const bank = [
        {
          statement: "Multiplying a positive number always makes it strictly bigger.",
          correct: "5 × 0.5 = 2.5 (smaller than 5)",
          distractors: ["5 × 2 = 10 (supports claim)", "4 × 3 = 12 (supports claim)", "6 × 10 = 60 (supports claim)"],
          reason: "Multiplying by a fraction between 0 and 1 scales the number down, providing an immediate counterexample."
        },
        {
          statement: "For every positive number x, x² is always greater than x.",
          correct: "For x = 0.5, (0.5)² = 0.25, which is smaller than 0.5",
          distractors: ["For x = 2, 2² = 4 > 2 (supports claim)", "For x = 5, 5² = 25 > 5 (supports claim)", "For x = 10, 10² = 100 > 10 (supports claim)"],
          reason: "Any positive fraction less than 1 squared produces a smaller result."
        },
        {
          statement: "The sum of any two odd numbers is always an odd number.",
          correct: "3 + 5 = 8 (8 is an even number)",
          distractors: ["3 + 2 = 5 (2 is not odd)", "1 + 4 = 5 (4 is not odd)", "7 + 0 = 7 (0 is not odd)"],
          reason: "The sum of two odd numbers is always even (2m+1 + 2n+1 = 2(m+n+1)), so 3 + 5 = 8 shatters the claim."
        },
        {
          statement: "Every prime number without exception is an odd number.",
          correct: "2 is a prime number, but 2 is even",
          distractors: ["3 is prime and odd (supports claim)", "7 is prime and odd (supports claim)", "9 is not prime (fails to support)"],
          reason: "2 is the only even prime number, serving as the classic counterexample."
        },
        {
          statement: "Subtraction is commutative: for all numbers, a − b = b − a.",
          correct: "5 − 2 = 3, but 2 − 5 = −3 (3 ≠ −3)",
          distractors: ["5 + 2 = 2 + 5 = 7 (addition is commutative)", "4 × 2 = 2 × 4 = 8 (multiplication)", "0 − 0 = 0 − 0 (special trivial case)"],
          reason: "Order of subtraction matters: a − b = −(b − a)."
        }
      ];

      const item = randomChoice(bank);
      const prompt = `Which single counterexample disproves the claim: "${item.statement}"?`;

      const { options, correctAnswer } = buildFourOptions(item.correct, item.distractors);

      return {
        id: `q_counter_${Date.now()}_${Math.random()}`,
        type: 'counterexample',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt,
        statement: item.statement,
        options,
        correctAnswer,
        explanation: `One counterexample is sufficient to disprove a general mathematical statement: ${item.reason}`
      };
    }

    // ----------------------------------------------------
    // 4. spotTheFlaw (Identify invalid reasoning step)
    // ----------------------------------------------------
    case 'spotTheFlaw': {
      const flaws = [
        {
          scenario: "To evaluate 3 + 4 × 2, a student writes: 3 + 4 = 7, then 7 × 2 = 14.",
          correct: "Multiplication must be performed before addition (BODMAS: 3 + 8 = 11).",
          distractors: [
            "The calculation should be (3 × 4) + 2 = 14.",
            "Adding 3 + 4 is correct, but 7 × 2 should be 16.",
            "Both 14 and 11 are equally acceptable answers."
          ],
          expl: "Order of operations (BODMAS) mandates multiplication before addition."
        },
        {
          scenario: "Testing if x = 4 solves 2x + 5 = 13: The student writes 24 + 5 = 29 ≠ 13, so x = 4 fails.",
          correct: "2x means 2 multiplied by 4 (2 × 4 = 8), not the two-digit number 24.",
          distractors: [
            "The student forgot to subtract 5 first.",
            "24 + 5 is actually 13.",
            "The student should have written 2 + 4 = 6."
          ],
          expl: "Placing a number next to a variable represents multiplication (2(4) = 8)."
        },
        {
          scenario: "A student tests n = 1 in n² + n + 41 = 43 (prime), and concludes: 'The formula produces primes for all numbers!'",
          correct: "Testing a single example never proves a rule for all infinite cases.",
          distractors: [
            "43 is not actually a prime number.",
            "The student should have tested n = 0 first.",
            "The calculation was incorrect because 1² = 2."
          ],
          expl: "Examples support a hypothesis but cannot prove a universal theorem. In fact, for n = 41, 41² + 41 + 41 = 41(43) which is composite!"
        }
      ];

      const item = randomChoice(flaws);
      const prompt = `Spot the flaw in this student's reasoning:\n"${item.scenario}"`;

      const { options, correctAnswer } = buildFourOptions(item.correct, item.distractors);

      return {
        id: `q_flaw_${Date.now()}_${Math.random()}`,
        type: 'spotTheFlaw',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt,
        options,
        correctAnswer,
        explanation: item.expl
      };
    }

    // ----------------------------------------------------
    // 5. bestJustification (Pick most complete reasoning)
    // ----------------------------------------------------
    case 'bestJustification': {
      const q = {
        prompt: "Which of the following represents the most complete, rigorous mathematical justification that x = 6 solves 3x − 4 = 14?",
        correct: "x = 6, because LHS = 3(6) − 4 = 18 − 4 = 14 = RHS. Therefore x = 6 is verified.",
        distractors: [
          "x = 6, because 6 is obviously the right number.",
          "x = 6. (Stating the answer with no working or reason).",
          "x = 6, because I solved it in my head and checked with my friend."
        ],
        expl: "A full justification requires: Answer + step-by-step verification showing LHS = RHS + concluding statement."
      };

      const { options, correctAnswer } = buildFourOptions(q.correct, q.distractors);

      return {
        id: `q_best_${Date.now()}_${Math.random()}`,
        type: 'bestJustification',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt: q.prompt,
        options,
        correctAnswer,
        explanation: q.expl
      };
    }

    // ----------------------------------------------------
    // 6. wordProblem (Singapore context full conclusion)
    // ----------------------------------------------------
    case 'wordProblem': {
      const scenarios = [
        {
          story: "Maya buys 3 concert tickets online with a flat booking fee of $2. The total bill is $17.",
          eq: "3t + 2 = 17",
          correct: "Therefore, each ticket costs $5.",
          distractors: ["Each ticket is 5 (missing currency unit).", "Therefore each ticket costs $15.", "The answer is 17."],
          working: "3t + 2 = 17 → 3t = 15 → t = 5."
        },
        {
          story: "Four friends split a $28 lunch bill equally at Lau Pa Sat food court.",
          eq: "4m = 28",
          correct: "Therefore, each friend pays $7.",
          distractors: ["Each friend pays 7.", "Total paid is $28.", "Each friend pays $8."],
          working: "4m = 28 → m = 28 / 4 = $7."
        },
        {
          story: "A 12-meter corridor in an HDB estate is paved with 48 identical square tiles end-to-end.",
          eq: "48L = 12",
          correct: "Therefore, each tile has a length of 0.25 meters.",
          distractors: ["Each tile is 0.25 (no units).", "Each tile is 4 meters.", "Each tile is 0.5 meters."],
          working: "48L = 12 → L = 12 / 48 = 0.25 m."
        }
      ];

      const item = randomChoice(scenarios);
      const prompt = `${item.story}\nForming the equation ${item.eq}, which conclusion sentence communicates the solution best?`;

      const { options, correctAnswer } = buildFourOptions(item.correct, item.distractors);

      return {
        id: `q_word_${Date.now()}_${Math.random()}`,
        type: 'wordProblem',
        typeLabel: typeObj.label,
        typeColor: typeObj.color,
        typeIcon: typeObj.icon,
        prompt,
        options,
        correctAnswer,
        explanation: `${item.working} Clear mathematical communication requires stating the answer in a complete sentence with context and correct units.`
      };
    }

    default:
      return generateQuestion(0, 'checkClaim');
  }
}

export function generateQuestionSet(count = 6) {
  const set = [];
  for (let i = 0; i < count; i++) {
    const typeObj = QUESTION_TYPES[i % QUESTION_TYPES.length];
    set.push(generateQuestion(i, typeObj.id));
  }
  return set;
}
