import React, { useState, useEffect } from 'react';
import { NARRATION } from '../../utils/justifyNarration.js';
import { narrate, sounds, stopNarration, unlockAudio } from '../../utils/audio.js';

export default function StoryPhase({ onNext, onAddXP }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [visitedSlides, setVisitedSlides] = useState({ 0: true });

  const slides = NARRATION.story;
  const currentSlide = slides[slideIndex];

  useEffect(() => {
    unlockAudio();
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style);
    }
    return () => {
      stopNarration();
    };
  }, [slideIndex]);

  const handleSlideChange = (newIdx) => {
    unlockAudio();
    sounds.click();
    if (!visitedSlides[newIdx]) {
      sounds.ding();
      setVisitedSlides(prev => ({ ...prev, [newIdx]: true }));
      onAddXP(20);
    }
    setSlideIndex(newIdx);
  };

  const handleReplay = () => {
    unlockAudio();
    sounds.pop();
    if (currentSlide?.narration) {
      narrate(currentSlide.narration, currentSlide.style);
    }
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      handleSlideChange(slideIndex + 1);
    } else {
      sounds.click();
      onNext();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      handleSlideChange(slideIndex - 1);
    }
  };

  return (
    <div className="glass-card story-phase-card">
      {/* Top Header */}
      <div className="phase-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge badge-teal" style={{ marginBottom: '6px' }}>
            <span>📐 Phase 02</span> <span>• Concept Story ({slideIndex + 1} of {slides.length})</span>
          </div>
          <h2 style={{ fontSize: '2.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-fun)' }}>
            {currentSlide.title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn-replay-audio"
            onClick={handleReplay}
            title="Replay Narration"
            aria-label="Replay Audio"
          >
            <span>🔊</span> <span>Hear Story</span>
          </button>
        </div>
      </div>

      {/* Slide Visual and Narrative Split Layout */}
      <div className="story-content-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '24px',
        alignItems: 'center',
        margin: '12px 0'
      }}>
        {/* Left: Illustration with Caption & Capsule Overlay */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1.5px solid var(--purple-border)' }}>
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            style={{
              width: '100%',
              height: '340px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Floating Capsule Badge */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(18, 14, 43, 0.92)',
            backdropFilter: 'blur(10px)',
            border: '1.5px solid var(--gold)',
            borderRadius: '12px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <div style={{ fontSize: '0.95rem', color: 'var(--gold-bright)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {currentSlide.capsule}
            </div>
          </div>
        </div>

        {/* Right: Narrative Story Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '1.15rem', color: 'var(--teal-bright)', fontWeight: 700, marginBottom: '6px' }}>
              {currentSlide.subtitle}
            </div>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              {currentSlide.story}
            </p>
          </div>

          {/* Critical Thinking Question Box */}
          <div style={{
            background: 'rgba(30, 24, 70, 0.75)',
            borderLeft: '4px solid var(--coral-bright)',
            borderRadius: '0 14px 14px 0',
            padding: '12px 18px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--coral-bright)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ravi's Courtroom Question
            </div>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', marginTop: '4px', fontWeight: 600 }}>
              {currentSlide.question}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pagination & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px' }}>
        {/* Slide Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSlideChange(idx)}
              style={{
                width: idx === slideIndex ? '32px' : '12px',
                height: '12px',
                borderRadius: '9999px',
                background: idx === slideIndex ? 'var(--gold-bright)' : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s'
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn-secondary"
            onClick={handlePrev}
            disabled={slideIndex === 0}
            style={{ opacity: slideIndex === 0 ? 0.4 : 1, padding: '10px 22px' }}
          >
            ← Previous
          </button>

          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ padding: '10px 26px' }}
          >
            <span>{slideIndex === slides.length - 1 ? 'Enter Simulate Labs' : 'Next Concept'}</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
