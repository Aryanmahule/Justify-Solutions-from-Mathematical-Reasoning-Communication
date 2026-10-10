import React from 'react';
import JustificationBoardCanvas from './JustificationBoardCanvas.jsx';
import { sounds } from '../../utils/audio.js';

export default function QuestionCard({
  question,
  index,
  total,
  selectedOption,
  onSelectOption,
  isAnswered,
  isCorrect
}) {
  const letters = ['A', 'B', 'C', 'D'];

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    sounds.click();
    onSelectOption(option);
  };

  const badgeColorClass = {
    teal: 'badge-teal',
    purple: 'badge-purple',
    gold: 'badge-gold',
    coral: 'badge-coral',
    green: 'badge-teal'
  }[question.typeColor] || 'badge-teal';

  return (
    <div className="question-card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Top Question Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-bright)' }}>
            Q{index + 1} of {total}
          </span>
          <span className={`badge ${badgeColorClass}`}>
            <span>{question.typeIcon}</span> <span>{question.typeLabel}</span>
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', lineHeight: 1.45, margin: '2px 0', whiteSpace: 'pre-line' }}>
        {question.prompt}
      </h3>

      {/* Visual Canvas Display if expression/formula or numbers exist */}
      {question.expression && (
        <div style={{ margin: '2px 0' }}>
          <JustificationBoardCanvas
            mode="check"
            claim={question.formula}
            expression={question.expression}
            value={question.variables?.x || 6}
            showChecklist={false}
          />
        </div>
      )}

      {/* Options Grid (4 options with A, B, C, D pills) */}
      <div className="options-grid" style={{ margin: '6px 0', display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrectOption = option === question.correctAnswer;

          let btnClass = 'option-btn';
          if (isAnswered) {
            if (isCorrectOption) {
              btnClass += ' correct';
            } else if (isSelected && !isCorrect) {
              btnClass += ' wrong';
            }
          } else if (isSelected) {
            btnClass += ' selected';
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 18px',
                borderRadius: '14px',
                background: isAnswered
                  ? (isCorrectOption ? 'rgba(16, 185, 129, 0.25)' : (isSelected ? 'rgba(244, 63, 94, 0.25)' : 'rgba(26, 20, 62, 0.7)'))
                  : (isSelected ? 'rgba(45, 36, 100, 0.95)' : 'rgba(26, 20, 62, 0.8)'),
                border: `1.5px solid ${
                  isAnswered
                    ? (isCorrectOption ? 'var(--neon-green)' : (isSelected ? 'var(--coral)' : 'var(--purple-border)'))
                    : (isSelected ? 'var(--gold-bright)' : 'var(--purple-border)')
                }`,
                color: 'var(--text-main)',
                fontSize: '1.05rem',
                textAlign: 'left',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isAnswered
                    ? (isCorrectOption ? 'var(--neon-green)' : (isSelected ? 'var(--coral)' : 'rgba(255, 255, 255, 0.1)'))
                    : (isSelected ? 'var(--gold-bright)' : 'rgba(255, 255, 255, 0.1)'),
                  color: isSelected || (isAnswered && isCorrectOption) ? '#090317' : 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0
                }}
              >
                {letters[idx]}
              </span>
              <span style={{ flex: 1, lineHeight: 1.4 }}>{option}</span>
              {isAnswered && isCorrectOption && <span style={{ color: 'var(--neon-green)', fontWeight: 800, fontSize: '1.2rem' }}>✓</span>}
              {isAnswered && isSelected && !isCorrect && <span style={{ color: 'var(--coral)', fontWeight: 800, fontSize: '1.2rem' }}>✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation when answered */}
      {isAnswered && (
        <div
          style={{
            background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            border: `1.5px solid ${isCorrect ? 'var(--neon-green)' : 'var(--coral)'}`,
            borderRadius: '14px',
            padding: '12px 18px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.1rem' }}>{isCorrect ? '⚖️' : '💡'}</span>
            <span style={{ fontWeight: 800, color: isCorrect ? 'var(--neon-green)' : 'var(--coral-bright)', fontSize: '1.05rem' }}>
              {isCorrect ? 'Ravi the Judge agrees:' : 'Courtroom Examination:'}
            </span>
          </div>
          <p style={{ color: 'var(--text-main)', fontSize: '0.98rem', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-line' }}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
