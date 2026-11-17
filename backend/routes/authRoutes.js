const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validationMiddleware');

// POST /api/auth/register -> Register a new user
router.post('/register', validateRegistration, registerUser);

// POST /api/auth/login -> Authenticate user
router.post('/login', loginUser);

// GET /api/auth/users -> Retrieve registered users (for testing & verification)
router.get('/users', getUsers);

module.exports = router;
