const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      mobileNumber,
      username,
      password,
      gender,
      dateOfBirth,
      address
    } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // Check duplicate email
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        field: 'email',
        message: 'An account with this email address already exists. Please use another email.'
      });
    }

    // Check duplicate username
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        field: 'username',
        message: 'This username is already taken. Please choose another username.'
      });
    }

    // Create and save new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: normalizedEmail,
      mobileNumber: mobileNumber.trim(),
      username: normalizedUsername,
      password,
      gender,
      dateOfBirth,
      address: address.trim()
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'Registration Successful!',
      data: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        mobileNumber: savedUser.mobileNumber,
        username: savedUser.username,
        gender: savedUser.gender,
        dateOfBirth: savedUser.dateOfBirth,
        address: savedUser.address,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/username and password.'
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by either email or username
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { username: cleanIdentifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.'
      });
    }

    // Verify password using bcrypt
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        username: user.username,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users (for testing and verification purposes)
 * @route   GET /api/auth/users
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers
};
