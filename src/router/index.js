import { createRouter, createWebHistory } from 'vue-router'
import SignUpForm from '../components/SignUpForm.vue'


const routes = [
    {
        path: '/',
        redirect: '/signup'
      },
      {
        path: '/signup',
        name: 'signup',
        component: SignUpForm
      },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
