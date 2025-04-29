# Full-Stack Authentication System with Google reCAPTCHA

A complete authentication system built with Node.js, Express, PostgreSQL, and Google reCAPTCHA integration.

## Features

- User registration with validation
- Secure login with Google reCAPTCHA protection
- JWT-based authentication
- Protected profile route
- Password hashing with bcrypt
- Session timeout warnings
- Rate limiting for login attempts
- PostgreSQL database with raw SQL queries
- Responsive UI with EJS templates

## Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL database
- Google reCAPTCHA API keys (v2 Checkbox)

## Installation

1. Clone the repository:
```bash
git clone https://github.com//auth-system.git](https://github.com/Shubham29012/Fullstack-UserAuthentication/)
cd auth-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database for the application.

4. Set up the environment variables by creating a `.env` file in the root directory with the following content:
```
PORT=3000

# Database Configuration
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=auth_system
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=15m

# Google reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. Set up the database schema:
```bash
npm run setup-db
```

## Running the Application

Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
auth-system/
├── .env                    # Environment variables
├── app.js                  # Main application file
├── package.json            # Project dependencies
├── README.md               # Project documentation
├── config/
│   ├── db.js               # Database configuration
│   └── db-setup.js         # Database setup script
├── controllers/
│   ├── authController.js   # Authentication controller
│   └── userController.js   # User controller
├── middlewares/
│   └── authMiddleware.js   # Authentication middleware
├── models/
│   └── userModel.js        # User model with database queries
├── public/
│   ├── css/
│   │   └── style.css       # CSS styles
│   └── js/
│       └── validation.js   # Client-side validation
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   └── userRoutes.js       # User routes
├── utils/
│   ├── jwtUtils.js         # JWT utility functions
│   └── validation.js       # Server-side validation
└── views/
    ├── partials/
    │   ├── header.ejs      # Header partial
    │   └── footer.ejs      # Footer partial
    ├── login.ejs           # Login page
    ├── register.ejs        # Registration page
    └── profile.ejs         # Profile page
```

## Getting Google reCAPTCHA Keys

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Sign in with your Google account
3. Register a new site:
   - Enter a label for your site
   - Select reCAPTCHA v2 (Checkbox)
   - Add your domains (localhost for development)
   - Accept the Terms of Service
   - Submit
4. You'll receive a Site Key and Secret Key to use in your application

## Security Features

- Password hashing with bcrypt
- JWT for secure authentication
- Google reCAPTCHA to prevent bot attacks
- Rate limiting on login attempts
- Form validation on both client and server
- HTTPS-only cookies for JWT
- Session timeout warnings
