import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { getRegisteredUsers } from './services/api';
import './App.css';

// Navigation bar component with active link indicators
const Navbar = ({ onOpenDbModal, loadingUsers }) => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/home">
          <span className="brand-icon d-inline-flex justify-content-center align-items-center rounded-3 bg-primary text-white p-2">
            <i className="bi bi-shield-lock"></i>
          </span>
          <span>AuthSphere</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/register' ? 'active fw-bold' : ''}`}
                to="/register"
              >
                <i className="bi bi-person-plus me-1"></i> Register
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/login' ? 'active fw-bold' : ''}`}
                to="/login"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/home' ? 'active fw-bold' : ''}`}
                to="/home"
              >
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-info btn-sm d-flex align-items-center gap-2"
              onClick={onOpenDbModal}
              disabled={loadingUsers}
              title="View all registered users from MongoDB"
            >
              <i className="bi bi-database-check"></i>
              <span>{loadingUsers ? 'Loading DB...' : 'View DB Users'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  const [usersList, setUsersList] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userFetchError, setUserFetchError] = useState('');

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUserFetchError('');
    try {
      const result = await getRegisteredUsers();
      setUsersList(result.data || []);
      setShowUsersModal(true);
    } catch (err) {
      setUserFetchError(err.message || 'Failed to retrieve registered users.');
      setShowUsersModal(true);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar onOpenDbModal={fetchUsers} loadingUsers={loadingUsers} />

        {/* Main Content Pages */}
        <main className="flex-grow-1 py-4">
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </main>

        {/* Database Verification Modal */}
        {showUsersModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content shadow-lg border-0 rounded-4">
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <i className="bi bi-server text-info"></i>
                    Database Records (registrationDB / users)
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowUsersModal(false)}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body p-4">
                  {userFetchError && (
                    <div className="alert alert-danger d-flex align-items-center gap-2">
                      <i className="bi bi-exclamation-octagon-fill"></i>
                      <div>{userFetchError}</div>
                    </div>
                  )}

                  {!userFetchError && usersList.length === 0 && (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                      <p className="mb-0">No users found in database yet.</p>
                      <small>Submit the registration form to create the first record.</small>
                    </div>
                  )}

                  {!userFetchError && usersList.length > 0 && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-primary fs-6">
                          Total Users: {usersList.length}
                        </span>
                        <small className="text-muted">
                          <i className="bi bi-shield-check text-success me-1"></i>
                          Passwords are encrypted with bcrypt & stripped from responses.
                        </small>
                      </div>

                      <div className="table-responsive">
                        <table className="table table-hover align-middle border">
                          <thead className="table-light">
                            <tr>
                              <th>#</th>
                              <th>Full Name</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Mobile</th>
                              <th>Gender</th>
                              <th>DOB</th>
                              <th>Created At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usersList.map((user, index) => (
                              <tr key={user._id || index}>
                                <td>{index + 1}</td>
                                <td className="fw-semibold">{user.fullName}</td>
                                <td>
                                  <span className="badge bg-light text-dark border">
                                    @{user.username}
                                  </span>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.mobileNumber}</td>
                                <td>{user.gender}</td>
                                <td>
                                  {user.dateOfBirth
                                    ? new Date(user.dateOfBirth).toLocaleDateString()
                                    : '-'}
                                </td>
                                <td className="small text-muted">
                                  {user.createdAt
                                    ? new Date(user.createdAt).toLocaleString()
                                    : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUsersModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={fetchUsers}
                    disabled={loadingUsers}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
          <div className="container">
            <p className="mb-0">
              Full-Stack User Registration App &copy; {new Date().getFullYear()} &bull; Built with
              React 19, React Router DOM, Express & MongoDB
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
