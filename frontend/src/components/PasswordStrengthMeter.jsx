import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  // Evaluate rules
  const hasMinLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const passedCount = [
    hasMinLength,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;

  let strengthLabel = 'Very Weak';
  let badgeClass = 'bg-danger';
  let progressWidth = 20;

  if (passedCount === 2) {
    strengthLabel = 'Weak';
    badgeClass = 'bg-danger';
    progressWidth = 40;
  } else if (passedCount === 3) {
    strengthLabel = 'Fair';
    badgeClass = 'bg-warning text-dark';
    progressWidth = 60;
  } else if (passedCount === 4) {
    strengthLabel = 'Good';
    badgeClass = 'bg-info text-dark';
    progressWidth = 80;
  } else if (passedCount === 5) {
    strengthLabel = 'Strong';
    badgeClass = 'bg-success';
    progressWidth = 100;
  }

  return (
    <div className="password-strength-container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="small text-muted">Password Strength:</span>
        <span className={`badge ${badgeClass} px-2 py-1`}>{strengthLabel}</span>
      </div>
      <div className="progress" style={{ height: '6px' }}>
        <div
          className={`progress-bar ${badgeClass}`}
          role="progressbar"
          style={{ width: `${progressWidth}%`, transition: 'width 0.3s ease' }}
          aria-valuenow={progressWidth}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div className="row g-1 mt-2 small text-muted">
        <div className={`col-6 ${hasMinLength ? 'text-success fw-semibold' : ''}`}>
          <i className={`bi ${hasMinLength ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
          Min 8 characters
        </div>
        <div className={`col-6 ${hasUpperCase && hasLowerCase ? 'text-success fw-semibold' : ''}`}>
          <i className={`bi ${hasUpperCase && hasLowerCase ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
          Upper & lower case
        </div>
        <div className={`col-6 ${hasNumber ? 'text-success fw-semibold' : ''}`}>
          <i className={`bi ${hasNumber ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
          At least 1 number
        </div>
        <div className={`col-6 ${hasSpecialChar ? 'text-success fw-semibold' : ''}`}>
          <i className={`bi ${hasSpecialChar ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
          1 special symbol
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
