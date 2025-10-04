import { createApp } from 'vue';
import App from './App.vue';

// Import only the main custom stylesheet
import './css/main.css';

const app = createApp(App);

app.mount('#app');
