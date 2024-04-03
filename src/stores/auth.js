import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        error: null, 
    }),
    actions: {
        resetError() {
            this.error = null;
        },

        async signUp(formData) {
            this.resetError();
            try {
                const response = await axios.post('https://pollapi.innotechteam.in/user/register', formData);
                this.user = response.data;
            } catch (error) {
                this.error = error.response && error.response.data && error.response.data.errors ? error.response.data.errors : 'Signup failed';
                console.error('Signup error:', this.error);
            } 
        },
        async login(formData){
            try {
                const response = await axios.post('https://pollapi.innotechteam.in/user/login', formData);
                this.user = response.data; 
            } catch (error) {
                this.user = null; 
                this.error = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Login failed.';
                console.error('Login error:', this.error);
                throw error;
            } 
        }
    
    },
});
