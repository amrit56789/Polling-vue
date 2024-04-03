import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const token = ref(localStorage.getItem('token') || null);
    const error = ref(null);
    const roles = ref([]);

    function resetError() {
        error.value = null;
    }

    async function signUp(formData) {
        resetError();
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/register`, formData);
            user.value = response.data;

        } catch (err) {
            error.value = err.response && err.response.data && err.response.data.errors ? err.response.data.errors : 'Signup failed';
            console.error('Signup error:', error.value);
        } 
    }

    async function login(formData) {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/login`, formData);
            user.value = response.data.user; 
            token.value = response.data.token; 
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);

        } catch (err) {
            user.value = null;
            token.value = null; 
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            error.value = err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Login failed.';
            console.error('Login error:', error.value);
            throw err;
        } 
    }
    async function fetchRoles() {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/role/list`);
            roles.value = response.data; 
        } catch (err) {
            console.error('Failed to fetch roles:', err);
        }
    }

    function logout() {
        user.value = null;
        token.value = null; 
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return { user, token, error, roles, resetError, signUp, login, logout, fetchRoles };
});
