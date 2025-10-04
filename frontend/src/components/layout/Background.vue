<template>
  <div class="background-grid"></div>
</template>

<style scoped>
.background-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: #f0fdf4;
  background-image:
    linear-gradient(to right, #a7f3d0 1px, transparent 1px),
    linear-gradient(to bottom, #a7f3d0 1px, transparent 1px);
  background-size: 20px 20px;
  animation: moveGrid 2s linear infinite;
}

@keyframes moveGrid {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 20px -20px;
  }
}
</style>
