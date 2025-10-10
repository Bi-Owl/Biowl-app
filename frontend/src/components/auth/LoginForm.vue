<template>
  <div class="w-full max-w-md mx-4">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
      <div class="p-6 sm:p-8">
        <h1 class="text-2xl font-bold text-center text-emerald-800 mb-1">به سیستم خوش آمدید</h1>
        <p class="text-sm text-center text-emerald-600 mb-8">لطفا اطلاعات حساب خود را وارد نمایید</p>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email-login" class="block text-sm font-medium text-emerald-700 mb-1">پست الکترونیکی</label>
            <div class="relative">
              <input v-model="email" type="email" id="email-login" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="example@domain.com" required>
            </div>
          </div>
          
          <div>
            <label for="password-login" class="block text-sm font-medium text-emerald-700 mb-1">رمز عبور</label>
            <div class="relative">
              <input v-model="password" :type="passwordFieldType" id="password-login" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3 pr-10" placeholder="••••••••" required>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer" @click="togglePasswordVisibility">
                <svg v-if="passwordFieldType === 'password'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye text-emerald-600"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off text-emerald-600"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input v-model="rememberMe" id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 bg-emerald-50 rounded border border-emerald-300 focus:ring-3 focus:ring-emerald-200">
              </div>
              <div class="mr-3 text-sm">
                <label for="remember" class="font-medium text-emerald-700">مرا به خاطر بسپار</label>
              </div>
            </div>
            <a href="#" class="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">رمز عبور را فراموش کرده‌اید؟</a>
          </div>
          
          <button type="submit" class="btn-hover w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              ورود به سیستم
          </button>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { auth } from '@/auth';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const passwordFieldType = ref('password');

const toast = useToast();
const router = useRouter();

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
};

import { login } from '@/api/auth';

const handleSubmit = async () => {
  try {
    const data = await login(email.value, password.value);
    auth.login(data, rememberMe.value);
    toast.success('ورود با موفقیت انجام شد!');
    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    toast.error(error.message);
  }
};
</script>

<style scoped>
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
</style>