import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    // If navigation state has a registration success message, display it
    if (location.state?.message) {
      setSuccessBanner(location.state.message);
    }

    // Retrieve user from navigation state or localStorage
    const stateUser = location.state?.user;
    if (stateUser) {
      setUser(stateUser);
      localStorage.setItem('currentUser', JSON.stringify(stateUser));
    } else {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse user from localStorage', e);
        }
      } else {
        // If no user is logged in or registered, navigate to login
        navigate('/login');
      }
    }
  }, [location, navigate]);

  const handleLogout = () => {
    // Clear stored session
    localStorage.removeItem('currentUser');
    // Navigate back to Login page
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      {/* Registration Success Banner */}
      {successBanner && (
        <div
          className="alert alert-success alert-dismissible fade show rounded-4 p-4 mb-4 shadow-sm border-0 border-start border-success border-4"
          role="alert"
        >
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-check-circle-fill text-success fs-2"></i>
            <div>
              <h5 className="alert-heading fw-bold mb-1">{successBanner}</h5>
              <p className="mb-0 text-secondary">
                Your account was created in MongoDB and you are now viewing your dashboard.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessBanner('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Main Hero Welcome Card */}
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-gradient-primary text-white p-4 p-md-5 position-relative">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-2 rounded-pill small">
                <i className="bi bi-person-check-fill me-1"></i> Active Session
              </span>
              <h1 className="display-6 fw-bold mb-2">
                Welcome, {user.fullName}! 👋
              </h1>
              <p className="lead text-white-50 mb-0">
                You have successfully registered and logged into the portal.
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end mt-3 mt-md-0">
              <button
                type="button"
                className="btn btn-danger btn-lg px-4 shadow-sm d-inline-flex align-items-center gap-2 fw-semibold rounded-pill"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Overview */}
        <div className="card-body p-4 p-md-5 bg-white">
          <h4 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-person-lines-fill text-primary"></i>
            Your Registered Profile Details
          </h4>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Full Name
                </div>
                <div className="fs-5 fw-bold text-dark">{user.fullName}</div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Username
                </div>
                <div className="fs-5 fw-bold text-primary">@{user.username}</div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Email Address
                </div>
                <div className="fs-6 fw-bold text-dark text-break">{user.email}</div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Mobile Number
                </div>
                <div className="fs-5 fw-bold text-dark">{user.mobileNumber}</div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Gender
                </div>
                <div className="fs-5 fw-bold text-dark">{user.gender || 'Not specified'}</div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-3 border rounded-3 bg-light h-100">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Date of Birth
                </div>
                <div className="fs-5 fw-bold text-dark">
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="p-3 border rounded-3 bg-light">
                <div className="text-muted small fw-semibold text-uppercase mb-1">
                  Residential Address
                </div>
                <div className="fs-6 text-dark">{user.address || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="mt-5 p-4 rounded-4 bg-light border d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
              <h5 className="fw-bold mb-1">Ready to test another account?</h5>
              <p className="text-muted mb-0 small">
                You can create additional test accounts or test login validation anytime.
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/register" className="btn btn-outline-primary fw-semibold">
                <i className="bi bi-person-plus me-1"></i> Register New User
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger fw-semibold"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
