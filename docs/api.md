# API Documentation

This document describes the RESTful API endpoints exposed by the Biowl-app backend.

---

## 1. Authentication Endpoints (`/api/auth`)

**File:** `backend/routes/authRoutes.js`, `backend/controllers/authController.js`

### 1.1 POST /api/auth/register

Registers a new user.

-   **Access:** Public
-   **Method:** `POST`
-   **URL:** `/api/auth/register`
-   **Request Body:**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "nationalId": "string",
      "email": "string",
      "password": "string"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "message": "ثبت‌نام شما با موفقیت انجام شد.",
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "wallet": 0,
      "token": "JWT_TOKEN_STRING"
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: "لطفا تمام فیلدها را وارد کنید"
    -   `400 Bad Request`: "کاربری با این ایمیل قبلا ثبت‌نام کرده است"
    -   `400 Bad Request`: "کاربری با این شماره تلفن قبلا ثبت‌نام کرده است"
    -   `400 Bad Request`: "کاربری با این کد ملی قبلا ثبت‌نام کرده است"
    -   `400 Bad Request`: "اطلاعات کاربری نامعتبر است"
    -   `500 Internal Server Error`: "خطایی در سرور رخ داده است"

### 1.2 POST /api/auth/login

Authenticates a user and returns a JWT token.

-   **Access:** Public
-   **Method:** `POST`
-   **URL:** `/api/auth/login`
-   **Request Body:**
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "شما با موفقیت وارد شدید.",
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "wallet": 0,
      "token": "JWT_TOKEN_STRING"
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: "لطفا تمام فیلدها را وارد کنید"
    -   `401 Unauthorized`: "ایمیل یا رمز عبور اشتباه است"
    -   `403 Forbidden`: "حساب کاربری شما هنوز فعال نیست. لطفا با پشتیبانی تماس بگیرید."
    -   `500 Internal Server Error`: "خطایی در سرور رخ داده است"

### 1.3 GET /api/auth/user

Retrieves the authenticated user's profile information.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/auth/user`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "09123456789",
      "nationalId": "1234567890",
      "email": "user@example.com",
      "isActive": true,
      "wallet": 100000,
      "createdAt": "2023-01-01T10:00:00.000Z",
      "updatedAt": "2023-01-01T10:00:00.000Z"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است" (from `protect` middleware)
    -   `500 Internal Server Error`: "خطای سرور"

---

## 2. Exam Endpoints (`/api/exams`)

**File:** `backend/routes/examRoutes.js`, `backend/controllers/examController.js`

### 2.1 GET /api/exams

Retrieves a list of all public (not hidden) exams.

-   **Access:** Public
-   **Method:** `GET`
-   **URL:** `/api/exams`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "آزمون جامع زیست شناسی",
        "description": "توضیحات آزمون...",
        "startTime": "2023-01-15T08:00:00.000Z",
        "endTime": "2023-01-15T09:30:00.000Z",
        "price": "10000",
        "isPurchasable": true
      },
      {
        "id": 2,
        "name": "آزمون رایگان",
        "description": "توضیحات...",
        "startTime": null,
        "endTime": null,
        "price": "free",
        "isPurchasable": true
      }
    ]
    ```
-   **Error Responses:**
    -   `500 Internal Server Error`: "خطای سرور"

### 2.2 GET /api/exams/purchased

Retrieves a list of exams purchased by the authenticated user, along with their latest attempt status. This endpoint also auto-completes expired 'in_progress' attempts.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/exams/purchased`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "آزمون جامع زیست شناسی",
        "description": "توضیحات آزمون...",
        "startTime": "2023-01-15T08:00:00.000Z",
        "endTime": "2023-01-15T09:30:00.000Z",
        "price": "10000",
        "duration": 90,
        "questionCount": 10,
        "attempt": {
          "id": 5,
          "status": "in_progress",
          "startedAt": "2023-01-15T08:30:00.000Z"
        }
      },
      {
        "id": 2,
        "name": "آزمون تکمیل شده",
        "description": "توضیحات...",
        "startTime": null,
        "endTime": null,
        "price": "free",
        "duration": 60,
        "questionCount": 5,
        "attempt": {
          "id": 6,
          "status": "completed",
          "startedAt": "2023-01-14T10:00:00.000Z"
        }
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `404 Not Found`: "کاربر یافت نشد"
    -   `500 Internal Server Error`: "خطای سرور"

### 2.3 POST /api/exams/:examId/purchase

Allows an authenticated user to purchase an exam. Deducts the price from the user's wallet if not 'free'.

-   **Access:** Private (User)
-   **Method:** `POST`
-   **URL:** `/api/exams/{examId}/purchase`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "آزمون با موفقیت خریداری شد",
      "newBalance": 90000
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `404 Not Found`: "آزمون یافت نشد یا قابل خریداری نیست"
    -   `400 Bad Request`: "آزمون قبلا خریداری شده است"
    -   `400 Bad Request`: "موجودی کیف پول شما کافی نیست"
    -   `500 Internal Server Error`: "خطای سرور"

### 2.4 GET /api/exams/:examId/status

Checks the purchase status of a specific exam for the authenticated user.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/exams/{examId}/status`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "purchased": true
    }
    ```
    or
    ```json
    {
      "purchased": false
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `500 Internal Server Error`: "خطای سرور"

### 2.5 POST /api/exams/:examId/start

Initiates or resumes an exam attempt for the authenticated user.

-   **Access:** Private (User)
-   **Method:** `POST`
-   **URL:** `/api/exams/{examId}/start`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "آزمون با موفقیت شروع شد.",
      "exam": {
        "id": 1,
        "name": "آزمون جامع زیست شناسی",
        "duration": 90
      },
      "attempt": {
        "id": 5,
        "startedAt": "2023-01-15T08:30:00.000Z",
        "status": "in_progress",
        "answers": {}
      },
      "questions": [
        // Array of question objects (without correctOption/correctNumericAnswer)
      ],
      "explanations": [
        // Array of explanation objects associated with the exam
      ],
      "remainingTime": 3600000, // in milliseconds
      "examToken": "SHORT_LIVED_JWT_TOKEN"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "شما این آزمون را خریداری نکرده‌اید."
    -   `403 Forbidden`: "این آزمون در حال حاضر فعال نیست."
    -   `403 Forbidden`: "شما قبلاً این آزمون را به پایان رسانده‌اید."
    -   `403 Forbidden`: "زمان شما برای این آزمون به پایان رسیده است."
    -   `404 Not Found`: "آزمون یافت نشد."
    -   `500 Internal Server Error`: "خطای سرور"

### 2.6 GET /api/exams/total

Retrieves the total count of public exams available on the platform.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/exams/total`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "totalExams": 12
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `500 Internal Server Error`: "خطای سرور"

### 2.7 GET /api/exams/me/completed-exams-count

Retrieves the count of exams that the authenticated user has completed.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/exams/me/completed-exams-count`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "completedExamsCount": 4
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `500 Internal Server Error`: "خطای سرور"

---

## 3. Exam Attempt Endpoints (`/api/attempts`)

**File:** `backend/routes/examAttemptRoutes.js`, `backend/controllers/examAttemptController.js`

### 3.1 PUT /api/attempts/:attemptId/answer

Updates a user's answer for a specific question within an active exam attempt. Supports multiple choice options, numeric values, and multi-boolean arrays.

-   **Access:** Private (User, requires `examToken`)
-   **Method:** `PUT`
-   **URL:** `/api/attempts/{attemptId}/answer`
-   **Headers:** `Authorization: Bearer <EXAM_JWT_TOKEN>`
-   **Request Body:**
    ```json
    {
      "questionId": 1,
      "answer": 2
    }
    ```
    *Note on `answer` formats:*
    - **Multiple Choice:** Number (e.g., `2` for Option 2) or `null` to unselect.
    - **Numeric:** String or Number representing the calculated float/integer (e.g., `"14.5"` or `14.5`).
    - **Multi-Boolean:** Array of 5 booleans or nulls (e.g., `[true, false, true, null, false]`).
-   **Success Response (200 OK):**
    ```json
    {
      "message": "پاسخ شما ذخیره شد.",
      "answers": { "1": 2, "2": "14.5" } // Updated answers object
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است" (from `examAuthMiddleware`)
    -   `403 Forbidden`: "این آزمون قبلاً تکمیل شده است."
    -   `500 Internal Server Error`: "خطای سرور"

### 3.2 POST /api/attempts/:attemptId/finish

Manually finishes an exam attempt.

-   **Access:** Private (User)
-   **Method:** `POST`
-   **URL:** `/api/attempts/{attemptId}/finish`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "آزمون شما با موفقیت ثبت شد.",
      "attempt": {
        "id": 5,
        "status": "completed",
        "finishedAt": "2023-01-15T09:00:00.000Z"
      }
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "شما اجازه دسترسی به این عملیات را ندارید."
    -   `400 Bad Request`: "این آزمون قبلاً به عنوان تکمیل شده علامت‌گذاری شده است."
    -   `404 Not Found`: "آزمون یافت نشد."
    -   `500 Internal Server Error`: "خطای سرور"

### 3.3 GET /api/attempts/:attemptId/review

Retrieves the details of a completed exam attempt for review, including questions and user's answers.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/attempts/{attemptId}/review`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "attempt": {
        "id": 6,
        "startedAt": "2023-01-14T10:00:00.000Z",
        "finishedAt": "2023-01-14T11:00:00.000Z",
        "status": "completed",
        "answers": { "1": 2, "2": 1, "3": 4 },
        "UserId": 1,
        "ExamId": 2
      },
      "questions": [
        // Array of question objects (without correctOption)
      ]
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "شما اجازه دسترسی به این نتیجه را ندارید."
    -   `403 Forbidden`: "این آزمون هنوز به پایان نرسیده است."
    -   `404 Not Found`: "نتیجه آزمون یافت نشد."
    -   `500 Internal Server Error`: "خطای سرور"

---

## 4. Admin Endpoints (`/api/admin`)

**File:** `backend/routes/adminRoutes.js`, `backend/controllers/adminController.js`

### 4.1 POST /api/admin/login

Authenticates an administrator and returns a JWT token.

-   **Access:** Public
-   **Method:** `POST`
-   **URL:** `/api/admin/login`
-   **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "شما با موفقیت به پنل مدیریت وارد شدید.",
      "token": "JWT_TOKEN_STRING"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "نام کاربری یا رمز عبور اشتباه است"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.2 GET /api/admin/users

Retrieves a list of all registered users.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/users`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "phoneNumber": "09123456789",
        "nationalId": "1234567890",
        "email": "user@example.com",
        "isActive": true,
        "wallet": 100000,
        "createdAt": "2023-01-01T10:00:00.000Z",
        "updatedAt": "2023-01-01T10:00:00.000Z"
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.3 GET /api/admin/users/:id

Retrieves details for a specific user.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/users/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "phoneNumber": "09123456789",
      "nationalId": "1234567890",
      "email": "user@example.com",
      "isActive": true,
      "wallet": 100000,
      "createdAt": "2023-01-01T10:00:00.000Z",
      "updatedAt": "2023-01-01T10:00:00.000Z"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "کاربر یافت نشد"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.4 PUT /api/admin/users/:id

Updates details for a specific user.

-   **Access:** Private (Admin)
-   **Method:** `PUT`
-   **URL:** `/api/admin/users/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Request Body:**
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phoneNumber": "string",
      "nationalId": "string",
      "isActive": true,
      "wallet": 120000
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "کاربر با موفقیت به روز شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "کاربر یافت نشد"
    -   `409 Conflict`: "خطا: {field} وارد شده تکراری است" (e.g., phoneNumber)
    -   `400 Bad Request`: "خطای اعتبارسنجی: {message}"
    -   `500 Internal Server Error`: "خطا در سرور هنگام ویرایش کاربر رخ داد."

### 4.5 DELETE /api/admin/users/:id

Deletes a specific user.

-   **Access:** Private (Admin)
-   **Method:** `DELETE`
-   **URL:** `/api/admin/users/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "کاربر با موفقیت حذف شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "کاربر یافت نشد"
    -   `409 Conflict`: "نمی‌توان کاربری که آزمون خریداری کرده را حذف کرد."
    -   `500 Internal Server Error`: "خطا در سرور هنگام حذف کاربر رخ داد."

---

### 4.6 POST /api/admin/exams

Creates a new exam.

-   **Access:** Private (Admin)
-   **Method:** `POST`
-   **URL:** `/api/admin/exams`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string",
      "startTime": "2023-01-15T08:00:00.000Z",
      "endTime": "2023-01-15T09:30:00.000Z",
      "duration": 90,
      "isHidden": false,
      "isPurchasable": true,
      "price": "10000"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "message": "آزمون با موفقیت ایجاد شد.",
      "exam": {
        "id": 1,
        "name": "آزمون جدید",
        // ... other exam fields
      }
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `400 Bad Request`: "نام آزمون اجباری است."
    -   `400 Bad Request`: "خطای اعتبارسنجی: {message}"
    -   `500 Internal Server Error`: "خطا در سرور هنگام ایجاد آزمون رخ داد."

### 4.7 GET /api/admin/exams

Retrieves a list of all exams (including hidden ones), with a count of their questions.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "آزمون جامع زیست شناسی",
        // ... other exam fields
        "questionCount": 10
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.8 GET /api/admin/exams/:id

Retrieves details for a specific exam.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "آزمون جامع زیست شناسی",
      // ... all exam fields
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "آزمون یافت نشد"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.9 PUT /api/admin/exams/:id

Updates details for a specific exam.

-   **Access:** Private (Admin)
-   **Method:** `PUT`
-   **URL:** `/api/admin/exams/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string",
      "startTime": "2023-01-15T08:00:00.000Z",
      "endTime": "2023-01-15T09:30:00.000Z",
      "duration": 90,
      "isHidden": false,
      "isPurchasable": true,
      "price": "10000"
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "آزمون با موفقیت به روز شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "آزمون یافت نشد"
    -   `400 Bad Request`: "خطای اعتبارسنجی: {message}"
    -   `500 Internal Server Error`: "خطا در سرور هنگام ویرایش آزمون رخ داد."

### 4.10 DELETE /api/admin/exams/:id

Deletes a specific exam.

-   **Access:** Private (Admin)
-   **Method:** `DELETE`
-   **URL:** `/api/admin/exams/{id}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "آزمون با موفقیت حذف شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "آزمون یافت نشد"
    -   `409 Conflict`: "نمی‌توان آزمونی که دارای سوال است را حذف کرد. ابتدا سوالات را حذف کنید."
    -   `500 Internal Server Error`: "خطا در سرور هنگام حذف آزمون رخ داد."

### 4.11 GET /api/admin/exams/status-overview

Retrieves an overview of all exams alongside their attempt count.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams/status-overview`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "آزمون مرحله اول المپیاد زیست",
        "attemptCount": 15,
        "createdAt": "2023-01-01T10:00:00.000Z"
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.12 GET /api/admin/exams/:examId/attempts

Retrieves all participant attempts and calculated performance stats for a specific exam.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams/{examId}/attempts`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "attemptId": 12,
        "status": "completed",
        "user": {
          "id": 5,
          "firstName": "علی",
          "lastName": "محمدی",
          "email": "ali@example.com"
        },
        "stats": {
          "correct": 18,
          "incorrect": 2,
          "unanswered": 0,
          "total": 20,
          "originalTotal": 21,
          "excludedCount": 1,
          "percentage": 87.5
        }
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.13 POST /api/admin/exams/:examId/questions

Creates a new question for a specific exam. Supports multiple-choice, numeric, and multi-boolean questions with an option to exclude from scoring. Requires an image file upload.

-   **Access:** Private (Admin)
-   **Method:** `POST`
-   **URL:** `/api/admin/exams/{examId}/questions`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data`
-   **Request Body (multipart/form-data):**
    -   `image`: File (image of the question, required)
    -   `position`: Number (required)
    -   `type`: String (`'multiple_choice'`, `'numeric'`, or `'multi_boolean'`. Default: `'multiple_choice'`)
    -   `numberOfOptions`: Number (required for `multiple_choice`, e.g., 4)
    -   `correctOption`: Number (required for `multiple_choice`, 1-based)
    -   `correctNumericAnswer`: String/JSON (required for `numeric` [array or comma-separated numbers] and `multi_boolean` [array of 5 booleans])
    -   `isExcludedFromScoring`: Boolean (optional, `true` to omit from scoring calculations)
-   **Success Response (201 Created):**
    ```json
    {
      "message": "سوال با موفقیت ایجاد شد",
      "question": {
        "id": 1,
        "position": 1,
        "imageUrl": "/uploads/image-123.png",
        "type": "multiple_choice",
        "numberOfOptions": 4,
        "correctOption": 1,
        "correctNumericAnswer": null,
        "isExcludedFromScoring": false,
        "ExamId": 1
      }
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `400 Bad Request`: "داده‌های ارسالی برای سوال ناقص است."
    -   `400 Bad Request`: "لطفا یک تصویر برای سوال آپلود کنید."
    -   `409 Conflict`: "خطا: ترتیب سوال نمی‌تواند تکراری باشد."
    -   `400 Bad Request`: "خطای اعتبارسنجی: {message}"
    -   `500 Internal Server Error`: "خطا در سرور هنگام ایجاد سوال رخ داد."

### 4.14 GET /api/admin/exams/:examId/questions

Retrieves a list of all questions for a specific exam.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams/{examId}/questions`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "position": 1,
        "imageUrl": "/uploads/image-123.png",
        "type": "multiple_choice",
        "numberOfOptions": 4,
        "correctOption": 1,
        "correctNumericAnswer": null,
        "isExcludedFromScoring": false,
        "ExamId": 1,
        "createdAt": "2023-01-01T10:00:00.000Z",
        "updatedAt": "2023-01-01T10:00:00.000Z"
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.15 PUT /api/admin/questions/:questionId

Updates details for a specific question. Can also upload a new image or change scoring status.

-   **Access:** Private (Admin)
-   **Method:** `PUT`
-   **URL:** `/api/admin/questions/{questionId}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data` (if image is uploaded)
-   **Request Body (multipart/form-data or application/json):**
    -   `image`: File (optional new image)
    -   `position`: Number (optional)
    -   `type`: String (optional: `'multiple_choice'`, `'numeric'`, or `'multi_boolean'`)
    -   `numberOfOptions`: Number (optional)
    -   `correctOption`: Number (optional)
    -   `correctNumericAnswer`: String/JSON (optional)
    -   `isExcludedFromScoring`: Boolean (optional, `true`/`false`)
-   **Success Response (200 OK):**
    ```json
    {
      "message": "سوال با موفقیت به روز شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "سوال یافت نشد"
    -   `409 Conflict`: "خطا: ترتیب سوال نمی‌تواند تکراری باشد."
    -   `400 Bad Request`: "خطای اعتبارسنجی: {message}"
    -   `500 Internal Server Error`: "خطا در سرور هنگام ویرایش سوال رخ داد."

### 4.16 DELETE /api/admin/questions/:questionId

Deletes a specific question. Also deletes the associated image file.

-   **Access:** Private (Admin)
-   **Method:** `DELETE`
-   **URL:** `/api/admin/questions/{questionId}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "سوال با موفقیت حذف شد"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `404 Not Found`: "سوال یافت نشد"
    -   `500 Internal Server Error`: "خطای سرور"

### 4.17 POST /api/admin/questions/reorder

Reorders questions within an exam.

-   **Access:** Private (Admin)
-   **Method:** `POST`
-   **URL:** `/api/admin/questions/reorder`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Request Body:**
    ```json
    {
      "updates": [
        { "id": 1, "position": 2 },
        { "id": 2, "position": 1 }
      ]
    }
    ```
-   **Success Response (200 OK):**
    ```json
    {
      "message": "ترتیب سوالات با موفقیت به‌روزرسانی شد."
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "اجازه دسترسی ندارید"
    -   `400 Bad Request`: "اطلاعات ارسالی برای آپدیت نامعتبر است."
    -   `500 Internal Server Error`: "خطا در سرور هنگام مرتب‌سازی سوالات رخ داد."

---

### 4.18 Explanation Management Endpoints

#### GET /api/admin/exams/:examId/explanations

Retrieves all explanations for an exam ordered by displayOrder.

-   **Access:** Private (Admin)
-   **Method:** `GET`
-   **URL:** `/api/admin/exams/{examId}/explanations`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "displayOrder": 2,
        "imageUrl": "/uploads/explanation-123.png",
        "ExamId": 1
      }
    ]
    ```

#### POST /api/admin/exams/:examId/explanations

Creates a new explanation/reading passage for an exam.

-   **Access:** Private (Admin)
-   **Method:** `POST`
-   **URL:** `/api/admin/exams/{examId}/explanations`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data`
-   **Request Body (multipart/form-data):**
    -   `image`: File (image of the explanation, required)
    -   `displayOrder`: Number (required, order number before which this explanation is shown)
-   **Success Response (201 Created):**
    ```json
    {
      "message": "توضیحات با موفقیت ایجاد شد",
      "explanation": {
        "id": 1,
        "displayOrder": 2,
        "imageUrl": "/uploads/explanation-123.png",
        "ExamId": 1
      }
    }
    ```

#### PUT /api/admin/explanations/:explanationId

Updates an existing explanation.

-   **Access:** Private (Admin)
-   **Method:** `PUT`
-   **URL:** `/api/admin/explanations/{explanationId}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data`
-   **Request Body (multipart/form-data or json):**
    -   `image`: File (optional new image)
    -   `displayOrder`: Number (optional)
-   **Success Response (200 OK):**
    ```json
    {
      "message": "توضیحات با موفقیت به روز شد"
    }
    ```

#### DELETE /api/admin/explanations/:explanationId

Deletes an explanation and removes its uploaded image.

-   **Access:** Private (Admin)
-   **Method:** `DELETE`
-   **URL:** `/api/admin/explanations/{explanationId}`
-   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "message": "توضیحات با موفقیت حذف شد"
    }
    ```

---

### 4.19 Admin Report Card Management Endpoints (`/api/admin/report-cards`)

#### GET /api/admin/report-cards/exams
    
    Retrieves a list of all exams and includes their associated report card status.
    
    -   **Access:** Private (Admin)
    -   **Method:** `GET`
    -   **URL:** `/api/admin/report-cards/exams`
    -   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`
    -   **Success Response (200 OK):**
        ```json
        [
          {
            "id": 1,
            "name": "آزمون جامع زیست شناسی",
            "ReportCard": {
                "id": 1,
                "isHidden": true,
                "createdAt": "2023-12-01T10:00:00.000Z",
                "updatedAt": "2023-12-01T10:00:00.000Z"
            }
          },
          {
            "id": 2,
            "name": "آزمون دیگر",
            "ReportCard": null
          }
        ]
        ```
    
    #### POST /api/admin/report-cards/publish/:examId
    
    Publishes or re-publishes a report card for an exam. Snapshots correct answers and completes all in-progress attempts for that exam.
    
    -   **Access:** Private (Admin)
    -   **Method:** `POST`
    -   **URL:** `/api/admin/report-cards/publish/{examId}`
    -   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data`
    -   **Request Body (multipart/form-data):**
        -   `description`: String (Optional)
        -   `answerKeyPdf`: File (Optional PDF file)
    -   **Success Response (201 Created):**
        ```json
        {
            "message": "کارنامه با موفقیت منتشر شد. 15 آزمون در حال انجام به وضعیت 'تکمیل شده' تغییر یافت.",
            "reportCard": {
                "id": 1,
                // ... other ReportCard fields
            }
        }
        ```
    
    #### PUT /api/admin/report-cards/:examId
    
    Updates the details of an existing report card.
    
    -   **Access:** Private (Admin)
    -   **Method:** `PUT`
    -   **URL:** `/api/admin/report-cards/{examId}`
    -   **Headers:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`, `Content-Type: multipart/form-data`
    -   **Request Body (multipart/form-data):**
        -   `description`: String (Optional)
        -   `isHidden`: Boolean
        -   `answerKeyPdf`: File (Optional PDF file)
    -   **Success Response (200 OK):**
        ```json
        {
            "message": "کارنامه با موفقیت به‌روزرسانی شد.",
            "reportCard": {
                "id": 1,
                // ... other ReportCard fields
            }
        }
        ```
    
    ---

## 5. User Report Card Endpoints (`/api/report-cards`)

**File:** `backend/routes/reportCardUserRoutes.js`, `backend/controllers/reportCardUserController.js`

### 5.1 GET /api/report-cards

Retrieves all available and published report cards for exams that the logged-in user has attempted.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/report-cards`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "آزمون مرحله اول المپیاد زیست شناسی",
        "ReportCard": {
          "id": 1,
          "isHidden": false,
          "createdAt": "2023-12-01T10:00:00.000Z"
        },
        "UserExamAttempts": [
          {
            "status": "completed"
          }
        ]
      }
    ]
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `500 Internal Server Error`: "خطا در دریافت لیست کارنامه‌ها."

### 5.2 GET /api/report-cards/latest-summary

Retrieves a quick summary of the user's latest completed report card (used on dashboard cards).

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/report-cards/latest-summary`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "exam": {
        "id": 1,
        "name": "آزمون جامع زیست شناسی"
      },
      "reportCard": {
        "id": 1,
        "createdAt": "2023-12-01T10:00:00.000Z"
      },
      "score": {
        "correctCount": 18,
        "incorrectCount": 2,
        "unansweredCount": 0,
        "totalQuestions": 20,
        "originalTotalQuestions": 21,
        "excludedCount": 1,
        "percentageWithNegative": 87.5,
        "percentageWithoutNegative": 90.0
      },
      "ranking": {
        "rank": 3,
        "totalParticipants": 45
      }
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `404 Not Found`: "کارنامه تکمیل شده‌ای یافت نشد."
    -   `500 Internal Server Error`: "خطای سرور"

### 5.3 GET /api/report-cards/:examId

Retrieves the detailed report card for a specific exam, including full question review, user choices, answer keys, explanations, and score breakdown.

-   **Access:** Private (User)
-   **Method:** `GET`
-   **URL:** `/api/report-cards/{examId}`
-   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
-   **Success Response (200 OK):**
    ```json
    {
      "reportCard": {
        "id": 1,
        "name": "آزمون مرحله اول",
        "description": "تحلیل سوالات...",
        "answerKeyPdfUrl": "/uploads/key.pdf",
        "showRank": true,
        "correctAnswers": {
          "1": 2,
          "2": [14.5],
          "3": [true, false, true, true, false]
        }
      },
      "attempt": {
        "id": 5,
        "status": "completed",
        "answers": {
          "1": 2,
          "2": "14.5"
        }
      },
      "questions": [
        {
          "id": 1,
          "position": 1,
          "imageUrl": "/uploads/q1.png",
          "type": "multiple_choice",
          "numberOfOptions": 4,
          "isExcludedFromScoring": false
        }
      ],
      "explanations": [
        {
          "id": 1,
          "displayOrder": 2,
          "imageUrl": "/uploads/exp1.png"
        }
      ],
      "score": {
        "correctCount": 18,
        "incorrectCount": 2,
        "unansweredCount": 0,
        "totalQuestions": 20,
        "originalTotalQuestions": 21,
        "excludedCount": 1,
        "percentageWithNegative": 87.5,
        "percentageWithoutNegative": 90.0
      },
      "ranking": {
        "rank": 3,
        "totalParticipants": 45
      }
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: "توکن نامعتبر است"
    -   `403 Forbidden`: "شما این آزمون را به پایان نرسانده‌اید و نمی‌توانید کارنامه را مشاهده کنید."
    -   `404 Not Found`: "کارنامه یافت نشد یا هنوز منتشر نشده است."
    -   `500 Internal Server Error`: "خطا در دریافت جزئیات کارنامه."

    