import React, { useReducer, useEffect } from 'react';
import {
  PHASES,
  loadStoredProgress,
  progressReducer
} from './state/justifyProgress.js';
import {
  setNarrationMuted,
  stopNarration,
  sounds
} from './utils/audio.js';

import FloatingShapes from './components/justify/FloatingShapes.jsx';
import IntroScreen from './components/justify/IntroScreen.jsx';
import WonderPhase from './components/justify/WonderPhase.jsx';
import StoryPhase from './components/justify/StoryPhase.jsx';
import StationsPhase from './components/justify/StationsPhase.jsx';
import PracticeMode from './components/justify/PracticeMode.jsx';
import ReflectCheck from './components/justify/ReflectCheck.jsx';
import SummaryScreen from './components/justify/SummaryScreen.jsx';

export default function App() {
  const [state, dispatch] = useReducer(progressReducer, null, loadStoredProgress);

  useEffect(() => {
    setNarrationMuted(state.isMuted);
  }, [state.isMuted]);

  const handleAudioToggle = () => {
    sounds.click();
    dispatch({ type: 'TOGGLE_MUTE' });
    if (!state.isMuted) {
      stopNarration();
    }
  };

  const handleHomeClick = () => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  };

  const handleStepClick = (stepId) => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'SET_PHASE', payload: stepId });
  };

  const handleNextPhase = (nextPhaseId) => {
    stopNarration();
    dispatch({ type: 'COMPLETE_PHASE', payload: state.phase });
    dispatch({ type: 'SET_PHASE', payload: nextPhaseId });
  };

  const handleAddXP = (amount) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  };

  const handleCompleteStation = (stationKey) => {
    dispatch({ type: 'COMPLETE_STATION', payload: stationKey });
  };

  const handleRecordPractice = (isCorrect, question) => {
    dispatch({ type: 'RECORD_PRACTICE', payload: { isCorrect, question } });
  };

  const handleSaveReflection = (data) => {
    dispatch({ type: 'SAVE_REFLECTION', payload: data });
  };

  const handleRestart = () => {
    sounds.click();
    stopNarration();
    dispatch({ type: 'RESET_ALL' });
  };

  const isIntro = state.phase === 'intro';

  return (
    <div className="app-root">
      {/* Background Floating Glyphs */}
      <FloatingShapes />

      {/* Top Header Bar: Visible on all lesson phases and summary */}
      {!isIntro && (
        <header className="top-header-bar">
          {/* Top-Left: Home Pill */}
          <button className="home-btn" onClick={handleHomeClick} aria-label="Go to Home">
            <span>🏠</span> <span>Home</span>
          </button>

          {/* Top-Center Group: 5-Step Journey Bar + Beside Mute Button */}
          <div className="journey-and-audio-group">
            <nav className="journey-bar" aria-label="Lesson Journey">
              {PHASES.map((step, idx) => {
                const isActive = state.phase === step.id;
                const isCompleted = state.completedPhases.includes(step.id);

                return (
                  <React.Fragment key={step.id}>
                    <button
                      className={`journey-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      onClick={() => handleStepClick(step.id)}
                      title={`${step.num} ${step.label}`}
                    >
                      <span className="step-dot">
                        {isCompleted ? '✓' : step.num}
                      </span>
                      <span className="step-icon">{step.icon}</span>
                      <span className="step-label">{step.label}</span>
                    </button>

                    {idx < PHASES.length - 1 && (
                      <div
                        className={`journey-connector ${
                          state.completedPhases.includes(step.id) ? 'completed' : ''
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>

            {/* Mute Button located right beside the nav bar */}
            <button
              className={`audio-toggle-btn ${!state.isMuted ? 'playing' : ''}`}
              onClick={handleAudioToggle}
              aria-label={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              title={state.isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {state.isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </header>
      )}

      {/* Main Container - Fitted to Screen without Page Scroll */}
      <main className={`app-container ${isIntro ? 'intro-layout' : 'lesson-layout'}`}>
        {state.phase === 'intro' && (
          <IntroScreen
            state={state}
            onStart={(targetPhase) => dispatch({ type: 'SET_PHASE', payload: targetPhase })}
          />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            onNext={() => handleNextPhase('story')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            onNext={() => handleNextPhase('stations')}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'stations' && (
          <StationsPhase
            state={state}
            onNext={() => handleNextPhase('practice')}
            onCompleteStation={handleCompleteStation}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'practice' && (
          <PracticeMode
            state={state}
            onNext={() => handleNextPhase('reflect')}
            onRecordPractice={handleRecordPractice}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'reflect' && (
          <ReflectCheck
            onNext={() => handleNextPhase('summary')}
            onSaveReflection={handleSaveReflection}
            onAddXP={handleAddXP}
          />
        )}

        {state.phase === 'summary' && (
          <SummaryScreen
            state={state}
            onRestart={handleRestart}
            onPracticeMore={() => dispatch({ type: 'SET_PHASE', payload: 'practice' })}
          />
        )}
      </main>
    </div>
  );
}
