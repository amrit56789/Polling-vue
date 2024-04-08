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
        route: null,
        totalPages: 0,
        currentPoll: null,
    });
    const setCurrentPoll = (pollData) => {
        state.currentPoll = pollData;
    };

    const getCurrentPoll = () => {
        return state.currentPoll;
    };
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
                response = await axios.post(`${apiUrl}/user/register`, formData)
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
        localStorage.removeItem('votedPolls');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push('/login');
    };

    const getPollList = async (currentPage, limit) => {
        if (!state.userToken) {
            console.error("Authentication token not found.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/poll/list/${currentPage}?limit=${limit}`, {
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

    const addEditPoll = async (pollId, payload, isEdit) => {
        try {
            if (isEdit) {
                await axios.put(`${apiUrl}/poll/${pollId}`, payload, {
                    headers: {
                        token: state.userToken
                    }
                });
            } else {
                await axios.post(`${apiUrl}/poll/add`, payload, {
                    headers: {
                        token: state.userToken
                    }
                });
            }
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
            state.userListError = err.response?.data?.message || 'Failed to fetch polls.';
        }
    }

    const deletePollOptions = async (optionId) => {
        try {
            const result = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/option/delete/${optionId}`, {
                headers: {
                    token: state.userToken
                }
            });
            return result
        } catch (err) {
            console.log(err)
        }
    }
    async function updateOption(optionId, title) {
        try {
            const response = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/option/edit/${optionId}`,
                { optionTitle: title },
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }

    }

    const updateNewOptionInExistingPoll = async (pollId, payload) => {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/poll/addPollOption/${pollId}`,
                payload,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response.data;
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }

    }

    const deletePolls = async (pollId) => {
        try {
            const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/poll/${pollId}`,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    }

    const votes = async (payload) => {
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/vote/count`, payload,
                {
                    headers: {
                        token: state.userToken
                    }
                }
            );
            return response
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
        }
    }

    const getPollsVotes = async (pollId) => {
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/poll/${pollId}`, {
                headers: {
                    token: state.userToken 
                }
            });
            return response; 
        } catch (err) {
            console.error('Failed to fetch polls:', err.response?.data);
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
        getUserList,
        addEditPoll,
        setCurrentPoll,
        getCurrentPoll,
        deletePollOptions,
        updateOption,
        updateNewOptionInExistingPoll,
        deletePolls,
        votes,
        getPollsVotes
    };
});
