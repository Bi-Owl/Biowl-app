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
  "token": "your_jwt_token"
}
```

**Error Responses:**
- **Code:** `400 Bad Request`
  - **Content:** `{ "message": "Please fill in all fields" }`
  - **Content:** `{ "message": "A user with this email is already registered" }`
  - **Content:** `{ "message": "A user with this phone number is already registered" }`
  - **Content:** `{ "message": "A user with this national ID is already registered" }`
- **Code:** `500 Internal Server Error`
  - **Content:** `{ "message": "An error occurred on the server", "error": "error_details" }`

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
  "token": "your_jwt_token"
}
```

**Error Responses:**
- **Code:** `400 Bad Request`
  - **Content:** `{ "message": "Please fill in all fields" }`
- **Code:** `401 Unauthorized`
  - **Content:** `{ "message": "Invalid email or password" }`
- **Code:** `500 Internal Server Error`
  - **Content:** `{ "message": "An error occurred on the server", "error": "error_details" }`

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
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

**Error Responses:**
- **Code:** `401 Unauthorized`
  - **Content:** `{ "message": "Not authorized, no token" }` (if no token is sent)
  - **Content:** `{ "message": "Not authorized, token failed" }` (if the token is invalid)
  - **Content:** `{ "message": "Not authorized, user not found" }` (if a user with the ID in the token is not found)

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
