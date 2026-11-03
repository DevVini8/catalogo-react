import React from 'react';
import './ProgressBar.css';

function ProgressBar({ value = 0, label = 'Carregando dados...' }) {
  const clampedValue = Math.min(
    100,
    Math.max(0, Math.round(Number(value) || 0))
  );

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>{label}</span>
        <strong>{clampedValue}%</strong>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
