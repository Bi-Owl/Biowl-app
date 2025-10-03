<template>
  <main>
    <!-- Navigation -->
    <nav class="shadow-sm z-50 glassmorphism dynamic-island">
        <div class="max-w-7xl mx-auto px-1 sm:px-2 lg:px-4">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0 flex items-center">
                        <i data-feather="award" class="text-emerald-600 w-8 h-8"></i>
                        <span class="text-xl font-bold text-emerald-600 mr-2">بیول | Biowl</span>
                    </div>
                </div>
                <div class="hidden md:flex items-center space-x-2 space-x-reverse">
                    <a href="#" class="text-emerald-600 px-3 py-2 rounded-md text-sm font-medium hover:scale-105 transition-transform">خانه</a>
                    <a href="#about-us" class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform">درباره ما</a>
                    <a href="#programs" class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform">برنامه‌ها</a>
                    <a href="#mentors" class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform">مربیان</a>
                    <a href="#contact" class="text-gray-600 hover:text-emerald-600 px-2 py-1 rounded-md text-sm font-medium hover:scale-105 transition-transform">تماس با ما</a>
                </div>
                <div class="md:hidden flex items-center">
                    <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none">
                        <i data-feather="menu"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
    <section>
        <div class="max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-loose" data-aos="fade-up">
                    <span class="block py-2">تیم المپیاد زیست‌شناسی</span>
                    <span class="block gradient-text py-2">بیول | Biowl</span>
                </h1>
                <p class="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl" data-aos="fade-up">
                    پرورش استعدادهای برتر زیست‌شناسی برای المپیادهای کشوری و جهانی
                </p>
                <div class="mt-6 max-w-md mx-auto sm:flex sm:justify-center md:mt-10 space-x-4 space-x-reverse" data-aos="fade-up">
                    <div class="rounded-md shadow">
                        <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 btn-hover">
                            ثبت نام
                            <i data-feather="arrow-left" class="mr-2 w-4 h-4"></i>
                        </a>
                    </div>
                    <div class="mt-3 rounded-md shadow sm:mt-0">
                        <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 btn-hover">
                            اطلاعات بیشتر
                            <i data-feather="info" class="mr-2 w-4 h-4"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="about-us" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-emerald-600 font-semibold tracking-wide uppercase" data-aos="fade-up">چرا بیول؟</h2>
                <p class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl" data-aos="fade-up">
                    بهترین روش‌های آموزش المپیاد
                </p>
            </div>

            <div class="mt-12">
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <!-- Feature 1 -->
                    <div class="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover-scale glassmorphism" data-aos="fade-up">
                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                            <i data-feather="users" class="w-6 h-6"></i>
                        </div>
                        <div class="mt-6">
                            <h3 class="text-lg font-medium text-gray-900">مربیان با تجربه</h3>
                            <p class="mt-4 text-base text-gray-500">
                                مربیان ما از مدال‌آوران المپیادهای کشوری هستند که تجربه شرکت در المپیاد دارند.
                            </p>
                        </div>
                    </div>

                    <!-- Feature 2 -->
                    <div class="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover-scale glassmorphism" data-aos="fade-up">
                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                            <i data-feather="book-open" class="w-6 h-6"></i>
                        </div>
                        <div class="mt-6">
                            <h3 class="text-lg font-medium text-gray-900">منابع اختصاصی</h3>
                            <p class="mt-4 text-base text-gray-500">
                                منابع آموزشی اختصاصی و به‌روز شده مطابق با آخرین تغییرات المپیاد.
                            </p>
                        </div>
                    </div>

                    <!-- Feature 3 -->
                    <div class="p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover-scale glassmorphism" data-aos="fade-up">
                        <div class="flex items-center justify-center h-12 w-12 rounded-md bg-emerald-100 text-emerald-600">
                            <i data-feather="activity" class="w-6 h-6"></i>
                        </div>
                        <div class="mt-6">
                            <h3 class="text-lg font-medium text-gray-900">آزمون‌های منظم</h3>
                            <p class="mt-4 text-base text-gray-500">
                                برگزاری آزمون‌های منظم و شبیه‌سازی شده برای سنجش پیشرفت دانش‌آموزان.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Telegram Channel Section -->
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:flex lg:items-center lg:justify-between">
                <div class="lg:w-1/2" data-aos="fade-up">
                    <h2 class="text-3xl font-extrabold text-gray-900 leading-loose">
                        <span class="block">کانال تلگرام بیول</span>
                        <span class="block text-emerald-600">منبع اصلی آموزش‌های ما</span>
                    </h2>
                    <p class="mt-6 text-lg text-gray-600">
                        تمامی آموزش‌ها، آزمون‌ها و منابع رایگان در کانال تلگرام ما منتشر می‌شود. برای دسترسی به جدیدترین مطالب آموزشی المپیاد زیست‌شناسی، عضو کانال ما شوید.
                    </p>
                    <div class="mt-10">
                        <a href="#" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 btn-hover">
                            <i data-feather="send" class="ml-2 w-5 h-5"></i>
                            عضویت در کانال
                        </a>
                    </div>
                </div>
                <div class="mt-10 lg:mt-0 lg:w-1/2" data-aos="fade-up">
                    <div class="p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 glassmorphism">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-emerald-100 p-4 rounded-lg">
                                <i data-feather="send" class="w-8 h-8 text-emerald-600"></i>
                            </div>
                            <div class="mr-6">
                                <h4 class="text-lg font-bold text-gray-900">@Biowl_Oly</h4>
                                <p class="text-sm text-gray-500">کانال رسمی تیم بیول</p>
                            </div>
                        </div>
                        <div class="mt-8 grid grid-cols-2 gap-6">
                            <div class="bg-emerald-50 p-4 rounded-lg">
                                <div class="text-emerald-600 font-bold text-xl">۱۵۰+</div>
                                <div class="text-sm text-gray-600">عضو فعال</div>
                            </div>
                            <div class="bg-emerald-50 p-4 rounded-lg">
                                <div class="text-emerald-600 font-bold text-xl">۵۰+</div>
                                <div class="text-sm text-gray-600">مطلب آموزشی</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Timeline Section -->
    <section id="programs" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-emerald-600 font-semibold tracking-wide uppercase" data-aos="fade-up">مسیر آموزشی</h2>
                <p class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl" data-aos="fade-up">
                    ۶ مرحله تا مدال المپیاد
                </p>
            </div>

            <div id="timeline-container" class="mt-24 relative h-64">
                <svg id="timeline-svg" class="absolute w-full h-full" viewbox="0 0 1200 100" preserveaspectratio="none">
                    <path id="timeline-path" d="M0,50 C 150,0 150,100 300,50 S 450,0 600,50 S 750,100 900,50 S 1050,0 1200,50" stroke="#a7f3d0" stroke-width="2" fill="none"></path>
                </svg>
                <div id="timeline-items" class="relative w-full h-full">
                    <!-- Items will be positioned by JavaScript -->
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20">
        <div class="dynamic-island-stats">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 gap-10 md:grid-cols-3 text-center">
                    <div class="p-6" data-aos="fade-up">
                        <div class="text-4xl font-bold">۱۰+</div>
                        <div class="mt-4 text-emerald-100">مدال برنز</div>
                    </div>
                    <div class="p-6" data-aos="fade-up">
                        <div class="text-4xl font-bold">۵+</div>
                        <div class="mt-4 text-emerald-100">مدال نقره</div>
                    </div>
                    <div class="p-6" data-aos="fade-up">
                        <div class="text-4xl font-bold">۱۰۰%</div>
                        <div class="mt-4 text-emerald-100">رضایت دانش‌آموزان</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section id="mentors" class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:text-center">
                <h2 class="text-base text-emerald-600 font-semibold tracking-wide uppercase" data-aos="fade-up">نظرات دانش‌آموزان</h2>
                <p class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl" data-aos="fade-up">
                    تجربیات موفق
                </p>
            </div>

            <div class="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <!-- Testimonial 1 -->
                <div class="p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 glassmorphism" data-aos="fade-up">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img class="h-12 w-12 rounded-full" src="http://static.photos/people/200x200/1" alt="">
                        </div>
                        <div class="mr-4">
                            <h4 class="text-lg font-medium text-gray-900">محمد حسینی</h4>
                            <p class="text-emerald-600">مدال طلا المپیاد جهانی ۱۴۰۱</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <p class="text-gray-600">
                            "دوره‌های بیول کاملاً من را برای المپیاد آماده کرد. منابع آموزشی و راهنمایی‌های مربیان بی‌نظیر بود."
                        </p>
                    </div>
                </div>

                <!-- Testimonial 2 -->
                <div class="p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 glassmorphism" data-aos="fade-up">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img class="h-12 w-12 rounded-full" src="http://static.photos/people/200x200/2" alt="">
                        </div>
                        <div class="mr-4">
                            <h4 class="text-lg font-medium text-gray-900">فاطمه محمدی</h4>
                            <p class="text-emerald-600">مدال نقره المپیاد کشوری ۱۴۰۰</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <p class="text-gray-600">
                            "روش تدریس متفاوت و آزمون‌های منظم بیول باعث شد در مدت کوتاهی پیشرفت چشمگیری داشته باشم."
                        </p>
                    </div>
                </div>

                <!-- Testimonial 3 -->
                <div class="p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 glassmorphism" data-aos="fade-up">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img class="h-12 w-12 rounded-full" src="http://static.photos/people/200x200/3" alt="">
                        </div>
                        <div class="mr-4">
                            <h4 class="text-lg font-medium text-gray-900">علی رضایی</h4>
                            <p class="text-emerald-600">مدال برنز المپیاد کشوری ۱۴۰۲</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <p class="text-gray-600">
                            "به عنوان کسی که از شهرستان در این دوره‌ها شرکت کردم، باید بگویم کیفیت آموزش آنلاین بیول واقعاً عالی بود."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300 glassmorphism">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-10">
                <div>
                    <h3 class="text-white text-lg font-semibold">بیول</h3>
                    <p class="mt-6 text-sm">
                        تیم تخصصی آموزش المپیاد زیست‌شناسی بیول (Biowl) با مربیان مجرب و مدال‌آور
                    </p>
                </div>
                <div>
                    <h3 class="text-white text-lg font-semibold">لینک‌های مفید</h3>
                    <ul class="mt-6 space-y-4">
                        <li><a href="#" class="text-sm hover:text-emerald-400 transition-colors duration-300">وبلاگ آموزشی</a></li>
                        <li><a href="#" class="text-sm hover:text-emerald-400 transition-colors duration-300">سوالات متداول</a></li>
                        <li><a href="#" class="text-sm hover:text-emerald-400 transition-colors duration-300">قوانین و مقررات</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-white text-lg font-semibold">تماس با ما</h3>
                    <ul class="mt-6 space-y-4">
                        <li class="flex items-center text-sm">
                            <i data-feather="send" class="w-4 h-4 ml-2"></i>
                            Biowl_Oly@
                        </li>
                        <li class="flex items-center text-sm">
                            <i data-feather="phone" class="w-4 h-4 ml-2"></i>
                            ۰۲۱-۱۲۳۴۵۶۷۸
                        </li>
                        <li class="flex items-center text-sm">
                            <i data-feather="mail" class="w-4 h-4 ml-2"></i>
                            info@biowl.com
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-16 pt-10 border-t border-gray-700">
                <p class="text-sm text-center">
                    تمامی حقوق مادی و معنوی این سایت متعلق به تیم بیول (Biowl) می‌باشد. © ۱۴۰۲
                </p>
            </div>
        </div>
    </footer>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true
  });
  feather.replace();

  const timelineContainer = document.getElementById('timeline-container');
  const timelinePath = document.getElementById('timeline-path');
  const timelineItemsContainer = document.getElementById('timeline-items');
  const stages = [
      { title: 'مرحله اول', description: 'مبانی زیست‌شناسی' },
      { title: 'مرحله دوم', description: 'زیست‌شناسی جانوری' },
      { title: 'مرحله سوم', description: 'زیست‌شناسی گیاهی' },
      { title: 'مرحله چهارم', description: 'اکولوژی و تکامل' },
      { title: 'مرحله پنجم', description: 'آزمایشگاه‌های تخصصی' },
      { title: 'مرحله ششم', description: 'المپیاد جهانی' }
  ];

  function drawTimeline() {
      if (!timelineContainer) return;
      const padding = 50; // 50px padding on each side
      const width = timelineContainer.offsetWidth - padding * 2; // subtract padding from the width
      const height = timelineContainer.offsetHeight;
      const svg = document.getElementById('timeline-svg');
      svg.setAttribute('viewBox', `0 0 ${timelineContainer.offsetWidth} ${height}`);
      let pathData = '';
      const numPoints = stages.length;
      const segmentWidth = width / (numPoints - 1);
      const amplitude = 60;

      // Clear previous items
      timelineItemsContainer.innerHTML = '';

      stages.forEach((stage, index) => {
          const x = padding + segmentWidth * index; // add padding to the x position
          const y = (index % 2 === 0) ? height / 2 - amplitude : height / 2 + amplitude;

          if (index === 0) {
              pathData += `M ${x} ${y}`;
          } else {
              const prevX = padding + segmentWidth * (index - 1);
              const prevY = ((index - 1) % 2 === 0) ? height / 2 - amplitude : height / 2 + amplitude;
              const cp1x = prevX + segmentWidth / 2;
              const cp1y = prevY;
              const cp2x = x - segmentWidth / 2;
              const cp2y = y;
              pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
          }

          const item = document.createElement('div');
          item.className = 'timeline-item';
          item.style.left = `${x}px`;
          item.style.top = `${y}px`;
          item.style.transform = 'translate(-50%, -50%)';
          item.innerHTML = `
              <div class="timeline-content p-4 rounded-lg glassmorphism">
                  <h3 class="text-lg font-medium text-gray-900">${stage.title}</h3>
                  <p class="mt-2 text-sm text-gray-500">${stage.description}</p>
              </div>
              <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">${index + 1}</div>
          `;
          timelineItemsContainer.appendChild(item);
      });

      timelinePath.setAttribute('d', pathData);
  }

  drawTimeline();
  window.addEventListener('resize', drawTimeline);
});
</script>
