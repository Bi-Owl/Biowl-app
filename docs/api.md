# Backend API Documentation

This file contains the documentation for all available backend endpoints.

---

## Authentication

### `POST /api/auth/register`

**Description:** This endpoint is used to register a new user in the system.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "09123456789",
  "nationalId": "0123456789",
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response:**
- **Code:** `201 Created`
- **Content:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "string",
  "lastName": "string",
  "wallet": 0,
  "token": "your_jwt_token"
}
```

**Error Responses:**
- **Code:** `400 Bad Request`
  - **Content:** `{ "message": "لطفا تمام فیلدها را وارد کنید" }`
  - **Content:** `{ "message": "کاربری با این ایمیل قبلا ثبت‌نام کرده است" }`
  - **Content:** `{ "message": "کاربری با این شماره تلفن قبلا ثبت‌نام کرده است" }`
  - **Content:** `{ "message": "کاربری با این کد ملی قبلا ثبت‌نام کرده است" }`
- **Code:** `500 Internal Server Error`
  - **Content:** `{ "message": "خطایی در سرور رخ داده است", "error": "error_details" }`

---

### `POST /api/auth/login`

**Description:** This endpoint is used for user login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Content:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "string",
  "lastName": "string",
  "wallet": 15000,
  "token": "your_jwt_token"
}
```

**Error Responses:**
- **Code:** `400 Bad Request`
  - **Content:** `{ "message": "لطفا تمام فیلدها را وارد کنید" }`
- **Code:** `401 Unauthorized`
  - **Content:** `{ "message": "ایمیل یا رمز عبور اشتباه است" }`
- **Code:** `403 Forbidden`
  - **Content:** `{ "message": "حساب کاربری شما فعال نیست. لطفا با پشتیبانی تماس بگیرید." }`
- **Code:** `500 Internal Server Error`
  - **Content:** `{ "message": "خطایی در سرور رخ داده است", "error": "error_details" }`

---

### `GET /api/auth/user`

**Description:** Returns the information of the logged-in user based on the provided token. This endpoint is used for server-side token validation.

**Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Content:** (Complete user information without the password)
```json
{
  "id": 1,
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "09123456789",
  "nationalId": "0123456789",
  "email": "user@example.com",
  "isActive": true,
  "wallet": 15000,
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

**Error Responses:**
- **Code:** `401 Unauthorized`
  - **Content:** `{ "message": "خطای دسترسی: توکن ارسال نشده است" }`
  - **Content:** `{ "message": "خطای دسترسی: توکن نامعتبر است" }`
  - **Content:** `{ "message": "خطای دسترسی: کاربر یافت نشد" }`

---
<br>

## Admin

All admin routes are prefixed with `/api/admin`. Access to these routes (except for login) requires an admin authentication token.

### `POST /api/admin/login`

**Description:** Authenticates an administrator.

**Request Body:**
```json
{
  "username": "admin_user",
  "password": "admin_password"
}
```

**Success Response:**
- **Code:** `200 OK`
- **Content:**
```json
{
  "token": "your_admin_jwt_token"
}
```

**Error Responses:**
- **Code:** `401 Unauthorized`
  - **Content:** `{ "message": "نام کاربری یا رمز عبور اشتباه است" }`

---

### User Management

#### `GET /api/admin/users`

- **Description:** Retrieves a list of all users.
- **Access:** Admin
- **Success Response (200 OK):** An array of user objects.

#### `GET /api/admin/users/:id`

- **Description:** Retrieves a single user by their ID.
- **Access:** Admin
- **Success Response (200 OK):** A single user object.

#### `PUT /api/admin/users/:id`

- **Description:** Updates a user's information.
- **Access:** Admin
- **Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "user@example.com",
  "phoneNumber": "09123456789",
  "nationalId": "0123456789",
  "isActive": true,
  "wallet": 50000
}
```
- **Success Response (200 OK):** `{ "message": "کاربر با موفقیت به روز شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "کاربر یافت نشد" }`
  - **409 Conflict:** `{ "message": "خطا: ایمیل یا شماره تلفن وارد شده تکراری است" }`
  - **400 Bad Request:** `{ "message": "خطای اعتبارسنجی: ..." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام ویرایش کاربر رخ داد." }`

#### `DELETE /api/admin/users/:id`

- **Description:** Deletes a user.
- **Access:** Admin
- **Success Response (200 OK):** `{ "message": "کاربر با موفقیت حذف شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "کاربر یافت نشد" }`
  - **409 Conflict:** `{ "message": "نمی‌توان کاربری که آزمون خریداری کرده را حذف کرد." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام حذف کاربر رخ داد." }`

---

### Exam Management

#### `GET /api/admin/exams`

- **Description:** Retrieves a list of all exams, including a count of how many questions each exam has.
- **Access:** Admin
- **Success Response (200 OK):** An array of exam objects, each including `questionCount`.
  ```json
  [
    {
      "id": 1,
      "name": "آزمون زیست",
      "description": "توضیحات",
      "startTime": "...",
      "endTime": "...",
      "duration": 60,
      "isHidden": false,
      "isPurchasable": true,
      "price": "10000",
      "createdAt": "...",
      "updatedAt": "...",
      "questionCount": 120
    }
  ]
  ```

#### `POST /api/admin/exams`

- **Description:** Creates a new exam.
- **Access:** Admin
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "description": "string (optional)",
    "startTime": "ISO 8601 String (optional)",
    "endTime": "ISO 8601 String (optional)",
    "duration": 120,
    "isHidden": false,
    "isPurchasable": true,
    "price": "free"
  }
  ```
- **Success Response (201 Created):** `{ "message": "آزمون با موفقیت ایجاد شد", "exam": { ... } }`
- **Error Responses:**
  - **400 Bad Request:** `{ "message": "نام آزمون اجباری است." }` or `{ "message": "خطای اعتبارسنجی: ..." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام ایجاد آزمون رخ داد." }`

#### `GET /api/admin/exams/:id`

- **Description:** Retrieves a single exam by its ID.
- **Access:** Admin
- **Success Response (200 OK):** A single exam object.

#### `PUT /api/admin/exams/:id`

- **Description:** Updates an existing exam.
- **Access:** Admin
- **Request Body:** (Same as POST /api/admin/exams)
- **Success Response (200 OK):** `{ "message": "آزمون با موفقیت به روز شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "آزمون یافت نشد" }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام ویرایش آزمون رخ داد." }`

#### `DELETE /api/admin/exams/:id`

- **Description:** Deletes an exam.
- **Access:** Admin
- **Success Response (200 OK):** `{ "message": "آزمون با موفقیت حذف شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "آزمون یافت نشد" }`
  - **409 Conflict:** `{ "message": "نمی‌توان آزمونی که دارای سوال است را حذف کرد. ابتدا سوالات را حذف کنید." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام حذف آزمون رخ داد." }`

---

### Question Management

#### `POST /api/admin/questions/reorder`

- **Description:** Updates the `position` of multiple questions at once.
- **Access:** Admin
- **Request Body:**
  ```json
  {
    "updates": [
      { "id": 15, "position": 1 },
      { "id": 12, "position": 2 },
      { "id": 18, "position": 3 }
    ]
  }
  ```
- **Success Response (200 OK):** `{ "message": "ترتیب سوالات با موفقیت به‌روزرسانی شد." }`
- **Error Responses:**
  - **400 Bad Request:** `{ "message": "اطلاعات ارسالی برای آپدیت نامعتبر است." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام مرتب‌سازی سوالات رخ داد." }`

#### `GET /api/admin/exams/:examId/questions`

- **Description:** Retrieves all questions for a specific exam, ordered by position.
- **Access:** Admin
- **URL Params:** `examId` (integer, required)
- **Success Response (200 OK):** An array of question objects.

#### `POST /api/admin/exams/:examId/questions`

- **Description:** Creates a new question for an exam and uploads an image.
- **Access:** Admin
- **Content-Type:** `multipart/form-data`
- **URL Params:** `examId` (integer, required)
- **Form Data:**
  - `questionImage` (file, required): The image file for the question.
  - `position` (integer, required): The order of the question in the exam.
  - `numberOfOptions` (integer, required): The total number of options.
  - `correctOption` (integer, required): The number of the correct option.
- **Success Response (201 Created):** `{ "message": "سوال با موفقیت ایجاد شد", "question": { ... } }`
- **Error Responses:**
  - **400 Bad Request:** `{ "message": "داده‌های ارسالی برای سوال ناقص است." }` or `{ "message": "لطفا یک تصویر برای سوال آپلود کنید." }`
  - **409 Conflict:** `{ "message": "خطا: ترتیب سوال نمی‌تواند تکراری باشد." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام ایجاد سوال رخ داد." }`


#### `PUT /api/admin/questions/:questionId`

- **Description:** Updates an existing question. Can optionally include a new image to replace the old one.
- **Access:** Admin
- **Content-Type:** `multipart/form-data`
- **URL Params:** `questionId` (integer, required)
- **Form Data:**
  - `questionImage` (file, optional): A new image file to replace the existing one.
  - `position` (integer, required): The order of the question in the exam.
  - `numberOfOptions` (integer, required): The total number of options.
  - `correctOption` (integer, required): The number of the correct option.
- **Success Response (200 OK):** `{ "message": "سوال با موفقیت به روز شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "سوال یافت نشد" }`
  - **409 Conflict:** `{ "message": "خطا: ترتیب سوال نمی‌تواند تکراری باشد." }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام ویرایش سوال رخ داد." }`

#### `DELETE /api/admin/questions/:questionId`

- **Description:** Deletes a question and its associated image file.
- **Access:** Admin
- **URL Params:** `questionId` (integer, required)
- **Success Response (200 OK):** `{ "message": "سوال با موفقیت حذف شد" }`
- **Error Responses:**
  - **404 Not Found:** `{ "message": "سوال یافت نشد" }`
  - **500 Internal Server Error:** `{ "message": "خطا در سرور هنگام حذف سوال رخ داد." }`

---

## Exams

### `GET /api/exams`

- **URL:** `/api/exams`
- **Method:** `GET`
- **Access:** Public
- **Description:** Retrieves a list of all exams that are not hidden.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "General Knowledge Exam",
      "description": "A comprehensive test of general knowledge.",
      "startTime": "2025-11-01T10:00:00.000Z",
      "endTime": "2025-11-01T12:00:00.000Z",
      "price": "15000"
    },
    {
      "id": 2,
      "name": "Math Basics",
      "description": "An introductory exam for basic mathematics.",
      "startTime": "2025-11-05T09:00:00.000Z",
      "endTime": "2025-11-05T10:00:00.000Z",
      "price": "free"
    }
  ]
  ```

### `GET /api/exams/:examId/status`

- **URL:** `/api/exams/:examId/status`
- **Method:** `GET`
- **Access:** Private (Requires authentication token)
- **Description:** Checks if the authenticated user has purchased a specific exam.
- **URL Params:**
  - `examId` (integer, required): The ID of the exam to check.
- **Success Response (200 OK):**
  - If the user has purchased the exam:
    ```json
    {
      "purchased": true
    }
    ```
  - If the user has not purchased the exam:
    ```json
    {
      "purchased": false
    }
    ```

---

### `POST /api/exams/:examId/purchase`

- **URL:** `/api/exams/:examId/purchase`
- **Method:** `POST`
- **Access:** Private (Requires authentication token)
- **Description:** Allows the authenticated user to purchase an exam. Deducts the cost from the user's wallet if the price is not 'free'. The exam must be public (`isHidden: false`) and available for purchase (`isPurchasable: true`).
- **URL Params:**
  - `examId` (integer, required): The ID of the exam to purchase.
- **Success Response (200 OK):**
  ```json
  {
    "message": "آزمون با موفقیت خریداری شد",
    "newBalance": 45000
  }
  ```
- **Error Responses:**
  - **`400 Bad Request`**: 
    - `{ "message": "آزمون قبلا خریداری شده است" }`
    - `{ "message": "موجودی کیف پول شما کافی نیست" }`
  - **`404 Not Found`**:
    - `{ "message": "آزمون یافت نشد یا قابل خریداری نیست" }`

---

### `GET /api/exams/purchased`

- **URL:** `/api/exams/purchased`
- **Method:** `GET`
- **Access:** Private (Requires authentication token)
- **Description:** Retrieves a list of all exams purchased by the authenticated user.
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "General Knowledge Exam",
      "description": "A comprehensive test of general knowledge.",
      "startTime": "2025-11-01T10:00:00.000Z",
      "endTime": "2025-11-01T12:00:00.000Z",
      "price": "15000"
    }
  ]
  ```

---
