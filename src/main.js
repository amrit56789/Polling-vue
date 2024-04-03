import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './assets/styles/index.css';
import App from './App.vue'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
const app = createApp(App);
import router from './router/index'

const pinia = createPinia()
app.use(pinia)
app.use(VueToast);
createApp(App).use(router).mount('#app')
