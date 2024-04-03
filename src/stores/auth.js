import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
    }),
    actions: {
        async signup(formData) {
            try {
                const response = await axios.post('https://pollapi.innotechteam.in/user/register', formData);
                this.user = response.data;
                
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    console.error('Signup error:', error);
                }
            } 
        },
 
    },
});
