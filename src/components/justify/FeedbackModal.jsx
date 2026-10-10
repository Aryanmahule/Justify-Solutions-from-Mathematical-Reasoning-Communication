import React, { useEffect } from 'react';

export default function FeedbackModal({ isOpen, isCorrect, title, message, hint, onClose }) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const defaultTitle = isCorrect ? 'Convincing! ✓' : 'Not quite! ✗';
  const displayTitle = title || defaultTitle;
  const displayText = message || (isCorrect ? 'Well reasoned! You provided solid mathematical proof.' : 'Check both sides by substituting, or hunt for a counterexample.');

  return (
    <div
      className="feedback-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 4, 20, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        cursor: 'pointer',
        animation: 'modalFadeIn 0.2s ease-out'
      }}
    >
      <div
        className={`feedback-modal-card ${isCorrect ? 'modal-correct' : 'modal-wrong'}`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: isCorrect ? '#10b981' : '#e11d48',
          color: '#ffffff',
          borderRadius: '28px',
          padding: '36px 42px',
          maxWidth: '480px',
          width: '90%',
          boxShadow: isCorrect
            ? '0 20px 60px rgba(16, 185, 129, 0.45)'
            : '0 20px 60px rgba(225, 29, 72, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '16px',
          position: 'relative',
          cursor: 'default'
        }}
      >
        <div style={{ fontSize: '3.6rem', lineHeight: 1 }}>
          {isCorrect ? '⚖️' : '💡'}
        </div>
        <h3 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-fun)' }}>
          {displayTitle}
        </h3>
        <p style={{ fontSize: '1.25rem', lineHeight: 1.5, opacity: 0.96, margin: 0 }}>
          {displayText}
        </p>
        {hint && (
          <div style={{
            fontSize: '1.05rem',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '10px 16px',
            borderRadius: '14px',
            width: '100%'
          }}>
            {hint}
          </div>
        )}
        <button
          className="btn-primary"
          onClick={onClose}
          style={{
            marginTop: '8px',
            background: '#ffffff',
            color: isCorrect ? '#065f46' : '#881337',
            fontWeight: 800,
            fontSize: '1.2rem',
            padding: '12px 36px',
            borderRadius: '9999px',
            border: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
