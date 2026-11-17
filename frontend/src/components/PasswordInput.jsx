import React, { useState } from 'react';

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = true,
  icon = 'bi-lock',
  helperText,
  disabled = false,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isInvalid = touched && Boolean(error);
  const isValid = touched && !error && value && value.length >= 8;

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold text-secondary">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group has-validation">
        {icon && (
          <span className="input-group-text bg-light border-end-0">
            <i className={`bi ${icon} text-muted`}></i>
          </span>
        )}
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          className={`form-control ${icon ? 'border-start-0' : ''} border-end-0 ${
            isInvalid ? 'is-invalid' : isValid ? 'is-valid' : ''
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          required={required}
        />
        <button
          type="button"
          className="btn btn-outline-secondary border-start-0 bg-light"
          onClick={togglePasswordVisibility}
          tabIndex="-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} text-muted`}></i>
        </button>
        {isInvalid && <div className="invalid-feedback d-block">{error}</div>}
      </div>
      {!isInvalid && helperText && (
        <small className="form-text text-muted">{helperText}</small>
      )}
    </div>
  );
};

export default PasswordInput;
