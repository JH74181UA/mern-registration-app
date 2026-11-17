/**
 * Server-side input validation middleware for registration
 */
const validateRegistration = (req, res, next) => {
  const {
    fullName,
    email,
    mobileNumber,
    username,
    password,
    confirmPassword,
    gender,
    dateOfBirth,
    address
  } = req.body;

  const errors = {};

  // 1. Full Name validation
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    errors.fullName = 'Full Name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  } else if (fullName.trim().length > 100) {
    errors.fullName = 'Full Name cannot exceed 100 characters';
  }

  // 2. Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address';
  }

  // 3. Mobile Number validation
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.trim().length === 0) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!mobileRegex.test(mobileNumber.trim())) {
    errors.mobileNumber = 'Mobile number must be exactly 10 digits';
  }

  // 4. Username validation
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.username = 'Username is required';
  } else if (!usernameRegex.test(username.trim())) {
    errors.username = 'Username must be 3-30 characters and contain only letters, numbers, underscores, hyphens, or dots';
  }

  // 5. Password validation
  // Minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  } else if (!passwordStrengthRegex.test(password)) {
    errors.password = 'Password must include uppercase, lowercase, number, and special character';
  }

  // 6. Confirm Password validation
  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // 7. Gender validation
  const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  if (!gender || typeof gender !== 'string' || !validGenders.includes(gender)) {
    errors.gender = 'Please select a valid gender option (Male, Female, Other, or Prefer not to say)';
  }

  // 8. Date of Birth validation
  if (!dateOfBirth) {
    errors.dateOfBirth = 'Date of Birth is required';
  } else {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Please provide a valid date format';
    } else if (dob >= today) {
      errors.dateOfBirth = 'Date of Birth must be in the past';
    }
  }

  // 9. Address validation
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.address = 'Address is required';
  } else if (address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters long';
  }

  // If there are validation errors, reject request with 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the errors and try again.',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegistration
};
