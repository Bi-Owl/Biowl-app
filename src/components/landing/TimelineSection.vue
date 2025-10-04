<template>
  <section id="programs" class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="lg:text-center">
        <h2
          class="text-base text-emerald-600 font-semibold tracking-wide uppercase"
          data-aos="fade-up"
        >
          مسیر آموزشی
        </h2>
        <p
          class="mt-4 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          data-aos="fade-up"
        >
          ۶ مرحله تا مدال المپیاد
        </p>
      </div>

      <div id="timeline-container" class="mt-24 relative h-64">
        <svg
          id="timeline-svg"
          class="absolute w-full h-full"
          viewbox="0 0 1200 100"
          preserveaspectratio="none"
        >
          <path
            id="timeline-path"
            d="M0,50 C 150,0 150,100 300,50 S 450,0 600,50 S 750,100 900,50 S 1050,0 1200,50"
            stroke="#a7f3d0"
            stroke-width="2"
            fill="none"
          ></path>
        </svg>
        <div id="timeline-items" class="relative w-full h-full">
          <!-- Items will be positioned by JavaScript -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Define these variables here to be accessible across lifecycle hooks
let timelineContainer, timelinePath, timelineItemsContainer;

const stages = [
  { title: 'مرحله اول', description: 'مبانی زیست‌شناسی' },
  { title: 'مرحله دوم', description: 'زیست‌شناسی جانوری' },
  { title: 'مرحله سوم', description: 'زیست‌شناسی گیاهی' },
  { title: 'مرحله چهارم', description: 'اکولوژی و تکامل' },
  { title: 'مرحله پنجم', description: 'آزمایشگاه‌های تخصصی' },
  { title: 'مرحله ششم', description: 'المپیاد جهانی' },
];

function drawTimeline() {
  if (!timelineContainer) return;

  const padding = 50; // 50px padding on each side
  const width = timelineContainer.offsetWidth - padding * 2;
  const height = timelineContainer.offsetHeight;
  const svg = document.getElementById('timeline-svg');

  if (!svg || !timelineItemsContainer || !timelinePath) return;

  svg.setAttribute('viewBox', `0 0 ${timelineContainer.offsetWidth} ${height}`);
  let pathData = '';
  const numPoints = stages.length;
  const segmentWidth = width / (numPoints - 1);
  const amplitude = 60;

  timelineItemsContainer.innerHTML = '';

  stages.forEach((stage, index) => {
    const x = padding + segmentWidth * index;
    const y = index % 2 === 0 ? height / 2 - amplitude : height / 2 + amplitude;

    if (index === 0) {
      pathData += `M ${x} ${y}`;
    } else {
      const prevX = padding + segmentWidth * (index - 1);
      const prevY =
        (index - 1) % 2 === 0 ? height / 2 - amplitude : height / 2 + amplitude;
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

onMounted(() => {
  // Assign elements once the component is mounted
  timelineContainer = document.getElementById('timeline-container');
  timelinePath = document.getElementById('timeline-path');
  timelineItemsContainer = document.getElementById('timeline-items');

  // Draw timeline on initial load and on resize
  window.addEventListener('load', drawTimeline);
  window.addEventListener('resize', drawTimeline);

  // A fallback for navigation within the app
  drawTimeline();
});

onUnmounted(() => {
  // Clean up event listeners when the component is destroyed
  window.removeEventListener('load', drawTimeline);
  window.removeEventListener('resize', drawTimeline);
});
</script>

<style>
/* These styles need to be global because the timeline items are positioned absolutely within a relative container */
.timeline-item {
  position: absolute;
  width: 150px;
}

.timeline-content {
  position: relative;
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
