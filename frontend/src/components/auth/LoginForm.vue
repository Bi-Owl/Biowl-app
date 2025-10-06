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
              <input v-model="password" type="password" id="password-login" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full p-2 sm:p-3" placeholder="••••••••" required>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 bg-emerald-50 rounded border border-emerald-300 focus:ring-3 focus:ring-emerald-200">
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
import { AUTH_API } from '@/config/api';
import { useToast } from 'vue-toastification';
import { auth } from '@/auth';

const email = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();

const handleSubmit = async () => {
  try {
    const response = await fetch(AUTH_API.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    auth.login(data);
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
