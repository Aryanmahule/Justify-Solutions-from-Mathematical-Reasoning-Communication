import React, { useState } from 'react';
import { sounds } from '../../utils/audio.js';

export default function JustificationBoardCanvas({
  mode = 'check', // 'check' | 'estimate' | 'counter' | 'build'
  claim = 'x = 6 solves 3x − 4 = 14',
  expression = { lhs: '3x − 4', rhs: 14, evaluatedLhs: 14, evalSteps: ['3(6) − 4', '18 − 4', '14'] },
  value = 6,
  numbers = [49, 21],
  operation = '×',
  statement = 'Multiplying a positive number always makes it bigger',
  counterTestValues = [
    { label: '5 × 2 = 10', result: 10, breaks: false, note: '10 > 5 (Supports claim)' },
    { label: '5 × 3 = 15', result: 15, breaks: false, note: '15 > 5 (Supports claim)' },
    { label: '5 × 0.5 = 2.5', result: 2.5, breaks: true, note: '2.5 < 5 (Breaks claim! Counterexample)' },
    { label: '5 × 0 = 0', result: 0, breaks: true, note: '0 < 5 (Breaks claim! Counterexample)' }
  ],
  tiles = [],
  showChecklist = true,
  onBuildComplete = null
}) {
  // Check Mode State
  const [checkStep, setCheckStep] = useState(0);

  // Counter Mode State
  const [testedCounters, setTestedCounters] = useState({});
  const [brokenBanner, setBrokenBanner] = useState(false);

  // Build Mode State: slots for { answer, reason, conclusion }
  const [slots, setSlots] = useState({ answer: null, reason: null, conclusion: null });
  const [availableTiles, setAvailableTiles] = useState(tiles);

  // Reset or initialize build tiles if tiles prop changes
  React.useEffect(() => {
    if (tiles && tiles.length > 0) {
      setAvailableTiles(tiles);
      setSlots({ answer: null, reason: null, conclusion: null });
    }
  }, [JSON.stringify(tiles)]);

  // ==========================================
  // MODE 1: CHECK (Two-column LHS vs RHS panel)
  // ==========================================
  if (mode === 'check') {
    const isLhsEvaluated = checkStep >= 1;
    const isCompared = checkStep >= 2;
    const isMatch = expression.evaluatedLhs === expression.rhs;

    return (
      <div className="justification-board check-mode-board" style={{
        background: 'rgba(18, 14, 43, 0.85)',
        border: '1.5px solid var(--purple-border)',
        borderRadius: '20px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Claim Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: 'rgba(6, 182, 212, 0.2)',
              border: '1px solid var(--teal-bright)',
              color: 'var(--teal-bright)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 700
            }}>
              ⚖️ Verification Test
            </span>
            <span style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {claim}
            </span>
          </div>

          {showChecklist && (
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: checkStep >= 1 ? 'var(--neon-green)' : 'var(--text-dim)' }}>
                {checkStep >= 1 ? '✓' : '○'} Substitute
              </span>
              <span style={{ color: checkStep >= 2 ? 'var(--neon-green)' : 'var(--text-dim)' }}>
                {checkStep >= 2 ? '✓' : '○'} Compare
              </span>
            </div>
          )}
        </div>

        {/* Two-Column LHS vs RHS Comparison Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '12px', alignItems: 'center' }}>
          {/* LHS Card */}
          <div style={{
            background: isCompared ? (isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)') : 'rgba(30, 24, 70, 0.7)',
            border: `1.5px solid ${isCompared ? (isMatch ? 'var(--neon-green)' : 'var(--coral)') : 'var(--purple-border)'}`,
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ color: 'var(--teal-bright)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>
              Left-Hand Side (LHS)
            </div>
            <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>
              {expression.lhs}
            </div>

            {isLhsEvaluated ? (
              <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.05rem', color: 'var(--gold-bright)', fontFamily: 'var(--font-mono)' }}>
                  {expression.evalSteps?.[0] || expression.lhs}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                  = {expression.evaluatedLhs}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                Substitute x = {value}
              </div>
            )}
          </div>

          {/* Equality Indicator */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              background: isCompared
                ? (isMatch ? 'var(--neon-green)' : 'var(--coral)')
                : 'rgba(45, 36, 100, 0.8)',
              color: '#ffffff',
              boxShadow: isCompared
                ? (isMatch ? '0 0 15px var(--neon-green-glow)' : '0 0 15px var(--coral-glow)')
                : 'none',
              transition: 'all 0.3s'
            }}>
              {isCompared ? (isMatch ? '=' : '≠') : '?'}
            </div>
          </div>

          {/* RHS Card */}
          <div style={{
            background: isCompared ? (isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)') : 'rgba(30, 24, 70, 0.7)',
            border: `1.5px solid ${isCompared ? (isMatch ? 'var(--neon-green)' : 'var(--coral)') : 'var(--purple-border)'}`,
            borderRadius: '16px',
            padding: '14px',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{ color: 'var(--teal-bright)', fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>
              Right-Hand Side (RHS)
            </div>
            <div style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-main)' }}>
              {expression.rhs}
            </div>

            <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.05rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Target Value
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
                = {expression.rhs}
              </div>
            </div>
          </div>
        </div>

        {/* Step Progression Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '4px' }}>
          {checkStep === 0 && (
            <button
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '1rem' }}
              onClick={() => {
                sounds.click();
                setCheckStep(1);
              }}
            >
              Step 1: Substitute x = {value}
            </button>
          )}

          {checkStep === 1 && (
            <button
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '1rem' }}
              onClick={() => {
                if (isMatch) sounds.correct();
                else sounds.wrong();
                setCheckStep(2);
              }}
            >
              Step 2: Compare LHS vs RHS
            </button>
          )}

          {checkStep >= 2 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: isMatch ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
              border: `1px solid ${isMatch ? 'var(--neon-green)' : 'var(--coral)'}`,
              color: isMatch ? 'var(--neon-green)' : 'var(--coral-bright)',
              fontWeight: 700,
              fontSize: '1.05rem'
            }}>
              <span>{isMatch ? '✓ Verified: Both sides match! The claim is valid.' : `✗ Disproven: ${expression.evaluatedLhs} does not equal ${expression.rhs}.`}</span>
              <button
                style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setCheckStep(0)}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 2: ESTIMATE (Number Line & Reasonableness Meter)
  // ==========================================
  if (mode === 'estimate') {
    const [numA, numB] = numbers;
    const roundedA = Math.round(numA / 10) * 10 || numA;
    const roundedB = Math.round(numB / 10) * 10 || numB;
    const exact = operation === '×' ? numA * numB : numA + numB;
    const estimated = operation === '×' ? roundedA * roundedB : roundedA + roundedB;
    const ratio = Math.abs(exact - estimated) / exact;
    const isSensible = ratio < 0.15; // within 15%

    return (
      <div className="justification-board estimate-mode-board" style={{
        background: 'rgba(18, 14, 43, 0.85)',
        border: '1.5px solid var(--purple-border)',
        borderRadius: '20px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid var(--gold)',
              color: 'var(--gold-bright)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.95rem',
              fontWeight: 700
            }}>
              🎯 Reasonableness Meter
            </span>
            <span style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {numA} {operation} {numB}
            </span>
          </div>

          <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>
            Benchmark: Rounding to Nearest 10
          </div>
        </div>

        {/* Slide Comparison: Exact vs Estimate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Quick Rounding Estimate Card */}
          <div style={{
            background: 'rgba(30, 24, 70, 0.7)',
            border: '1.5px solid var(--purple-border)',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--gold-bright)', fontSize: '0.9rem', fontWeight: 700 }}>
              Quick Rounding Estimate
            </div>
            <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', margin: '6px 0', color: 'var(--text-muted)' }}>
              {roundedA} {operation} {roundedB}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
              ≈ {estimated.toLocaleString()}
            </div>
          </div>

          {/* Exact Calculation Card */}
          <div style={{
            background: 'rgba(30, 24, 70, 0.7)',
            border: `1.5px solid ${isSensible ? 'var(--neon-green)' : 'var(--coral)'}`,
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: 'var(--teal-bright)', fontSize: '0.9rem', fontWeight: 700 }}>
              Exact Calculation
            </div>
            <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', margin: '6px 0', color: 'var(--text-muted)' }}>
              {numA} {operation} {numB}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: isSensible ? 'var(--neon-green)' : 'var(--coral)' }}>
              = {exact.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sensibility Gauge Bar */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
            <span>Way Off (&gt;25% gap)</span>
            <span>Sensible Zone (±10%)</span>
            <span>Exact Match</span>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '70%',
              right: '0',
              top: 0,
              bottom: 0,
              background: 'rgba(16, 185, 129, 0.4)'
            }} />
            <div style={{
              width: `${Math.max(10, Math.min(95, 100 - ratio * 150))}%`,
              height: '100%',
              background: isSensible ? 'var(--neon-green)' : 'var(--coral)',
              borderRadius: '9999px',
              transition: 'width 0.4s'
            }} />
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.95rem', fontWeight: 700, color: isSensible ? 'var(--neon-green)' : 'var(--coral-bright)', textAlign: 'center' }}>
            {isSensible ? '✓ Reasonable: Exact answer is consistent with quick estimation!' : '✗ Suspicious: Gap between estimate and answer indicates a possible calculation slip.'}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 3: COUNTER (Test Values Shatter Banner)
  // ==========================================
  if (mode === 'counter') {
    const handleTestValue = (idx, item) => {
      sounds.click();
      setTestedCounters(prev => ({ ...prev, [idx]: true }));
      if (item.breaks) {
        sounds.ding();
        setBrokenBanner(true);
      }
    };

    return (
      <div className="justification-board counter-mode-board" style={{
        background: 'rgba(18, 14, 43, 0.85)',
        border: '1.5px solid var(--purple-border)',
        borderRadius: '20px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Banner with Crack Animation if Broken */}
        <div style={{
          position: 'relative',
          padding: '14px 20px',
          borderRadius: '16px',
          background: brokenBanner
            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(18, 14, 43, 0.95))'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(18, 14, 43, 0.95))',
          border: `2px solid ${brokenBanner ? 'var(--coral)' : 'var(--purple-border)'}`,
          boxShadow: brokenBanner ? '0 0 25px var(--coral-glow)' : 'var(--shadow-subtle)',
          textAlign: 'center',
          transition: 'all 0.3s'
        }}>
          <div style={{ fontSize: '0.9rem', color: brokenBanner ? 'var(--coral-bright)' : 'var(--gold-bright)', fontWeight: 700 }}>
            {brokenBanner ? '💥 GENERAL CLAIM SHATTERED BY COUNTEREXAMPLE' : '📜 GENERAL CLAIM UNDER TRIAL'}
          </div>
          <div style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginTop: '4px',
            textDecoration: brokenBanner ? 'line-through' : 'none'
          }}>
            "{statement}"
          </div>
          {brokenBanner && (
            <div style={{ marginTop: '6px', fontSize: '0.95rem', color: 'var(--coral-bright)', fontWeight: 700 }}>
              Just one counterexample is enough to prove a rule false!
            </div>
          )}
        </div>

        {/* Counter Candidate Tiles */}
        <div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Test test values against the claim. Can you find a counterexample?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {counterTestValues.map((item, idx) => {
              const isTested = testedCounters[idx];

              return (
                <button
                  key={idx}
                  onClick={() => handleTestValue(idx, item)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isTested
                      ? (item.breaks ? 'rgba(244, 63, 94, 0.25)' : 'rgba(16, 185, 129, 0.2)')
                      : 'rgba(30, 24, 70, 0.8)',
                    border: `1.5px solid ${isTested ? (item.breaks ? 'var(--coral)' : 'var(--neon-green)') : 'var(--purple-border)'}`,
                    color: 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.05rem' }}>
                      {item.label}
                    </span>
                    {isTested && (
                      <span style={{ fontSize: '1rem' }}>
                        {item.breaks ? '🔨' : '✓'}
                      </span>
                    )}
                  </div>
                  {isTested && (
                    <span style={{ fontSize: '0.85rem', color: item.breaks ? 'var(--coral-bright)' : 'var(--text-dim)' }}>
                      {item.note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MODE 4: BUILD (Answer -> Reason -> Conclusion)
  // ==========================================
  const handleAssignTile = (tile, targetSlot) => {
    sounds.click();
    // Validate slot match
    if (tile.slotType !== targetSlot) {
      sounds.wrong();
      return;
    }

    sounds.correct();
    setSlots(prev => ({ ...prev, [targetSlot]: tile }));
    setAvailableTiles(prev => prev.filter(t => t.id !== tile.id));

    // Check if all 3 slots filled
    const nextSlots = { ...slots, [targetSlot]: tile };
    if (nextSlots.answer && nextSlots.reason && nextSlots.conclusion) {
      sounds.celebration();
      if (onBuildComplete) {
        onBuildComplete(nextSlots);
      }
    }
  };

  const handleRemoveTile = (slotKey) => {
    const tile = slots[slotKey];
    if (!tile) return;
    sounds.pop();
    setSlots(prev => ({ ...prev, [slotKey]: null }));
    setAvailableTiles(prev => [...prev, tile]);
  };

  return (
    <div className="justification-board build-mode-board" style={{
      background: 'rgba(18, 14, 43, 0.85)',
      border: '1.5px solid var(--purple-border)',
      borderRadius: '20px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* 3 Step Habit Bar: Answer -> Reason -> Conclusion */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {/* Slot 1: Answer */}
        <div style={{
          background: slots.answer ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 24, 70, 0.6)',
          border: `1.5px ${slots.answer ? 'solid var(--teal-bright)' : 'dashed var(--purple-border)'}`,
          borderRadius: '14px',
          padding: '12px',
          minHeight: '85px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--teal-bright)' }}>
              1. ANSWER {slots.answer ? '✓' : ''}
            </span>
            {slots.answer && (
              <button
                onClick={() => handleRemoveTile('answer')}
                style={{ background: 'none', border: 'none', color: 'var(--coral-bright)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.95rem', color: slots.answer ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: slots.answer ? 'normal' : 'italic' }}>
            {slots.answer ? slots.answer.text : 'Click an Answer tile below'}
          </div>
        </div>

        {/* Slot 2: Reason */}
        <div style={{
          background: slots.reason ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 24, 70, 0.6)',
          border: `1.5px ${slots.reason ? 'solid var(--gold-bright)' : 'dashed var(--purple-border)'}`,
          borderRadius: '14px',
          padding: '12px',
          minHeight: '85px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
              2. REASON / CHECK {slots.reason ? '✓' : ''}
            </span>
            {slots.reason && (
              <button
                onClick={() => handleRemoveTile('reason')}
                style={{ background: 'none', border: 'none', color: 'var(--coral-bright)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.95rem', color: slots.reason ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: slots.reason ? 'normal' : 'italic' }}>
            {slots.reason ? slots.reason.text : 'Click a Reason / Check tile below'}
          </div>
        </div>

        {/* Slot 3: Conclusion */}
        <div style={{
          background: slots.conclusion ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 24, 70, 0.6)',
          border: `1.5px ${slots.conclusion ? 'solid var(--neon-green)' : 'dashed var(--purple-border)'}`,
          borderRadius: '14px',
          padding: '12px',
          minHeight: '85px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--neon-green)' }}>
              3. CONCLUSION WITH UNITS {slots.conclusion ? '✓' : ''}
            </span>
            {slots.conclusion && (
              <button
                onClick={() => handleRemoveTile('conclusion')}
                style={{ background: 'none', border: 'none', color: 'var(--coral-bright)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.95rem', color: slots.conclusion ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: slots.conclusion ? 'normal' : 'italic' }}>
            {slots.conclusion ? slots.conclusion.text : 'Click a Conclusion tile below'}
          </div>
        </div>
      </div>

      {/* Available Sentence Tiles Pool */}
      {availableTiles.length > 0 && (
        <div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
            Select tiles to place them into the justification sequence:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleAssignTile(tile, tile.slotType)}
                style={{
                  background: 'rgba(35, 27, 85, 0.9)',
                  border: '1.5px solid var(--purple-border)',
                  color: 'var(--text-main)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-subtle)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>➕</span>
                <span>{tile.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
