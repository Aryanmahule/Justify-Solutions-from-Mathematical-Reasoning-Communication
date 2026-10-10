import React from 'react';

const WATERMARKS = [
  { text: '✓', top: '5%', left: '4%', size: '3.6rem', color: 'rgba(16, 185, 129, 0.35)' },
  { text: 'therefore', top: '4%', left: '20%', size: '2.4rem', color: 'rgba(147, 112, 219, 0.35)' },
  { text: '?', top: '4%', left: '38%', size: '3.2rem', color: 'rgba(251, 191, 36, 0.35)' },
  { text: '3(6) − 4\n= 14', top: '3%', left: '62%', size: '2.6rem', color: 'rgba(6, 182, 212, 0.35)', multiline: true },
  { text: '✗', top: '4%', left: '80%', size: '3.2rem', color: 'rgba(244, 63, 94, 0.35)' },
  { text: '≈ 1000', top: '5%', left: '92%', size: '2.6rem', color: 'rgba(147, 112, 219, 0.35)' },
  { text: 'because', top: '16%', left: '88%', size: '2.2rem', color: 'rgba(147, 112, 219, 0.3)' },
  { text: '5 × 0.5', top: '38%', left: '2%', size: '2.8rem', color: 'rgba(251, 191, 36, 0.35)' },
  { text: '✓', top: '52%', left: '95%', size: '3.4rem', color: 'rgba(16, 185, 129, 0.35)' },
  { text: 'therefore', top: '64%', left: '3%', size: '2.4rem', color: 'rgba(147, 112, 219, 0.35)' },
  { text: '3(5) + 2\n= 17', top: '76%', left: '2%', size: '2.6rem', color: 'rgba(6, 182, 212, 0.35)', multiline: true },
  { text: 'Reason ✓', top: '75%', left: '86%', size: '2.6rem', color: 'rgba(251, 191, 36, 0.35)' },
];

export default function FloatingShapes() {
  return (
    <div className="floating-bg" aria-hidden="true">
      {WATERMARKS.map((item, idx) => (
        <span
          key={idx}
          className="floating-item"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            color: item.color,
            fontFamily: 'var(--font-fun)',
            fontWeight: 800,
            whiteSpace: 'pre-line',
            lineHeight: 1.1,
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
