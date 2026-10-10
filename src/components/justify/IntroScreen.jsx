import React from 'react';
import { sounds, narrate, unlockAudio } from '../../utils/audio.js';

export default function IntroScreen({ state, onStart }) {
  const handleStart = () => {
    unlockAudio();
    sounds.ding();
    onStart('wonder');
  };

  const handleMascotClick = () => {
    unlockAudio();
    sounds.pop();
    narrate("Welcome to my courtroom! Maya has a claim, but I need proof. Can you help justify each solution with ironclad reasoning?", "encouragement");
  };

  return (
    <div className="home-screen-wrapper">
      {/* Top Bar: Curriculum Badge & Close Button */}
      <div className="home-top-bar">
        <div className="curriculum-badge">
          <span className="badge-sparkle">✓</span>
          <span>MOE Curriculum • Lower Secondary Mathematics</span>
        </div>

        <button className="top-close-btn" aria-label="Close" onClick={() => window.history.back?.()}>
          <span>✕</span>
        </button>
      </div>

      {/* Hero Title Block */}
      <div className="home-hero-section">
        <h1 className="quest-title-white">Mathematical Reasoning & Communication</h1>
        <h2 className="quest-title-yellow">Justify Solutions</h2>
      </div>

      {/* Mascot Speech Bubble Pill (Clickable to hear voice) */}
      <div
        className="mascot-pill-row"
        onClick={handleMascotClick}
        style={{ cursor: 'pointer' }}
        title="Tap to listen to Ravi the Judge!"
      >
        <div className="mascot-circle-avatar" role="img" aria-label="Ravi the Judge Fox">
          🦊⚖️
        </div>
        <div className="mascot-white-pill">
          <span>Ravi the Judge: "Convince me with proof!"</span>
          <span style={{ marginLeft: '8px', fontSize: '0.9rem' }}>🔊</span>
        </div>
      </div>

      {/* Mission Subtitle Description */}
      <p className="home-mission-desc">
        Join Maya and Ravi the Judge to verify algebraic solutions, test reasonableness through estimation,
        break false claims with counterexamples, and communicate clear mathematical arguments!
      </p>

      {/* Learning Journey Overview Box */}
      <div className="journey-roadmap-card">
        <div className="roadmap-title">YOUR LEARNING JOURNEY</div>

        <div className="roadmap-flow">
          {/* Row 1: Wonder -> Story -> Simulate */}
          <div className="roadmap-row">
            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🔮</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">01 WONDER</span>
                <span className="node-title">Why Reasons Matter</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>📐</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">02 STORY</span>
                <span className="node-title">The Three-Part Habit</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🧪</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">03 SIMULATE</span>
                <span className="node-title">Interactive Labs</span>
              </div>
            </div>
          </div>

          {/* Row 2: Practice -> Reflect */}
          <div className="roadmap-row" style={{ marginTop: '12px' }}>
            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>🎮</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">04 PRACTICE</span>
                <span className="node-title">Reasoning Arena</span>
              </div>
            </div>

            <div className="roadmap-arrow">➔</div>

            <div className="roadmap-node">
              <div className="node-icon-circle purple-ring">
                <span>📓</span>
              </div>
              <div className="node-text-group">
                <span className="node-phase-tag">05 REFLECT</span>
                <span className="node-title">Deep Reflection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="home-action-row">
        <button className="start-quest-btn" onClick={handleStart}>
          <span>Enter Ravi's Courtroom</span>
          <span className="btn-arrow-icon">➔</span>
        </button>
      </div>
    </div>
  );
}
