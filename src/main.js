import { createApp } from 'vue'
import './assets/styles/index.css';
import App from './App.vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
const app = createApp(App);

app.use(VueToast);
createApp(App).mount('#app')
