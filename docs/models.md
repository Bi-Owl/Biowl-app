# Model Documentation

This document describes the Sequelize models used in the backend of the Biowl-app.

---

## 1. Admin Model

Represents administrative users with access to the admin panel.

**File:** `backend/models/admin.js`

| Field    | Type            | Description                                  | Constraints       |
| :------- | :-------------- | :------------------------------------------- | :---------------- |
| `id`     | `INTEGER`       | Primary Key, Auto-increment                  | `PRIMARY KEY`     |
| `username` | `STRING`        | Unique username for the admin                | `NOT NULL`, `UNIQUE` |
| `password` | `STRING`        | Hashed password of the admin                 | `NOT NULL`        |

**Hooks:**
- `beforeCreate`: Hashes the password using `bcryptjs` before creating a new admin.

**Instance Methods:**
- `isValidPassword(password)`: Compares a given password with the stored hashed password.

---

## 2. User Model

Represents a standard user of the application.

**File:** `backend/models/user.js`

| Field          | Type        | Description                                  | Constraints           |
| :------------- | :---------- | :------------------------------------------- | :-------------------- |
| `id`           | `INTEGER`   | Primary Key, Auto-increment                  | `PRIMARY KEY`         |
| `firstName`    | `STRING`    | User's first name                            | `NOT NULL`            |
| `lastName`     | `STRING`    | User's last name                             | `NOT NULL`            |
| `phoneNumber`  | `STRING`    | User's phone number                          | `NOT NULL`, `UNIQUE`  |
| `nationalId`   | `STRING`    | User's national ID                           | `NOT NULL`, `UNIQUE`  |
| `email`        | `STRING`    | User's email address                         | `NOT NULL`, `UNIQUE`, `IS EMAIL` |
| `password`     | `STRING`    | Hashed password of the user                  | `NOT NULL`            |
| `isActive`     | `BOOLEAN`   | Whether the user account is active           | `NOT NULL`, `DEFAULT: false` |
| `wallet`       | `FLOAT`     | User's wallet balance                        | `NOT NULL`, `DEFAULT: 0` |

**Scopes:**
- `defaultScope`: Excludes the `password` field by default when querying `User` objects.
- `withPassword`: Includes the `password` field (used for authentication).

**Relationships:**
- `hasMany(UserExam)`: A user can purchase many exams.
- `hasMany(UserExamAttempt)`: A user can have many exam attempts.

---

## 3. Exam Model

Represents an exam available in the system.

**File:** `backend/models/exam.js`

| Field           | Type        | Description                                  | Constraints       |
| :-------------- | :---------- | :------------------------------------------- | :---------------- |
| `id`            | `INTEGER`   | Primary Key, Auto-increment                  | `PRIMARY KEY`     |
| `name`          | `STRING`    | Name of the exam                             | `NOT NULL`        |
| `description`   | `TEXT`      | Detailed description of the exam             | `ALLOW NULL`      |
| `startTime`     | `DATE`      | Start time of the exam (for timed exams)     | `ALLOW NULL`      |
| `endTime`       | `DATE`      | End time of the exam (for timed exams)       | `ALLOW NULL`      |
| `duration`      | `INTEGER`   | Duration of the exam in minutes              | `ALLOW NULL`      |
| `isHidden`      | `BOOLEAN`   | Whether the exam is hidden from public view  | `NOT NULL`, `DEFAULT: false` |
| `isPurchasable` | `BOOLEAN`   | Whether the exam can be purchased            | `NOT NULL`, `DEFAULT: true` |
| `price`         | `STRING`    | Price of the exam (e.g., "free" or a number) | `NOT NULL`, `DEFAULT: 'free'` |

**Relationships:**
- `belongsToMany(User, { through: UserExam })`: An exam can be purchased by many users (via `UserExam` join table).
- `hasMany(Question)`: An exam can have many questions.
- `hasMany(UserExamAttempt)`: An exam can have many attempts from users.
- `hasOne(ReportCard)`: An exam has one report card.

---

## 4. Question Model

Represents a question within an exam. Each question is associated with an image.

**File:** `backend/models/question.js`

| Field         | Type        | Description                                  | Constraints       |
| :------------ | :---------- | :------------------------------------------- | :---------------- |
| `id`          | `INTEGER`   | Primary Key, Auto-increment                  | `PRIMARY KEY`     |
| `position`    | `INTEGER`   | Order of the question within the exam        | `NOT NULL`        |
| `imageUrl`    | `STRING`    | URL to the image containing the question and options | `NOT NULL`        |
| `numberOfOptions` | `INTEGER` | Total number of options for the question     | `NOT NULL`        |
| `correctOption` | `INTEGER` | The number of the correct option (e.g., 1, 2, 3) | `NOT NULL`        |
| `ExamId`      | `INTEGER`   | Foreign Key to the Exam model                | `NOT NULL`        |

**Relationships:**
- `belongsTo(Exam)`: A question belongs to an exam.

---

## 5. UserExam Model (Join Table)

Represents the many-to-many relationship between `User` and `Exam` models, indicating which user has purchased which exam.

**File:** `backend/models/userExam.js`

| Field     | Type        | Description                                  | Constraints       |
| :-------- | :---------- | :------------------------------------------- | :---------------- |
| `id`      | `INTEGER`   | Primary Key, Auto-increment                  | `PRIMARY KEY`     |
| `purchased` | `BOOLEAN`   | Whether the exam is purchased by the user    | `NOT NULL`, `DEFAULT: false` |
| `UserId`  | `INTEGER`   | Foreign Key to the User model                | `NOT NULL`        |
| `ExamId`  | `INTEGER`   | Foreign Key to the Exam model                | `NOT NULL`        |

**Relationships:**
- `belongsTo(User)`: Implicitly defined through `User.belongsToMany(Exam, { through: UserExam })`.
- `belongsTo(Exam)`: Implicitly defined through `Exam.belongsToMany(User, { through: UserExam })`.

---

## 6. UserExamAttempt Model

Records a user's attempt at an exam, including their answers and status.

**File:** `backend/models/userExamAttempt.js`

| Field        | Type                          | Description                                  | Constraints           |
| :----------- | :---------------------------- | :------------------------------------------- | :-------------------- |
| `id`         | `INTEGER`                     | Primary Key, Auto-increment                  | `PRIMARY KEY`         |
| `startedAt`  | `DATE`                        | Timestamp when the attempt started           | `NOT NULL`            |
| `finishedAt` | `DATE`                        | Timestamp when the attempt finished          | `ALLOW NULL`          |
| `status`     | `ENUM('in_progress', 'completed')` | Current status of the attempt                | `NOT NULL`, `DEFAULT: 'in_progress'` |
| `answers`    | `JSON`                        | Stores user's answers `{ questionId: answerOption }` | `NOT NULL`, `DEFAULT: {}` |
| `UserId`     | `INTEGER`                     | Foreign Key to the User model                | `NOT NULL`            |
| `ExamId`     | `INTEGER`                     | Foreign Key to the Exam model                | `NOT NULL`            |

**Relationships:**
- `belongsTo(User)`: An attempt belongs to a user.
- `belongsTo(Exam)`: An attempt belongs to an exam.

---

## 7. ReportCard Model

Stores the published results and answer key for an exam.

**File:** `backend/models/reportCard.js`

| Field        | Type                          | Description                                  | Constraints           |
| :----------- | :---------------------------- | :------------------------------------------- | :-------------------- |
| `id`         | `INTEGER`                     | Primary Key, Auto-increment                  | `PRIMARY KEY`         |
| `description`| `TEXT`                        | Optional description or analysis of the results | `ALLOW NULL`          |
| `answerKeyPdfUrl` | `STRING`                  | URL to the optional PDF answer key           | `ALLOW NULL`          |
| `showRank`   | `BOOLEAN`                     | Whether to show ranks to users               | `NOT NULL`, `DEFAULT: false` |
| `isHidden`   | `BOOLEAN`                     | Whether the report card is visible to users  | `NOT NULL`, `DEFAULT: true` |
| `correctAnswers` | `JSON`                    | A snapshot of correct answers `{ questionId: correctOption }` | `NOT NULL`            |
| `ExamId`     | `INTEGER`                     | Foreign Key to the Exam model (one-to-one)   | `NOT NULL`, `UNIQUE`  |

**Relationships:**
- `belongsTo(Exam)`: A report card belongs to one exam.

---