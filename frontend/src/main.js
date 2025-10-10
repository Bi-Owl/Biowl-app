import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';

// Import only the main custom stylesheet
import './css/main.css';

const app = createApp(App);
const vfm = createVfm();

const options = {
  rtl: false,
  position: 'top-left',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
};

app.use(Toast, options);
app.use(router);
app.use(vfm);
app.mount('#app');
