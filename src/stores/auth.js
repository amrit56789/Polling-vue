import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_BASE_URL;
export const useAuthStore = defineStore('auth', () => {
    const state = reactive({
        user: null,
        userToken: null,
        roles: [],
        signupError: null,
        loginError: null,
    });

    const resetError = () => {
        state.signupError = null;
        state.loginError = null;
    };

    const signUp = async (formData) => {
        resetError();
        try {
            const response = await axios.post(`${apiUrl}/user/register`, formData);
            state.user = response.data.user;
            state.userToken = response.data.token;
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            console.log(err.response?.data);
            state.signupError = err.response?.data || 'Signup failed';
            throw new Error(state.signupError);
        }
    };

    const login = async (formData) => {
        resetError();
        try {
            const response = await axios.post(`${apiUrl}/user/login`, formData);
            state.user = response.data.user;
            state.userToken = response.data.token;
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        } catch (err) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            state.loginError = err.response?.data?.message || 'Login failed.';
            console.log('Login error:', state.loginError);
            throw err;
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${apiUrl}/role/list`);
            state.roles = response.data;
        } catch (err) {
            console.log('Failed to fetch roles:', err);
            throw err;
        }
    };

    const logout = () => {
        state.user = null;
        state.userToken = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return {
        ...toRefs(state),
        resetError,
        signUp,
        login,
        logout,
        fetchRoles,
    };
});
