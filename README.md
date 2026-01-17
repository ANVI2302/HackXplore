# Career Compass

> **The Operating System for Human Potential** - A holistic academic and professional skill intelligence system for emerging sectors.

![Version](https://img.shields.io/badge/version-0.0.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation \& Setup](#-installation--setup)
- [Running Locally](#-running-locally)
- [Environment Variables](#-environment-variables)
- [Test Credentials](#-test-credentials)
- [API Documentation](#-api-documentation)
- [Error Handling](#-error-handling)
- [Security Notice](#-security-notice)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Career Compass** is a next-generation skill intelligence platform designed to revolutionize how students and professionals navigate their career journeys in emerging sectors. The platform continuously captures, organizes, and analyzes academic performance, project experience, and practical skills to generate actionable insights.

### Core Mission

To reduce engineer ramp-up time from **months to days** by providing:
- Real-time skill gap analysis
- Personalized learning pathways
- Industry-aligned competency mapping
- AI-powered career recommendations

### Target Sectors

1. **Advanced Agriculture** - Precision farming, AgriTech IoT, Vertical farming systems
2. **Computer Science** - AI/ML, Cloud Architecture, Cybersecurity, Full-stack Development
3. **Smart Urban Systems** - Urban IoT, Geospatial Analytics, Renewable Microgrids

---

## ✨ Features

### 🔐 Authentication & User Management
- **Secure JWT-based Authentication** - Industry-standard token-based auth
- **Profile Management** - Comprehensive user profiles with skills, titles, and bio
- **Session Persistence** - Automatic login state management
- **Password Security** - Bcrypt hashing with salt

### 📊 Skill Intelligence Dashboard
- **Multi-Domain Skill Mapping** - Track skills across Agriculture, CS, and Smart Cities
- **Visual Analytics** - Interactive radar charts and progress tracking
- **O*NET Integration** - Industry-standard skill classification codes
- **Skill Level Assessment** - 5-tier proficiency tracking (Beginner → Expert)

### 🎓 Learning & Development
- **Personalized Learning Paths** - AI-curated course recommendations
- **Project Tracking** - Document real-world projects and achievements
- **Skill Gap Analysis** - Identify missing competencies for target roles
- **Progress Visualization** - Real-time charts and metrics

### 🎨 Deep Science UI/UX
- **Minimalist Monochrome Design** - AWS/DeepMind-inspired aesthetic
- **Scientific Typography** - Clean, professional typefaces
- **Grid-based Architecture** - Technical, structured layouts
- **Micro-animations** - Subtle, performance-optimized interactions
- **Fully Responsive** - Mobile-first design (320px+)

### ⚡ Performance & Quality
- **Lazy Loading** - Code-split routes for faster initial load
- **SEO Optimized** - Proper meta tags and semantic HTML
- **Accessibility** - ARIA roles and keyboard navigation
- **Error Boundaries** - Graceful error handling throughout
- **Structured Logging** - Production-ready observability

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **TypeScript** | 5.3.3 | Type safety |
| **Vite** | 5.1.0 | Build tool & dev server |
| **React Router** | 6.22.0 | Client-side routing |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Framer Motion** | 11.0.3 | Animations |
| **Recharts** | 2.11.0 | Data visualization |
| **Radix UI** | Latest | Accessible components |
| **Lucide React** | 0.323.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.109.0+ | High-performance API framework |
| **Python** | 3.8+ | Backend language |
| **Uvicorn** | 0.27.0+ | ASGI server |
| **SQLAlchemy** | 2.0.25+ | ORM |
| **SQLite** | - | Development database |
| **Pydantic** | 2.6.0+ | Data validation |
| **Python-JOSE** | 3.3.0+ | JWT handling |
| **Passlib** | 1.7.4+ | Password hashing |
| **Structlog** | 24.1.0+ | Structured logging |
| **Alembic** | 1.13.1+ | Database migrations |

### DevOps & Quality
- **ESLint** - TypeScript linting
- **Autoprefixer** - CSS vendor prefixes
- **PostCSS** - CSS processing
- **Git** - Version control

---

## 🏗️ Architecture

Career Compass follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  React SPA + TypeScript + Tailwind + Framer Motion         │
│  • Lazy-loaded routes                                       │
│  • Context-based state management (AuthContext)            │
│  • RESTful API consumption                                  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                      │
│  FastAPI + Pydantic + Python-JOSE                          │
│  • /api/v1/auth      - Authentication endpoints            │
│  • /api/v1/users     - User management                      │
│  • /api/v1/assessments - Skill assessments                 │
│  • /system           - Health checks                        │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQLAlchemy ORM
┌─────────────────────────────────────────────────────────────┐
│                         DATA LAYER                          │
│  SQLite (Dev) / PostgreSQL (Prod)                          │
│  • users table       - Authentication & profiles            │
│  • assessments table - Skill evaluation data               │
│  • Alembic migrations for schema versioning                │
└─────────────────────────────────────────────────────────────┘
```

**Key Design Patterns:**
- **Repository Pattern** - CRUD operations abstracted in `backend/app/crud/`
- **Dependency Injection** - FastAPI's DI for database sessions
- **Context Providers** - React Context for global state (Auth)
- **Schema Validation** - Pydantic models ensure type safety
- **Error Boundaries** - Graceful frontend error handling

**See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed system design.**

---

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Python** >= 3.8 ([Download](https://www.python.org/downloads/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

**Verify installations:**
```bash
node --version
python --version
npm --version
git --version
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/IEEE-Ahmedabad-University-SB-Official/career-compass.git
cd career-compass
```

### 2️⃣ Frontend Setup

```bash
# Install dependencies
npm install

# Verify installation
npm list react react-dom vite
```

### 3️⃣ Backend Setup

#### Option A: Automatic Setup (Windows)
```bash
# Run the automated setup script
setup_backend.bat
```

#### Option B: Manual Setup (All Platforms)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Return to root directory
cd ..
```

---

## 🏃 Running Locally

### Development Mode (Both Servers)

You need **two terminal windows** open simultaneously:

#### Terminal 1: Backend Server (Port 8000)

```bash
# Windows (automated):
run_backend.bat

# OR Manual (all platforms):
cd backend
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Terminal 2: Frontend Server (Port 5173)

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.1.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## 🔐 Environment Variables

### Frontend (.env - Optional)

Create a `.env` file in the **root directory**:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Career Compass
VITE_APP_VERSION=0.0.1

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_TRACKING=false
```

### Backend (backend/.env - Optional)

Create a `.env` file in the **backend/** directory:

```env
# Database
DATABASE_URL=sqlite:///./sql_app.db
# For production PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/dbname

# Security
SECRET_KEY=your-secret-key-change-in-production-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (comma-separated origins)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Career Compass API

# Environment
ENVIRONMENT=development
```

**⚠️ IMPORTANT:** 
- **Never commit `.env` files to version control!**
- The `.gitignore` already excludes these files
- Use unique `SECRET_KEY` in production (generate with `openssl rand -hex 32`)

---

## 👤 Test Credentials

For quick testing, you can use these pre-configured accounts:

### Test User 1 - Engineering Student
```
Email: test@example.com
Password: Test123!
Profile: Computer Science focus with ML/AI skills
```

### Test User 2 - Agriculture Enthusiast  
```
Email: farmer@example.com
Password: Farm123!
Profile: AgriTech focus with IoT and precision farming skills
```

### Creating a New Account

1. Navigate to http://localhost:5173/auth
2. Click "Sign Up" tab
3. Fill in:
   - **Email:** any valid email format
   - **Password:** minimum 6 characters
   - **Name:** your full name
4. After registration, complete your profile:
   - Add a professional title
   - Select your skills from the database
   - Write a short bio

**Note:** In development mode, email verification is disabled.

---

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true,
  "created_at": "2026-01-17T15:30:00Z"
}
```

#### POST `/api/v1/auth/login`
Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### GET `/api/v1/auth/me`
Get current authenticated user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "title": "Machine Learning Engineer",
  "bio": "Passionate about AI and sustainable tech",
  "skills": ["cs_1", "cs_4", "at_1"],
  "is_active": true
}
```

### User Management Endpoints

#### PATCH `/api/v1/users/{user_id}`
Update user profile.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior Full-Stack Developer",
  "bio": "10+ years in web development",
  "skills": ["cs_4", "cs_5"]
}
```

**Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "title": "Senior Full-Stack Developer",
  "bio": "10+ years in web development",
  "skills": ["cs_4", "cs_5"]
}
```

### System Endpoints

#### GET `/system/health`
Health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T15:30:00Z"
}
```

**Full interactive API documentation:** http://localhost:8000/docs

---

## 🚨 Error Handling

### Frontend Error Handling

The application implements multiple layers of error handling:

#### 1. API Error Responses
```typescript
// Automatic error toast notifications
try {
  await api.login(email, password);
} catch (error) {
  // Handled by AuthContext - shows toast notification
  // User sees: "Invalid credentials. Please try again."
}
```

#### 2. Route-Level Protection
```typescript
// Unauthenticated users redirected to /auth
<RequireAuth>
  <Dashboard />
</RequireAuth>
```

#### 3. Form Validation
```typescript
// Client-side validation before API calls
if (!email || !password) {
  toast({ title: "Please fill all fields", variant: "destructive" });
  return;
}
```

### Backend Error Handling

#### Standardized Error Responses
```python
# All errors follow consistent format
{
  "detail": "User with this email already exists",
  "status_code": 400,
  "error_type": "ValidationError"
}
```

#### HTTP Status Codes Used
- **200** - Success
- **201** - Resource created
- **400** - Bad request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **404** - Resource not found
- **422** - Unprocessable entity (Pydantic validation)
- **500** - Internal server error

#### Structured Logging
```python
# All errors logged with context
logger.error("auth.login.failed", 
  email=email, 
  error=str(e),
  correlation_id=request_id
)
```

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| `CORS Error` | Backend not running | Start backend server on port 8000 |
| `401 Unauthorized` | Invalid/expired token | Re-login to get fresh token |
| `404 User Not Found` | User deleted | Register new account |
| `Module Not Found` | Missing dependencies | Run `pip install -r requirements.txt` (backend) or `npm install` (frontend) |
| `Port Already in Use` | Another process using 8000/5173 | Kill the process or change port |

---

## 🔒 Security Notice

### ✅ Security Measures Implemented

1. **Password Security**
   - Bcrypt hashing with automatic salt generation
   - Minimum password length: 6 characters
   - Never stored in plain text

2. **JWT Token Security**
   - HS256 algorithm
   - 30-minute expiration
   - Stored in memory (not localStorage) to prevent XSS

3. **API Security**
   - CORS configured for specific origins
   - Input validation via Pydantic schemas
   - SQL injection prevention via SQLAlchemy ORM

4. **Data Validation**
   - Client-side and server-side validation
   - Schema enforcement
   - Type safety via TypeScript and Pydantic

### ⚠️ Secrets Confirmation

**✅ NO SECRETS IN REPOSITORY**

This repository does **NOT** contain:
- ❌ API keys
- ❌ Database passwords
- ❌ Secret keys
- ❌ OAuth credentials
- ❌ Private keys
- ❌ `.env` files

**Protected Files (in `.gitignore`):**
```
.env
.env.local
backend/.env
backend/sql_app.db
backend/.venv/
node_modules/
```

**For Production Deployment:**
- Generate new `SECRET_KEY` using: `openssl rand -hex 32`
- Use environment variables for all secrets
- Enable HTTPS/TLS
- Restrict CORS to production domain only
- Use PostgreSQL instead of SQLite
- Enable rate limiting
- Implement refresh token rotation

---

## 🤝 Contributing

We welcome contributions from the community! 

### Contributors

- **IEEE Ahmedabad University Student Branch** - Project steward
- Open source contributors welcome!

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style (ESLint for TS, PEP8 for Python)
- Write tests for new features
- Update documentation
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/IEEE-Ahmedabad-University-SB-Official/career-compass/issues)
- **Discussions:** [GitHub Discussions](https://github.com/IEEE-Ahmedabad-University-SB-Official/career-compass/discussions)
- **Email:** ieee@ahduni.edu.in
- **Website:** [IEEE AUSB](https://github.com/IEEE-Ahmedabad-University-SB-Official)

---

## 🙏 Acknowledgments

- **IEEE Ahmedabad University Student Branch** for project sponsorship
- **O*NET Online** for skill classification standards
- **Radix UI** for accessible component primitives
- **FastAPI** community for excellent documentation
- **Vite** team for blazing-fast build tools

---

<div align="center">

**Made with ❤️ by the Career Compass Team**

[⬆ Back to Top](#career-compass)

</div>
