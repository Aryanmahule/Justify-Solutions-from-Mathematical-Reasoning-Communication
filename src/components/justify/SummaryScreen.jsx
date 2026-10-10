import React, { useEffect } from 'react';
import { NARRATION } from '../../utils/justifyNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';
import confetti from 'canvas-confetti';

export default function SummaryScreen({ state, onRestart, onPracticeMore }) {
  useEffect(() => {
    unlockAudio();
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    sounds.celebration();
    narrate(NARRATION.summary.congrats, NARRATION.summary.style);

    return () => {
      stopNarration();
    };
  }, []);

  const attempted = state.practiceStats.attempted;
  const correct = state.practiceStats.correct;
  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 100;
  const bestStreak = Math.max(state.practiceStats.bestStreak, state.highestStreak);
  const stationsDone = Object.values(state.stationsProgress).filter(Boolean).length;

  return (
    <div className="glass-card summary-phase-card" style={{ textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Badge Hero Display */}
      <div style={{ margin: '4px 0' }}>
        <div
          style={{
            fontSize: '4.4rem',
            lineHeight: 1,
            filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.6))',
            animation: 'float-around 4s infinite ease-in-out alternate'
          }}
        >
          ⚖️
        </div>

        <div className="badge badge-gold" style={{ marginTop: '8px', fontSize: '1.25rem', padding: '8px 24px' }}>
          <span>🏆 {NARRATION.summary.badgeName}</span>
        </div>

        <h1 className="title-hero" style={{ fontSize: '2.4rem', marginTop: '6px', marginBottom: '2px', fontFamily: 'var(--font-fun)' }}>
          Courtroom Verdict: Mastered!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto' }}>
          {NARRATION.summary.badgeDesc}
        </p>
      </div>

      {/* Real Performance Metrics Grid */}
      <div
        className="summary-stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          width: '100%',
          maxWidth: '840px',
          margin: '8px 0'
        }}
      >
        <div className="stat-card" style={{ background: 'rgba(25, 19, 58, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>PRACTICE ACCURACY</div>
          <div style={{ fontSize: '2.0rem', fontWeight: 900, color: 'var(--neon-green)', margin: '4px 0' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{correct} / {attempted} Correct</div>
        </div>

        <div className="stat-card" style={{ background: 'rgba(25, 19, 58, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>BEST STREAK</div>
          <div style={{ fontSize: '2.0rem', fontWeight: 900, color: 'var(--gold-bright)', margin: '4px 0' }}>
            🔥 {bestStreak}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>In a row</div>
        </div>

        <div className="stat-card" style={{ background: 'rgba(25, 19, 58, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>LABS COMPLETED</div>
          <div style={{ fontSize: '2.0rem', fontWeight: 900, color: 'var(--teal-bright)', margin: '4px 0' }}>
            🧪 {stationsDone} / 3
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Simulations</div>
        </div>

        <div className="stat-card" style={{ background: 'rgba(25, 19, 58, 0.85)', border: '1.5px solid var(--purple-border)', borderRadius: '16px', padding: '12px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 700 }}>TOTAL REASONING XP</div>
          <div style={{ fontSize: '2.0rem', fontWeight: 900, color: 'var(--gold-bright)', margin: '4px 0' }}>
            ⭐ {state.xp}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Points Earned</div>
        </div>
      </div>

      {/* Habit Summary Card */}
      <div style={{
        background: 'rgba(32, 24, 76, 0.85)',
        border: '1.5px solid var(--gold)',
        borderRadius: '16px',
        padding: '12px 20px',
        maxWidth: '840px',
        width: '100%'
      }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--gold-bright)', fontWeight: 800 }}>
          THE THREE-PART HABIT MASTERED:
        </div>
        <div style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 700 }}>
          <span style={{ color: 'var(--teal-bright)' }}>1. Answer</span> ➔{' '}
          <span style={{ color: 'var(--gold-bright)' }}>2. Reason (Check / Counterexample)</span> ➔{' '}
          <span style={{ color: 'var(--neon-green)' }}>3. Full Conclusion with Units</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
        <button
          className="btn-secondary"
          onClick={onPracticeMore}
          style={{ padding: '12px 28px', fontSize: '1.1rem' }}
        >
          <span>🎮 Practice More Challenges</span>
        </button>

        <button
          className="btn-primary"
          onClick={onRestart}
          style={{ padding: '12px 32px', fontSize: '1.1rem' }}
        >
          <span>↺ Restart Quest</span>
        </button>
      </div>
    </div>
  );
}
