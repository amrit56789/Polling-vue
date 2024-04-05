import { reactive, toRefs, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

const apiUrl = process.env.VUE_APP_API_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
    const state = reactive({
        user: JSON.parse(localStorage.getItem('user')),
        userToken: localStorage.getItem('token'),
        roles: [],
        polls: [],
        userList: [],
        signupError: null,
        loginError: null,
        pollError: null,
        userListError: null,
        page: 1,
        limit: 4,
        route: null,
        totalPages: 0
    });

    const router = useRouter();

    const resetError = () => {
        state.signupError = null;
        state.loginError = null;
    };

    const isLoggedIn = computed(() => !!state.user && !!state.userToken);

    const signUp = async (formData, endPoint) => {
        resetError();
        try {
            let response;
            if (endPoint === 'Create User') {
                response = await axios.post(`${apiUrl}/user/create`, formData, {
                    headers: {
                        token: state.userToken
                    }
                });
            } else {
                response = await axios.get(`${apiUrl}/user/register`, formData)
            }
            state.user = response.data.user;
            state.userToken = response.data.token;
            if (!endPoint === 'Create User') {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);
            }
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
        localStorage.removeItem('voter');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    const getPollList = async () => {
        if (!state.userToken) {
            console.error("Authentication token not found.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/poll/list/${state.page}?limit=${state.limit}`, {
                headers: {
                    token: state.userToken
                }
            });
            console.log(response.data.rows)
            state.polls = response.data.rows;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
            state.pollError = err.response?.data?.message || 'Failed to fetch polls.';
        }
    };

    const getUserList = async (page, limit) => {
        console.log(page, limit)
        if (!state.userToken) {
            console.error("Authentication token not found.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/user/list/${page}?limit=${limit}`, {
                headers: {
                    token: state.userToken
                }
            });
            console.log(response.data)
            state.userList = response.data.rows;
            const totalUsers = response.data.count;
            state.totalPages = Math.ceil(totalUsers / limit);
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
            state.userListError = err.response?.data?.message || 'Failed to fetch polls.';
        }
    }
    return {
        ...toRefs(state),
        resetError,
        signUp,
        login,
        logout,
        fetchRoles,
        isLoggedIn,
        getPollList,
        getUserList
    };
});
