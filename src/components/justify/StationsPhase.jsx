import React, { useState, useEffect } from 'react';
import JustificationBoardCanvas from './JustificationBoardCanvas.jsx';
import FeedbackModal from './FeedbackModal.jsx';
import { NARRATION } from '../../utils/justifyNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StationsPhase({ state, onNext, onCompleteStation, onAddXP }) {
  const [activeStation, setActiveStation] = useState('station1');

  // Station 1 State: Check & Verify
  const [s1Round, setS1Round] = useState(0);
  const [s1Verdict, setS1Verdict] = useState(null);
  const [s1Completed, setS1Completed] = useState(state.stationsProgress.station1);

  // Station 2 State: Break the Claim
  const [s2Round, setS2Round] = useState(0);
  const [s2Completed, setS2Completed] = useState(state.stationsProgress.station2);

  // Station 3 State: Explain It in Singapore
  const [s3Round, setS3Round] = useState(0);
  const [s3Completed, setS3Completed] = useState(state.stationsProgress.station3);

  // Modal feedback
  const [modalData, setModalData] = useState({ isOpen: false, isCorrect: true, title: '', message: '' });

  // Play narration on station switch
  useEffect(() => {
    unlockAudio();
    if (activeStation === 'station1') {
      narrate(NARRATION.stations.station1.intro, NARRATION.stations.station1.style);
    } else if (activeStation === 'station2') {
      narrate(NARRATION.stations.station2.intro, NARRATION.stations.station2.style);
    } else if (activeStation === 'station3') {
      narrate(NARRATION.stations.station3.intro, NARRATION.stations.station3.style);
    }
    return () => {
      stopNarration();
    };
  }, [activeStation]);

  // Station 1: Check Claims Data
  const s1Claims = [
    {
      claim: "x = 6 solves 3x − 4 = 14",
      expression: { lhs: '3x − 4', rhs: 14, evaluatedLhs: 14, evalSteps: ['3(6) − 4', '18 − 4', '14'] },
      value: 6,
      isValid: true,
      hint: "3(6) − 4 = 18 − 4 = 14. LHS matches RHS exactly!"
    },
    {
      claim: "x = 5 solves 2x + 7 = 19",
      expression: { lhs: '2x + 7', rhs: 19, evaluatedLhs: 17, evalSteps: ['2(5) + 7', '10 + 7', '17'] },
      value: 5,
      isValid: false,
      hint: "2(5) + 7 = 10 + 7 = 17, which does not equal 19!"
    },
    {
      claim: "x = 6 solves 4(x − 1) = 20",
      expression: { lhs: '4(x − 1)', rhs: 20, evaluatedLhs: 20, evalSteps: ['4(6 − 1)', '4(5)', '20'] },
      value: 6,
      isValid: true,
      hint: "4(6 − 1) = 4(5) = 20. Both sides match!"
    }
  ];

  const handleS1Verdict = (userChoiceIsValid) => {
    sounds.click();
    const current = s1Claims[s1Round];
    const isCorrect = userChoiceIsValid === current.isValid;
    setS1Verdict(userChoiceIsValid);

    if (isCorrect) {
      sounds.correct();
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Sound Verdict! ✓',
        message: current.isValid
          ? 'Great substitution! Left-Hand Side equals Right-Hand Side.'
          : 'Sharp eye! The calculated LHS did not equal the RHS.',
        hint: current.hint
      });

      if (s1Round < s1Claims.length - 1) {
        setS1Round(r => r + 1);
        setS1Verdict(null);
      } else {
        setS1Completed(true);
        onCompleteStation('station1');
        onAddXP(50);
      }
    } else {
      sounds.wrong();
      setModalData({
        isOpen: true,
        isCorrect: false,
        title: 'Review the Working! ✗',
        message: 'Calculate the Left-Hand Side step by step to verify equality.',
        hint: current.hint
      });
    }
  };

  // Station 2: Counterexample Statements
  const s2Statements = [
    {
      statement: "Multiplying any positive number always makes it bigger",
      testValues: [
        { label: '5 × 2 = 10', result: 10, breaks: false, note: '10 > 5 (Supports claim)' },
        { label: '5 × 3 = 15', result: 15, breaks: false, note: '15 > 5 (Supports claim)' },
        { label: '5 × 0.5 = 2.5', result: 2.5, breaks: true, note: '2.5 < 5 (Breaks claim! Counterexample)' },
        { label: '5 × 0.1 = 0.5', result: 0.5, breaks: true, note: '0.5 < 5 (Breaks claim! Counterexample)' }
      ],
      breakValueName: "5 × 0.5 = 2.5"
    },
    {
      statement: "For any number x, x² is always greater than x",
      testValues: [
        { label: '2² = 4', result: 4, breaks: false, note: '4 > 2 (Supports claim)' },
        { label: '5² = 25', result: 25, breaks: false, note: '25 > 5 (Supports claim)' },
        { label: '(0.5)² = 0.25', result: 0.25, breaks: true, note: '0.25 < 0.5 (Breaks claim! Counterexample)' },
        { label: '1² = 1', result: 1, breaks: true, note: '1 = 1 (Not strictly greater! Counterexample)' }
      ],
      breakValueName: "(0.5)² = 0.25"
    },
    {
      statement: "The product of an even number and any integer is always even",
      testValues: [
        { label: '4 × 3 = 12', result: 12, breaks: false, note: '12 is even (Supports claim)' },
        { label: '4 × 5 = 20', result: 20, breaks: false, note: '20 is even (Supports claim)' },
        { label: '6 × 7 = 42', result: 42, breaks: false, note: '42 is even (Supports claim)' },
        { label: '2 × 9 = 18', result: 18, breaks: false, note: '18 is even (Supports claim)' }
      ],
      isUniversallyTrue: true,
      trueNote: "This statement is genuinely true! 2k × m = 2(km). Even infinite examples don't prove it alone, but deductive algebra does."
    }
  ];

  const handleS2NextRound = () => {
    if (s2Round < s2Statements.length - 1) {
      setS2Round(r => r + 1);
    } else {
      setS2Completed(true);
      onCompleteStation('station2');
      onAddXP(50);
      sounds.celebration();
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Station 2 Mastered! 🔨',
        message: 'You demonstrated the power of counterexamples and recognized when a rule holds universally.',
        hint: 'Remember: 1 counterexample disproves, but examples never replace proof.'
      });
    }
  };

  // Station 3: Build Mode Scenarios
  const s3Scenarios = [
    {
      title: "🇸🇬 Marina Bay Concert Tickets",
      context: "Maya buys 3 concert tickets online with a flat booking fee of $2. The total bill is $17. Find the cost of each ticket.",
      tiles: [
        { id: 't1_ans', text: "Each ticket is $5", slotType: "answer" },
        { id: 't1_rsn', text: "Check: 3($5) + $2 = $15 + $2 = $17", slotType: "reason" },
        { id: 't1_cnc', text: "Therefore, each ticket costs $5.", slotType: "conclusion" },
        { id: 't1_dist', text: "Because 17 - 2 = 15", slotType: "unused" }
      ]
    },
    {
      title: "🇸🇬 Lau Pa Sat Hawker Lunch",
      context: "Four friends split a $28 lunch bill equally. Find how much each friend pays.",
      tiles: [
        { id: 't2_ans', text: "Each friend pays $7", slotType: "answer" },
        { id: 't2_rsn', text: "Check: 4 × $7 = $28", slotType: "reason" },
        { id: 't2_cnc', text: "Therefore, each friend pays $7.", slotType: "conclusion" },
        { id: 't2_dist', text: "28 / 2 = 14", slotType: "unused" }
      ]
    },
    {
      title: "🇸🇬 HDB Corridor Renovation",
      context: "A 12-meter walkway in Toa Payoh is paved with 48 identical square tiles. Find the length of each tile.",
      tiles: [
        { id: 't3_ans', text: "Each tile length is 0.25 m", slotType: "answer" },
        { id: 't3_rsn', text: "Check: 48 × 0.25 m = 12 m", slotType: "reason" },
        { id: 't3_cnc', text: "Therefore, each tile is 0.25 meters long.", slotType: "conclusion" },
        { id: 't3_dist', text: "Because 48 / 12 = 4", slotType: "unused" }
      ]
    }
  ];

  const handleS3BuildComplete = () => {
    if (s3Round < s3Scenarios.length - 1) {
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'Complete Justification! 📜',
        message: 'Answer, Reason, and Conclusion assembled with units.',
        hint: 'Moving to next Singapore problem.'
      });
      setS3Round(r => r + 1);
    } else {
      setS3Completed(true);
      onCompleteStation('station3');
      onAddXP(50);
      sounds.celebration();
      setModalData({
        isOpen: true,
        isCorrect: true,
        title: 'All Stations Completed! 🏆',
        message: 'You have mastered verification, counterexamples, and real-world mathematical communication!',
        hint: 'Ready for Practice Mode!'
      });
    }
  };

  const allStationsDone = s1Completed && s2Completed && s3Completed;

  return (
    <div className="glass-card stations-phase-card">
      {/* Top Header Bar */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-gold" style={{ marginBottom: '6px' }}>
            <span>🧪 Phase 03</span> <span>• Hands-On Simulation Labs</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Interactive Reasoning Labs
          </h2>
        </div>

        {/* 3 Station Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`station-tab-btn ${activeStation === 'station1' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station1'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: activeStation === 'station1' ? 'var(--teal-bright)' : 'rgba(25, 20, 60, 0.8)',
              color: activeStation === 'station1' ? '#090317' : 'var(--text-main)',
              fontWeight: 800,
              border: '1.5px solid var(--purple-border)',
              cursor: 'pointer'
            }}
          >
            <span>⚖️ Lab 1: Verify</span> {s1Completed && '✓'}
          </button>

          <button
            className={`station-tab-btn ${activeStation === 'station2' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station2'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: activeStation === 'station2' ? 'var(--gold-bright)' : 'rgba(25, 20, 60, 0.8)',
              color: activeStation === 'station2' ? '#090317' : 'var(--text-main)',
              fontWeight: 800,
              border: '1.5px solid var(--purple-border)',
              cursor: 'pointer'
            }}
          >
            <span>🔨 Lab 2: Counter</span> {s2Completed && '✓'}
          </button>

          <button
            className={`station-tab-btn ${activeStation === 'station3' ? 'active' : ''}`}
            onClick={() => { sounds.click(); setActiveStation('station3'); }}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: activeStation === 'station3' ? 'var(--neon-green)' : 'rgba(25, 20, 60, 0.8)',
              color: activeStation === 'station3' ? '#090317' : 'var(--text-main)',
              fontWeight: 800,
              border: '1.5px solid var(--purple-border)',
              cursor: 'pointer'
            }}
          >
            <span>🏙️ Lab 3: Singapore</span> {s3Completed && '✓'}
          </button>
        </div>
      </div>

      {/* Main Station Content Area */}
      <div style={{ margin: '10px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* =======================================================
            STATION 1: Check & Verify
           ======================================================= */}
        {activeStation === 'station1' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-teal">Challenge {s1Round + 1} of {s1Claims.length}</span>
                <span style={{ marginLeft: '10px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                  Substitute the value into both sides, then deliver your verdict!
                </span>
              </div>
              {s1Completed && <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>✓ Station 1 Complete (+50 XP)</span>}
            </div>

            <JustificationBoardCanvas
              mode="check"
              claim={s1Claims[s1Round].claim}
              expression={s1Claims[s1Round].expression}
              value={s1Claims[s1Round].value}
            />

            {/* Verdict Decision Buttons */}
            <div style={{
              background: 'rgba(24, 18, 55, 0.7)',
              border: '1.5px solid var(--purple-border)',
              borderRadius: '16px',
              padding: '12px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Ravi the Judge: "Does the claim stand or fall?"
              </span>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn-primary"
                  onClick={() => handleS1Verdict(true)}
                  style={{ background: 'var(--neon-green)', color: '#090317', padding: '10px 24px', fontWeight: 800 }}
                >
                  ✓ Claim Stands (Valid)
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleS1Verdict(false)}
                  style={{ background: 'var(--coral)', color: '#ffffff', padding: '10px 24px', fontWeight: 800 }}
                >
                  ✗ Claim Falls (False)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================
            STATION 2: Break the Claim
           ======================================================= */}
        {activeStation === 'station2' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-gold">Case {s2Round + 1} of {s2Statements.length}</span>
                <span style={{ marginLeft: '10px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                  Test numbers against the general rule to uncover counterexamples!
                </span>
              </div>
              {s2Completed && <span style={{ color: 'var(--gold-bright)', fontWeight: 800 }}>✓ Station 2 Complete (+50 XP)</span>}
            </div>

            <JustificationBoardCanvas
              mode="counter"
              statement={s2Statements[s2Round].statement}
              counterTestValues={s2Statements[s2Round].testValues}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                className="btn-primary"
                onClick={handleS2NextRound}
                style={{ padding: '10px 24px' }}
              >
                <span>{s2Round < s2Statements.length - 1 ? 'Next Statement Case' : 'Complete Station 2'}</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* =======================================================
            STATION 3: Explain It in Singapore
           ======================================================= */}
        {activeStation === 'station3' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-teal">Problem {s3Round + 1} of {s3Scenarios.length}</span>
                <span style={{ marginLeft: '10px', fontSize: '1.15rem', color: 'var(--gold-bright)', fontWeight: 700 }}>
                  {s3Scenarios[s3Round].title}
                </span>
              </div>
              {s3Completed && <span style={{ color: 'var(--neon-green)', fontWeight: 800 }}>✓ Station 3 Complete (+50 XP)</span>}
            </div>

            <div style={{
              background: 'rgba(30, 24, 70, 0.7)',
              border: '1.5px solid var(--purple-border)',
              borderRadius: '14px',
              padding: '12px 18px',
              fontSize: '1.1rem',
              color: 'var(--text-main)',
              lineHeight: 1.5
            }}>
              {s3Scenarios[s3Round].context}
            </div>

            <JustificationBoardCanvas
              mode="build"
              tiles={s3Scenarios[s3Round].tiles}
              onBuildComplete={handleS3BuildComplete}
            />
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {allStationsDone
            ? '✓ All 3 labs completed! Ready to test your mastery in Practice Mode.'
            : 'Complete all 3 simulation labs to unlock Practice Mode.'}
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            sounds.click();
            onNext();
          }}
          disabled={!allStationsDone}
          style={{
            opacity: allStationsDone ? 1 : 0.5,
            cursor: allStationsDone ? 'pointer' : 'not-allowed',
            padding: '12px 32px'
          }}
        >
          <span>Continue to Practice Arena</span>
          <span>➔</span>
        </button>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={modalData.isOpen}
        isCorrect={modalData.isCorrect}
        title={modalData.title}
        message={modalData.message}
        hint={modalData.hint}
        onClose={() => setModalData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
