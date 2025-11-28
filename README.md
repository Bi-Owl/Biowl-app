# Biowl-app: Exam Management Platform

Biowl-app is a full-stack web platform for creating, managing, and taking online exams. The system features separate panels for users and administrators, providing functionalities such as exam purchasing via an internal wallet, comprehensive question and exam management, and secure authentication.

---

## ✨ Features

### User Panel
- **Secure Registration & Login:** JWT-based authentication system.
- **Exam Store:** Browse and view a list of purchasable exams.
- **Internal Wallet:** Ability to charge the wallet and purchase exams.
- **Personal Dashboard:** View purchased exams and their status.
- **Exam Start System:** Countdown for timed exams and the ability to start an assessment.

### Admin Panel
- **Management Dashboard:** Centralized access to various management sections.
- **Full User Management (CRUD):** View, edit user information, activate/deactivate accounts, and manage user wallet balances.
- **Full Exam Management (CRUD):**
  - Create exams with details like name, description, start/end times, duration, and price.
  - Hide or show exams in the store.
  - Set the purchasable status for each exam.
- **Full Question Management (CRUD):**
  - Add questions to a specific exam with image uploads.
  - Define the number of options and the correct option.
  - **Drag-and-Drop Reordering:** Easily reorder questions by dragging and dropping them.
- **Security:** All admin APIs are protected by `adminAuthMiddleware`.

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

For more information about the database models and API endpoints, please refer to the documentation files:

- **[Database Model Documentation](./docs/models.md)**
- **[API Documentation](./docs/api.md)**
