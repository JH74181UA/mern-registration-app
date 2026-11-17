# Full-Stack User Registration Application (MERN Stack)

A complete, responsive, and secure User Registration system built with **React 19**, **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **Bootstrap 5**.

---

## 📁 Project Folder Structure

```
day-4 task/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection using Mongoose
│   ├── controllers/
│   │   └── authController.js     # User registration logic & DB check
│   ├── middleware/
│   │   ├── errorMiddleware.js    # Global error & 404 handler
│   │   └── validationMiddleware.js # Server-side field validation
│   ├── models/
│   │   └── User.js               # Mongoose User model & bcrypt hashing
│   ├── routes/
│   │   └── authRoutes.js         # API routes (/api/auth/register)
│   ├── .env                      # Environment variables (Mongo URI & Port)
│   ├── .env.example              # Template for environment variables
│   ├── .gitignore                # Git ignore for node_modules and .env
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── public/
    │   └── ...
    ├── src/
    │   ├── components/
    │   │   ├── InputField.jsx           # Reusable validated form input
    │   │   ├── PasswordInput.jsx        # Show/Hide password toggle input
    │   │   └── PasswordStrengthMeter.jsx # Dynamic password strength bar
    │   ├── pages/
    │   │   └── Register.jsx             # Main registration form page
    │   ├── services/
    │   │   └── api.js                   # Axios client & API endpoints
    │   ├── App.css                      # Modern styles, animations & gradients
    │   ├── App.js                       # App wrapper & Database Records modal
    │   └── index.js                     # React 19 entry point with Bootstrap
    ├── index.html                       # HTML5 template with fonts
    ├── package.json                     # Frontend dependencies
    └── vite.config.js                   # Vite dev server configuration (Port 3000)
```

---

## 🚀 Quick Start Guide (Windows / VS Code)

### 1. Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **MongoDB**: Either local MongoDB community service or MongoDB Atlas cloud cluster.

---

### 2. Backend Setup & Run

Open a terminal in VS Code:

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables (check .env file)
# Make sure MONGO_URI points to your local MongoDB or Atlas cluster

# Start backend server
npm start
# Or for automatic reload on file changes:
npm run dev
```

The backend server starts on: **`http://localhost:5000`**
API endpoint: **`http://localhost:5000/api/auth/register`**

---

### 3. Frontend Setup & Run

Open a **second terminal** in VS Code:

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite React development server
npm start
```

The frontend application opens on: **`http://localhost:3000`**

---

## 🔒 Security Features
1. **Password Hashing**: Bcrypt salt rounds (10) hash passwords before saving. Never stores plain-text.
2. **Sensitive Data Omission**: Password and internal MongoDB `__v` are omitted from all JSON responses.
3. **Duplicate Prevention**: Email and Username are checked and enforced with unique indexes in MongoDB.
4. **Dual Validation**: Client-side instant feedback + strict server-side validation middleware.
5. **CORS & Environment Protection**: Only whitelisted origins allowed; `.env` is excluded in `.gitignore`.
