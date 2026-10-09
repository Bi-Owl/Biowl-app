# Biowl-app: Exam Management Platform

Biowl-app is a full-stack web platform for creating, managing, and taking online exams. The system features separate panels for users and administrators, providing functionalities such as exam purchasing via an internal wallet, comprehensive question and exam management, and secure authentication.

---

## ✨ Features

### User Panel
- **Secure Registration & Login:** JWT-based authentication system.
- **Exam Store:** Browse and view a list of purchasable exams.
- **Internal Wallet:** Ability to charge the wallet and purchase exams.
- **Personal Dashboard:** View purchased exams, countdowns, and completion history.
- **Interactive Exam Player:**
  - Real-time auto-saving with debouncing and instant visual feedback.
  - Support for 3 distinct question types: Multiple Choice (تستی), Numeric (عددی), and Multi-Boolean (چند گزاره‌ای).
  - Timer with blur effect protection to prevent screen peeking.
- **Comprehensive Report Card & Review:**
  - Detailed score calculation (percentages with/without negative scoring).
  - Question-by-question review with selected options, correct answers, and neutral display for excluded questions.
  - Explanations and reading passages interspersed between questions.
  - Participant ranking and downloadable PDF answer key.

### Admin Panel
- **Management Dashboard:** Centralized access to all management operations.
- **Full User Management (CRUD):** View and edit user details, activate/deactivate accounts, and adjust wallet balances.
- **Full Exam Management (CRUD):**
  - Create and configure exams (start/end times, duration, pricing, visibility).
  - **Live Exam Monitoring:** View participants, live in-progress attempts, completed attempts, and instant scores.
- **Full Question & Explanation Management (CRUD):**
  - Support for Multiple Choice, Numeric (multiple accepted answers), and Multi-Boolean (IBO rubric).
  - **Question Omission / Exclusion from Scoring:** Admin can exclude flawed questions so their weight is safely removed from total achievable scores and percentages.
  - Insert instructional explanations / reading passages between questions.
  - **Drag-and-Drop Reordering:** Reorder questions dynamically with automatic position updates.
- **Report Card Management:** Publish/unpublish report cards, attach answer key PDFs, and control participant rank visibility.
- **Security:** All administrative endpoints are guarded by `adminAuthMiddleware`.

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Sequelize ORM with SQLite (for development)
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Multer
- **Hashing:** bcryptjs
- **Environment Variables:** Dotenv

### Frontend
- **Framework:** Vue.js 3 (with Composition API)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** Vue Router
- **Drag-and-Drop:** vuedraggable.next
- **Notifications:** `vue-toastification`
- **Modals:** `vue-final-modal`

---

## 🚀 Setup and Installation

To run the project locally, follow the steps below for both the `frontend` and `backend` directories.

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file from the example. No changes are needed for SQLite development.
cp .env.example .env

# Run the server
npm start
```
The backend server will run on port `3000` by default.

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
The frontend application will be available on port `5173` by default.

---

## 📄 Documentation

For more information about the database models, API endpoints, and deployment, please refer to the documentation files:

- **[Database Model Documentation](./docs/models.md)**
- **[API Documentation](./docs/api.md)**
- **[Server Deployment Guide](./docs/DEPLOYMENT.md)**
