import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import only the main custom stylesheet
import './css/main.css';

const app = createApp(App);

app.use(router);
app.mount('#app');
