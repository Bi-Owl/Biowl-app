<template>
  <div class="animate-fade-in-scale w-full max-w-md mx-4">
    <div class="card-hover bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
      <div class="p-6 sm:p-8">
        <div class="flex justify-center mb-8">
          <div class="bg-emerald-100 p-4 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        
        <h1 class="text-2xl font-bold text-center text-emerald-800 mb-1">به سیستم خوش آمدید</h1>
        <p class="text-sm text-center text-emerald-600 mb-8">لطفا اطلاعات حساب خود را وارد نمایید</p>
        
        <form class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-emerald-700 mb-1">پست الکترونیکی</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input type="email" id="email" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full pl-10 p-2 sm:p-3" placeholder="example@domain.com" required>
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-emerald-700 mb-1">رمز عبور</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input type="password" id="password" class="input-focus bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm sm:text-base rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 block w-full pl-10 p-2 sm:p-3" placeholder="رمز عبور خود را وارد کنید" required>
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
          
          <p class="text-sm font-light text-center text-emerald-600">
              حساب کاربری ندارید؟ <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200">ثبت نام کنید</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@keyframes fadeInScale {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-fade-in-scale {
    animation: fadeInScale 0.6s ease-out forwards;
}

.card-hover {
    transition: all 0.3s ease, transform 0.3s ease;
}

.card-hover:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.2);
}

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
