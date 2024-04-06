import { createRouter, createWebHashHistory } from 'vue-router';
import SignUpForm from '../Views/SignUpForm.vue';
import LoginForm from '../Views/LoginForm.vue';
import PollList from '../Views/PollList.vue';
import UserList from '../Views/UserList.vue';
import AddPoll from '../Views/AddPoll.vue';
const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUpForm
    },
    {
        path: '/login',
        name: 'login',
        component: LoginForm
    },

    {
        path: '/polls',
        name: 'polls',
        component: PollList
    },
    {
        path: '/create-user',
        name: 'create-user',
        component: SignUpForm
    },
    {
        path: '/users-list',
        name: 'users-list',
        component: UserList
    },
    {
        path: '/add-poll',
        name: 'add-poll',
        component: AddPoll
    },
    {
        path: '/edit-poll', 
        name: 'EditPoll',
        component: AddPoll,
        props: true,
    },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
