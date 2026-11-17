import React from 'react';

const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required = false,
  icon,
  helperText,
  disabled = false,
  autoComplete
}) => {
  const isInvalid = touched && Boolean(error);
  const isValid = touched && !error && value && value.trim?.() !== '';

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
          type={type}
          id={id}
          name={name}
          className={`form-control ${icon ? 'border-start-0' : ''} ${
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
        {isInvalid && <div className="invalid-feedback d-block">{error}</div>}
      </div>
      {!isInvalid && helperText && (
        <small className="form-text text-muted">{helperText}</small>
      )}
    </div>
  );
};

export default InputField;
