import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.identifier.trim() || !formData.password) {
      setErrorMessage('Please enter your email/username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(formData);

      // Save user session in localStorage
      localStorage.setItem('currentUser', JSON.stringify(response.data));

      // Navigate to Home page using React Router
      navigate('/home', { state: { user: response.data } });
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(
        err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header */}
            <div className="card-header bg-gradient-primary text-white p-4 text-center">
              <div className="registration-badge mb-2 d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-25 text-white small fw-semibold">
                <i className="bi bi-box-arrow-in-right"></i> Welcome Back
              </div>
              <h3 className="card-title fw-bold mb-1">Sign In</h3>
              <p className="card-subtitle text-white-50 small mb-0">
                Access your account dashboard
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Error Alert */}
              {errorMessage && (
                <div
                  className="alert alert-danger alert-dismissible fade show rounded-3 p-3 mb-4 small"
                  role="alert"
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-exclamation-circle-fill text-danger fs-5"></i>
                    <div>{errorMessage}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setErrorMessage('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email / Username */}
                <div className="mb-3">
                  <label htmlFor="identifier" className="form-label fw-semibold text-secondary">
                    Email or Username <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      className="form-control border-start-0"
                      placeholder="e.g. user@example.com or johndoe"
                      value={formData.identifier}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold text-secondary">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-control border-start-0 border-end-0"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary border-start-0 bg-light"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex="-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <i
                        className={`bi ${
                          showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'
                        } text-muted`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right fs-5"></i>
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top small text-muted">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-primary text-decoration-none fw-semibold">
                  Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
