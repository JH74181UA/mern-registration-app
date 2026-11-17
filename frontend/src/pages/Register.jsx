import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import InputField from '../components/InputField';
import PasswordInput from '../components/PasswordInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { registerUser } from '../services/api';

const initialFormData = {
  fullName: '',
  email: '',
  mobileNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
  gender: '',
  dateOfBirth: '',
  address: ''
};

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [serverError, setServerError] = useState(null);

  // Field level validation function
  const validateField = (name, value, allData = formData) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full Name is required.';
        } else if (value.trim().length < 2) {
          error = 'Full Name must be at least 2 characters.';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          error = 'Full Name can only contain letters, spaces, dots, and hyphens.';
        }
        break;

      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value.trim()) {
          error = 'Email address is required.';
        } else if (!emailRegex.test(value.trim())) {
          error = 'Please enter a valid email address (e.g. user@example.com).';
        }
        break;

      case 'mobileNumber':
        const mobileRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          error = 'Mobile number is required.';
        } else if (!mobileRegex.test(value.trim())) {
          error = 'Please enter a valid 10-digit mobile number.';
        }
        break;

      case 'username':
        const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
        if (!value.trim()) {
          error = 'Username is required.';
        } else if (!usernameRegex.test(value.trim())) {
          error = 'Username must be 3-30 characters (letters, numbers, _, -, .).';
        }
        break;

      case 'password':
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!value) {
          error = 'Password is required.';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long.';
        } else if (!strongPasswordRegex.test(value)) {
          error =
            'Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special symbol.';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password.';
        } else if (value !== allData.password) {
          error = 'Passwords do not match.';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Please select your gender.';
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          error = 'Date of birth is required.';
        } else {
          const dob = new Date(value);
          const today = new Date();
          if (isNaN(dob.getTime())) {
            error = 'Invalid date format.';
          } else if (dob >= today) {
            error = 'Date of birth must be in the past.';
          }
        }
        break;

      case 'address':
        if (!value.trim()) {
          error = 'Address is required.';
        } else if (value.trim().length < 5) {
          error = 'Address must be at least 5 characters long.';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Full form validation check
  const validateForm = () => {
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key], formData);
      if (err) {
        currentErrors[key] = err;
      }
    });
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    if (touched[name]) {
      const fieldError = validateField(name, value, updatedForm);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }

    if (name === 'password' && touched.confirmPassword) {
      const confirmErr = validateField(
        'confirmPassword',
        formData.confirmPassword,
        updatedForm
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  // Blur handler
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerSuccess(null);
    setServerError(null);

    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const isValid = validateForm();
    if (!isValid) {
      setServerError('Please fix the errors in the form before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Send data to backend and save in MongoDB
      const response = await registerUser(formData);

      // 2. Display success message
      setServerSuccess('Registration Successful! Redirecting to Home page...');

      // Save user session in localStorage
      localStorage.setItem('currentUser', JSON.stringify(response.data));

      // Reset form
      setFormData(initialFormData);
      setErrors({});
      setTouched({});

      // 3. Automatically navigate to Home Page using useNavigate
      setTimeout(() => {
        navigate('/home', {
          state: {
            message: 'Registration Successful!',
            user: response.data
          }
        });
      }, 1200);
    } catch (err) {
      console.error('Registration failed:', err);
      // 5. Stay on Registration Page and display appropriate error message
      if (err.errors) {
        setErrors((prev) => ({ ...prev, ...err.errors }));
      }
      setServerError(
        err.message || 'Registration failed. Please check your information and try again.'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setServerSuccess(null);
    setServerError(null);
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card registration-card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header Banner */}
            <div className="card-header bg-gradient-primary text-white p-4 p-md-5 text-center position-relative">
              <div className="registration-badge mb-2 d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-25 text-white small fw-semibold">
                <i className="bi bi-shield-lock-fill"></i> Secure 256-bit Registration
              </div>
              <h2 className="card-title fw-bold mb-2">Create Your Account</h2>
              <p className="card-subtitle text-white-50 mb-0">
                Join our platform today. Fill out your details below to get started.
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Success Alert Banner */}
              {serverSuccess && (
                <div
                  className="alert alert-success alert-dismissible fade show rounded-3 p-4 mb-4 shadow-sm border-0 border-start border-success border-4"
                  role="alert"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="spinner-border spinner-border-sm text-success"
                      role="status"
                    ></div>
                    <div>
                      <h5 className="alert-heading fw-bold mb-1">{serverSuccess}</h5>
                      <p className="mb-0 text-secondary small">
                        Please wait while we direct you to your personalized home dashboard...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Alert Banner */}
              {serverError && (
                <div
                  className="alert alert-danger alert-dismissible fade show rounded-3 p-3 mb-4 shadow-sm border-0 border-start border-danger border-4"
                  role="alert"
                >
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                    <div className="flex-grow-1">
                      <strong className="d-block">Submission Error</strong>
                      <span className="small">{serverError}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setServerError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} noValidate>
                {/* Section 1: Personal Details */}
                <h5 className="form-section-title text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person-badge-fill"></i>
                  1. Personal Details
                </h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <InputField
                      label="Full Name"
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.fullName}
                      touched={touched.fullName}
                      icon="bi-person"
                      required
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      label="Email Address"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.email}
                      touched={touched.email}
                      icon="bi-envelope"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      label="Mobile Number"
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder="10-digit number (e.g. 9876543210)"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.mobileNumber}
                      touched={touched.mobileNumber}
                      icon="bi-telephone"
                      required
                      disabled={isLoading}
                      autoComplete="tel"
                      helperText="Must be exactly 10 digits."
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      label="Username"
                      id="username"
                      name="username"
                      placeholder="e.g. johndoe99"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.username}
                      touched={touched.username}
                      icon="bi-at"
                      required
                      disabled={isLoading}
                      autoComplete="username"
                      helperText="3-30 chars (letters, numbers, _, -, .)"
                    />
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                {/* Section 2: Security & Credentials */}
                <h5 className="form-section-title text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check"></i>
                  2. Security & Credentials
                </h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <PasswordInput
                      label="Password"
                      id="password"
                      name="password"
                      placeholder="Enter strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <PasswordStrengthMeter password={formData.password} />
                  </div>

                  <div className="col-12 col-md-6">
                    <PasswordInput
                      label="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.confirmPassword}
                      touched={touched.confirmPassword}
                      icon="bi-lock-fill"
                      required
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <hr className="my-4 text-muted opacity-25" />

                {/* Section 3: Demographic & Location Info */}
                <h5 className="form-section-title text-primary fw-bold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill"></i>
                  3. Demographic & Location Information
                </h5>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="gender" className="form-label fw-semibold text-secondary">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <div className="input-group has-validation">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-gender-ambiguous text-muted"></i>
                        </span>
                        <select
                          id="gender"
                          name="gender"
                          className={`form-select border-start-0 ${
                            touched.gender && errors.gender
                              ? 'is-invalid'
                              : touched.gender && !errors.gender && formData.gender
                              ? 'is-valid'
                              : ''
                          }`}
                          value={formData.gender}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                          required
                        >
                          <option value="">-- Select Gender --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        {touched.gender && errors.gender && (
                          <div className="invalid-feedback d-block">{errors.gender}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <InputField
                      label="Date of Birth"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.dateOfBirth}
                      touched={touched.dateOfBirth}
                      icon="bi-calendar-event"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="col-12">
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label fw-semibold text-secondary">
                        Residential Address <span className="text-danger">*</span>
                      </label>
                      <div className="input-group has-validation">
                        <span className="input-group-text bg-light border-end-0 align-items-start pt-2">
                          <i className="bi bi-house-door text-muted"></i>
                        </span>
                        <textarea
                          id="address"
                          name="address"
                          rows="3"
                          className={`form-control border-start-0 ${
                            touched.address && errors.address
                              ? 'is-invalid'
                              : touched.address && !errors.address && formData.address
                              ? 'is-valid'
                              : ''
                          }`}
                          placeholder="Enter your street address, apartment, city, state, and postal code"
                          value={formData.address}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isLoading}
                          required
                        ></textarea>
                        {touched.address && errors.address && (
                          <div className="invalid-feedback d-block">{errors.address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="d-flex flex-column flex-sm-row gap-3 pt-3 mt-4 border-top">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-4 flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span>Registering Account...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle fs-5"></i>
                        <span>Register Now</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleReset}
                    disabled={isLoading}
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <span>Reset Form</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="card-footer bg-light py-3 px-4 text-center border-0 small text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
