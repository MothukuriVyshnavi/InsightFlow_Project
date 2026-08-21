# InsightFlow

## AI-Powered Data Analysis Platform

InsightFlow is a web-based AI-powered data analysis platform that helps users upload datasets, analyze their data, discover patterns, and receive meaningful insights in simple language.

The project combines a frontend web interface with a Node.js/Express backend, MongoDB database, and AI-powered data analysis services.

---

## Project Status

### Completed

- Responsive InsightFlow home page
- Hero section with Analyze Data navigation
- Analyze Data page
- CSV data upload functionality
- Backend API using Node.js and Express
- MongoDB database connection
- User registration
- User login
- Password hashing
- JWT-based authentication
- Authentication API routes
- Frontend served through Express
- Health check API
- AI data explanation service
- Basic project navigation

### Currently Working On

- Profile page
- Display logged-in user information
- Logout functionality
- Authentication protection for pages
- Improving dashboard and analysis results

---

# Features

## Home Page

The InsightFlow home page introduces the platform and provides access to the main features.

### Includes:

- InsightFlow branding
- AI-powered data intelligence introduction
- Hero section
- Analyze Your Data button
- Explore Features section
- Data analysis preview
- Feature cards

---

## Data Analysis

Users can access the Analyze page to work with their datasets.

### Planned/Implemented capabilities:

- Upload CSV datasets
- Analyze dataset structure
- Detect rows and columns
- Generate statistical information
- Identify patterns
- Analyze relationships between variables
- Generate AI-based explanations

---

## User Authentication

InsightFlow includes a user authentication system.

### Sign Up

Users can create an account using:

- Full Name
- Email
- Password
- Confirm Password

Passwords are securely hashed before being stored in MongoDB.

### Login

Registered users can log in using:

- Email
- Password

Successful login generates a JWT authentication token.

---

# Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB
- Mongoose

## Authentication

- bcryptjs
- JSON Web Token (JWT)

## Data Analysis

- JavaScript
- PapaParse
- CSV processing

## AI

- AI-based data explanation service

## Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB Compass
- Nodemon

---

# Project Structure

```text
InsightFlow_Project/
│
├── client/
│   │
│   ├── index.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── hero.css
│   │   └── analyze.css
│   │
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── upload.js
│   │   ├── dashboard.js
│   │   ├── navigation.js
│   │   └── auth.js
│   │
│   ├── pages/
│   │   ├── analyze.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   └── profile.html
│   │
│   └── assets/
│       └── images/
│
├── server/
│   │
│   ├── server.js
│   │
│   ├── models/
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── services/
│   │   ├── dataAnalysis.js
│   │   └── aiService.js
│   │
│   ├── middleware/
│   │
│   └── uploads/
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md