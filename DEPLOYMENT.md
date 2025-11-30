# راهنمای کامل استقرار پروژه Biowl-app روی سرور

این راهنما شما را قدم به قدم برای نصب و اجرای این پروژه روی یک سرور لینوکسی (مانند اوبونتو) با استفاده از Nginx راهنمایی می‌کند.

## پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر روی سرور شما نصب شده‌اند:
- **Node.js**: برای اجرای بک‌اند و بیلد کردن فرانت‌اند.
- **Nginx**: به عنوان وب‌سرور و reverse proxy.
- **Git**: برای دریافت پروژه از ریپازیتوری.
- **Certbot** (اختیاری ولی به شدت توصیه می‌شود): برای فعال‌سازی SSL.

---

## مرحله ۱: دریافت پروژه

ابتدا پروژه را از گیت‌هاب در یک مسیر موقت (مانند پوشه home) کلون کنید:
```bash
git clone https://github.com/Bi-Owl/Biowl-app.git
```

---

## مرحله ۲: انتقال پروژه به مسیر استاندارد

برای جلوگیری از مشکلات دسترسی (Permission Denied)، پروژه را به مسیر `/var/www` منتقل کنید. این مسیر استاندارد برای نگهداری فایل‌های وب‌اپلیکیشن‌ها است.

```bash
# ایجاد پوشه www اگر وجود ندارد
sudo mkdir -p /var/www

# انتقال پروژه
sudo mv Biowl-app /var/www/biowl-app
```

---

## مرحله ۳: راه‌اندازی بک‌اند (Backend)

1.  **نصب وابستگی‌ها:**
    وارد پوشه بک‌اند شده و پکیج‌های مورد نیاز را نصب کنید.
    ```bash
    cd /var/www/biowl-app/backend
    npm install
    ```

2.  **تنظیم متغیرهای محیطی:**
    یک کپی از فایل `.env.example` با نام `.env` بسازید و مقادیر مورد نیاز مانند اطلاعات دیتابیس و رمز ادمین را در آن وارد کنید.
    ```bash
    cp .env.example .env
    nano .env
    ```

3.  **اجرای سرور با PM2:**
    برای اینکه سرور بک‌اند همیشه در حال اجرا باشد و در صورت بروز خطا به صورت خودکار ری‌استارت شود، از یک process manager مانند `pm2` استفاده می‌کنیم.
    ```bash
    # نصب pm2 به صورت گلوبال
    sudo npm install -g pm2

    # اجرای سرور بک‌اند با pm2
    pm2 start server.js --name "biowl-backend"
    ```

---

## مرحله ۴: راه‌اندازی فرانت‌اند (Frontend)

1.  **نصب وابستگی‌ها:**
    وارد پوشه فرانت‌اند شوید.
    ```bash
    cd /var/www/biowl-app/frontend
    npm install
    ```

2.  **بیلد کردن پروژه:**
    دستور زیر فایل‌های استاتیک و بهینه شده برای محیط پروداکشن را در پوشه `frontend/dist` می‌سازد.
    ```bash
    npm run build
    ```

---

## مرحله ۵: تنظیم مالکیت و دسترسی فایل‌ها

برای اینکه Nginx بتواند فایل‌های پروژه را بخواند، باید مالکیت کل پوشه پروژه را به کاربر وب‌سرور (`www-data` در اوبونتو/دبیان) بدهید.

```bash
sudo chown -R www-data:www-data /var/www/biowl-app
sudo chmod -R 755 /var/www/biowl-app
```

---

## مرحله ۶: تنظیم Nginx

1.  **ایجاد فایل کانفیگ:**
    یک فایل کانفیگ جدید برای سایت خود در Nginx ایجاد کنید.
    ```bash
    sudo nano /etc/nginx/sites-available/biowl.ir
    ```

2.  **قراردادن محتوای کانفیگ:**
    محتویات زیر را در فایل بالا کپی کنید. این کانفیگ وظیفه سرو کردن فایل‌های فرانت‌اند و پروکسی کردن درخواست‌های API به بک‌اند را بر عهده دارد.
    ```nginx
    server {
        listen 80;
        server_name biowl.ir;

        # مسیر فایل‌های بیلد شده فرانت‌اند
        root /var/www/biowl-app/frontend/dist;
        index index.html;

        # مدیریت SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # پروکسی کردن درخواست‌های API به بک‌اند
        location /api/ {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # سرو کردن فایل‌های آپلود شده
        location /uploads/ {
            alias /var/www/biowl-app/backend/uploads/;
            try_files $uri =404;
        }
    }
    ```

3.  **فعال‌سازی سایت و ری‌استارت Nginx:**
    ```bash
    # ایجاد symlink برای فعال‌سازی سایت
    sudo ln -s /etc/nginx/sites-available/biowl.ir /etc/nginx/sites-enabled/

    # تست کانفیگ Nginx برای اطمینان از عدم وجود خطا
    sudo nginx -t

    # ری‌استارت Nginx برای اعمال تغییرات
    sudo systemctl restart nginx
    ```
    در این مرحله، سایت شما باید روی پروتکل HTTP در دسترس باشد.

---

## مرحله ۷: فعال‌سازی SSL (HTTPS)

1.  **نصب Certbot:**
    برای نصب گواهی رایگان Let's Encrypt از `certbot` استفاده می‌کنیم.
    ```bash
    sudo apt update
    sudo apt install certbot python3-certbot-nginx
    ```

2.  **دریافت و نصب گواهی:**
    دستور زیر به صورت خودکار گواهی را دریافت کرده، کانفیگ Nginx را به‌روز می‌کند و ترافیک HTTP را به HTTPS ریدایرکت می‌کند.
    ```bash
    sudo certbot --nginx -d biowl.ir
    ```
    `certbot` از شما چند سوال می‌پرسد (مانند وارد کردن ایمیل و موافقت با قوانین). پس از اتمام، سایت شما با `https://biowl.ir` در دسترس خواهد بود.

پروژه شما اکنون به طور کامل روی سرور مستقر شده است.
