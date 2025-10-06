# مستندات API بک‌اند

این فایل شامل مستندات تمام اندپوینت‌های موجود در بک‌اند است.

---

## احراز هویت (Authentication)

### `POST /api/auth/register`

**توضیحات:** این اندپوینت برای ثبت‌نام کاربر جدید در سیستم استفاده می‌شود.

**بدنه درخواست (Request Body):**
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

**پاسخ موفق (Success Response):**
- **کد:** `201 Created`
- **محتوا:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "string",
  "lastName": "string",
  "token": "your_jwt_token"
}
```

**پاسخ‌های خطا (Error Responses):**
- **کد:** `400 Bad Request`
  - **محتوا:** `{ "message": "لطفا تمام فیلدها را وارد کنید" }`
  - **محتوا:** `{ "message": "کاربری با این ایمیل قبلا ثبت‌نام کرده است" }`
  - **محتوا:** `{ "message": "کاربری با این شماره تلفن قبلا ثبت‌نام کرده است" }`
  - **محتوا:** `{ "message": "کاربری با این کد ملی قبلا ثبت‌نام کرده است" }`
- **کد:** `500 Internal Server Error`
  - **محتوا:** `{ "message": "خطایی در سرور رخ داده است", "error": "error_details" }`

---

### `POST /api/auth/login`

**توضیحات:** این اندپوینت برای ورود کاربر به سیستم استفاده می‌شود.

**بدنه درخواست (Request Body):**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**پاسخ موفق (Success Response):**
- **کد:** `200 OK`
- **محتوا:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "string",
  "lastName": "string",
  "token": "your_jwt_token"
}
```

**پاسخ‌های خطا (Error Responses):**
- **کد:** `400 Bad Request`
  - **محتوا:** `{ "message": "لطفا تمام فیلدها را وارد کنید" }`
- **کد:** `401 Unauthorized`
  - **محتوا:** `{ "message": "ایمیل یا رمز عبور اشتباه است" }`
- **کد:** `500 Internal Server Error`
  - **محتوا:** `{ "message": "خطایی در سرور رخ داده است", "error": "error_details" }`

---

### `GET /api/auth/user`

**توضیحات:** اطلاعات کاربر لاگین کرده را بر اساس توکن ارسالی برمی‌گرداند. این اندپوینت برای تایید اعتبار توکن در سمت سرور استفاده می‌شود.

**هدرها (Headers):**
```json
{
  "Authorization": "Bearer your_jwt_token"
}
```

**پاسخ موفق (Success Response):**
- **کد:** `200 OK`
- **محتوا:** (اطلاعات کامل کاربر بدون پسورد)
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

**پاسخ‌های خطا (Error Responses):**
- **کد:** `401 Unauthorized`
  - **محتوا:** `{ "message": "Not authorized, no token" }` (اگر توکن ارسال نشود)
  - **محتوا:** `{ "message": "Not authorized, token failed" }` (اگر توکن نامعتبر باشد)
  - **محتوا:** `{ "message": "Not authorized, user not found" }` (اگر کاربری با آیدی داخل توکن پیدا نشود)

---
