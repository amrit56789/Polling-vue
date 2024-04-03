<template>
<form @submit.prevent="submitForm" class="m-auto border-2 border-slate-200 rounded-xl w-96 space-y-4 p-4">
    <h1 class="font-bold text-3xl">SignUp Form</h1>
    <div class="field">
        <label for="first-name" class="label">First name:</label>
        <input type="text" v-model="form.firstName" placeholder="First Name" class="input" id="first-name" />
        <p v-if="errors.firstName" class="text-red-500">{{ errors.firstName }}</p>
    </div>

    <div class="field">
        <label for="last-name" class="label">Last name:</label>
        <input type="text" v-model="form.lastName" placeholder="Last Name" class="input" id="last-name" />
        <p v-if="errors.lastName" class="text-red-500">{{ errors.lastName }}</p>
    </div>

    <div class="field">
        <label for="email" class="label">Email:</label>
        <input type="email" v-model="form.email" placeholder="Email" class="input" id="email" />
        <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
    </div>

    <div class="field">
        <label for="roles" class="label">Roles:</label>
        <select v-model="form.roleId" class="input" id="roles">
            <option disabled value="">Select a role</option>
            <option>User</option>
            <option>Admin</option>
        </select>
        <p v-if="errors.role" class="text-red-500">{{ errors.role }}</p>
    </div>

    <div class="field">
        <label for="password" class="label">Password:</label>
        <input type="password" v-model="form.password" placeholder="Password" class="input" id="password" />
        <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
    </div>

    <div class="field">
        <label for="confirm-password" class="label">Confirm Password:</label>
        <input type="password" v-model="form.confirmPassword" placeholder="Confirm Password" class="input" id="confirm-password" />
        <p v-if="errors.confirmPassword" class="text-red-500">{{ errors.confirmPassword }}</p>
    </div>

    <button type="submit" class="btn">Sign Up</button>
</form>
</template>

<script>
import {
    ref
} from 'vue';
import {
    useToast
} from 'vue-toast-notification';

import axios from 'axios';

export default {
    setup() {
        const toast = useToast();

        const form = ref({
            firstName: '',
            lastName: '',
            email: '',
            roleId: '',
            password: '',
        });

        const errors = ref({
            firstName: '',
            lastName: '',
            email: '',
            roleId: '',
            password: '',
            confirmPassword: '',
        });

        const validateEmail = (email) => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.toLowerCase());
        };

        const validateForm = () => {
            let isValid = true;
            Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));

            if (!form.value.firstName) {
                errors.value.firstName = 'First Name is required';
                isValid = false;
            }
            if (!form.value.lastName) {
                errors.value.lastName = 'Last Name is required';
                isValid = false;
            }
            if (!form.value.email) {
                errors.value.email = 'Email is required';
                isValid = false;
            } else if (!validateEmail(form.value.email)) {
                errors.value.email = 'A valid email is required';
                isValid = false;
            }
            if (!form.value.roleId) {
                errors.value.roleId = 'Role is required';
                isValid = false;
            }
            if (!form.value.password || form.value.password.length < 6) {
                errors.value.password = 'Password is required (min 6 characters)';
                isValid = false;
            }
            if (form.value.password !== form.value.confirmPassword) {
                errors.value.confirmPassword = 'Passwords must match';
                isValid = false;
            }

            return isValid;
        };

        const submitForm = async () => {
            if (validateForm()) {
                const roleNumeric = form.value.roleId === 'Admin' ? 1 : 2;
                const formData = {
                    ...form.value,
                    roleId: roleNumeric
                };
                try {
                    const response = await axios.post('https://pollapi.innotechteam.in/user/register', formData);
                    console.log('Form submitted successfully:', response.data);
                    form.value.firstName = '';
                    form.value.lastName = '';
                    form.value.email = '';
                    form.value.role = '';
                    form.value.password = '';
                    form.value.confirmPassword = '';
                    toast.open({
                        message: 'User successfully signs up',
                        type: 'success',
                        position: 'top-right',
                        duration: 5000
                    });
                } catch (error) {
                    console.error('Error submitting form:', error.response.data);
                    toast.open({
                        message: 'Error submitting form. Please try again.',
                        type: 'error',
                    });
                }
            }
        };

        return {
            form,
            errors,
            submitForm,
        };
    },
};
</script>

<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    margin: 0.2rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0.25rem;
    border-bottom: 1px solid #592525;
}

.input:focus {
    outline: none;
}

.field {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.label {
    text-align: start;
    margin-bottom: 3px;
    color: #929191;
    font-size: 0.9rem;
}

.btn {
    background-color: #4f46e5;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    width: 100%;
}

.btn:hover {
    background-color: #4338ca;
}
</style>
