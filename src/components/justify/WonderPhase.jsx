import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/justifyNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function WonderPhase({ onNext, onAddXP }) {
  const [revealedCards, setRevealedCards] = useState({});
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    unlockAudio();
    narrate(NARRATION.wonder.intro.text, NARRATION.wonder.intro.style);
    return () => {
      stopNarration();
    };
  }, []);

  const handleCardClick = (id, cardData) => {
    unlockAudio();
    sounds.click();
    const isNew = !revealedCards[id];

    setRevealedCards(prev => ({ ...prev, [id]: true }));
    setActiveCardId(id);

    if (isNew) {
      sounds.ding();
      onAddXP(15);
    }

    narrate(cardData.answer, cardData.style);
  };

  const handleReplayIntro = (e) => {
    e.stopPropagation();
    unlockAudio();
    sounds.pop();
    narrate(NARRATION.wonder.intro.text, NARRATION.wonder.intro.style);
  };

  const allRevealed = Object.keys(revealedCards).length >= 3;

  const items = [
    {
      id: 'why',
      icon: '⚖️',
      question: NARRATION.wonder.why.question,
      answer: NARRATION.wonder.why.answer,
      badge: 'Lucky Guess vs Proof',
      style: NARRATION.wonder.why.style
    },
    {
      id: 'examples',
      icon: '🔨',
      question: NARRATION.wonder.examples.question,
      answer: NARRATION.wonder.examples.answer,
      badge: 'Power of Counterexamples',
      style: NARRATION.wonder.examples.style
    },
    {
      id: 'check',
      icon: '🎯',
      question: NARRATION.wonder.check.question,
      answer: NARRATION.wonder.check.answer,
      badge: 'Three Ways to Verify',
      style: NARRATION.wonder.check.style
    }
  ];

  return (
    <div className="glass-card wonder-phase-card">
      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '6px' }}>
            <span>🔮 Phase 01</span> <span>• Wonder & Spark</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            Why Isn't An Answer Enough?
          </h2>
        </div>
        <button
          className="btn-replay-audio"
          onClick={handleReplayIntro}
          title="Replay Judge's Introduction"
          aria-label="Replay Audio"
        >
          <span>🔊</span> <span>Hear Ravi's Challenge</span>
        </button>
      </div>

      {/* Mascot Speech Bubble Row */}
      <div className="mascot-container" style={{ margin: '8px 0' }}>
        <div className="mascot" style={{ fontSize: '2.6rem' }}>🦊⚖️</div>
        <div className="speech-bubble">
          <div className="speaker-name">Ravi the Judge</div>
          <p>{NARRATION.wonder.intro.text}</p>
        </div>
      </div>

      {/* 3 Interactive Wonder Cards */}
      <div className="wonder-cards-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        margin: '12px 0'
      }}>
        {items.map((item) => {
          const isRevealed = revealedCards[item.id];
          const isActive = activeCardId === item.id;

          return (
            <div
              key={item.id}
              className={`wonder-card ${isRevealed ? 'revealed' : ''} ${isActive ? 'active' : ''}`}
              onClick={() => handleCardClick(item.id, item)}
              style={{
                background: isRevealed ? 'rgba(32, 24, 76, 0.95)' : 'rgba(22, 17, 56, 0.85)',
                border: `1.5px solid ${isRevealed ? (isActive ? 'var(--gold-bright)' : 'var(--neon-green)') : 'var(--purple-border)'}`,
                borderRadius: '18px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px',
                boxShadow: isActive ? '0 0 20px var(--gold-glow)' : 'var(--shadow-subtle)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                  <span className="badge badge-teal" style={{ fontSize: '0.8rem', padding: '3px 10px' }}>
                    {item.badge}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: '6px 0', lineHeight: 1.3 }}>
                  {item.question}
                </h4>
              </div>

              {isRevealed ? (
                <div style={{
                  marginTop: '10px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.45
                }}>
                  {item.answer}
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--gold-bright)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  marginTop: '12px'
                }}>
                  <span>Tap to reveal the reasoning</span> <span>➔</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        <div style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
          {allRevealed ? '✓ All three principles unlocked! Ready for the Story.' : 'Tap all 3 cards to unlock the Story phase (+15 XP each).'}
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            sounds.click();
            onNext();
          }}
          disabled={!allRevealed}
          style={{
            opacity: allRevealed ? 1 : 0.5,
            cursor: allRevealed ? 'pointer' : 'not-allowed',
            padding: '12px 32px'
          }}
        >
          <span>Continue to Concept Story</span>
          <span>➔</span>
        </button>
      </div>
    </div>
  );
}
