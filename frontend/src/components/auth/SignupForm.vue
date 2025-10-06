<template>
  <div class="w-full max-w-md mx-4">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
      <div class="p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-center text-emerald-800 mb-1">ایجاد حساب کاربری</h1>
        <p class="text-sm text-center text-emerald-600 mb-8">برای استفاده از امکانات، ثبت‌نام کنید</p>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div class="flex space-x-4 space-x-reverse">
            <div class="w-1/2">
              <label for="firstName-signup" class="block text-sm font-medium text-emerald-700 mb-1">نام</label>
              <input v-model="firstName" type="text" id="firstName-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="نام" required>
            </div>
            <div class="w-1/2">
              <label for="lastName-signup" class="block text-sm font-medium text-emerald-700 mb-1">نام خانوادگی</label>
              <input v-model="lastName" type="text" id="lastName-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="نام خانوادگی" required>
            </div>
          </div>

          <div>
            <label for="phoneNumber-signup" class="block text-sm font-medium text-emerald-700 mb-1">شماره تلفن</label>
            <input v-model="phoneNumber" type="tel" id="phoneNumber-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="09123456789" required>
          </div>

          <div>
            <label for="nationalId-signup" class="block text-sm font-medium text-emerald-700 mb-1">کد ملی</label>
            <input v-model="nationalId" type="text" id="nationalId-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="0123456789" required>
          </div>

          <div>
            <label for="email-signup" class="block text-sm font-medium text-emerald-700 mb-1">پست الکترونیکی</label>
            <div class="relative">
              <input v-model="email" type="email" id="email-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="example@domain.com" required>
            </div>
          </div>
          
          <div>
            <label for="password-signup" class="block text-sm font-medium text-emerald-700 mb-1">رمز عبور</label>
            <div class="relative">
              <input v-model="password" type="password" id="password-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="••••••••" required>
            </div>
          </div>

          <div>
            <label for="confirm-password-signup" class="block text-sm font-medium text-emerald-700 mb-1">تکرار رمز عبور</label>
            <div class="relative">
              <input v-model="confirmPassword" type="password" id="confirm-password-signup" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="••••••••" required>
            </div>
          </div>
          
          <button type="submit" class="btn-hover w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              ثبت نام
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AUTH_API } from '@/config/api';
import { useToast } from 'vue-toastification';
import { auth } from '@/auth';

const firstName = ref('');
const lastName = ref('');
const phoneNumber = ref('');
const nationalId = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const toast = useToast();
const router = useRouter();

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('رمزهای عبور یکسان نیستند!');
    return;
  }

  try {
    const response = await fetch(AUTH_API.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        nationalId: nationalId.value,
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    auth.login(data);
    toast.success('ثبت نام با موفقیت انجام شد!');
    router.push('/dashboard');

  } catch (error) {
    console.error('Signup error:', error);
    toast.error(error.message);
  }
};
</script>

<style scoped>
/* Styles are copied from LoginForm.vue for consistency */
.input-focus {
    transition: all 0.3s ease;
    outline: none !important;
}

.input-focus:focus {
    border-color: #34d399;
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.2);
}

.btn-hover {
    transition: all 0.3s ease, transform 0.2s ease;
}

.btn-hover:hover {
    background-color: #059669;
    transform: scale(1.03);
}

#phoneNumber-signup {
  direction: ltr;
  text-align: right;
}
</style>