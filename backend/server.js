const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to ensure DB connection is ready before handling requests (crucial for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed. Please check your MONGO_URI in environment variables.',
      error: err.message
    });
  }
});

// Dynamic CORS configuration (supports local dev, production domains, and any *.vercel.app preview URLs)
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.endsWith('.vercel.app') ||
        (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during initial setup
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'User Registration API is active on Vercel / Cloud',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Listen on port only when running standalone (not inside Vercel serverless function)
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server]: Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[API]: http://localhost:${PORT}/api/auth/register`);
  });
}

// Export app for Vercel Serverless Function
module.exports = app;
