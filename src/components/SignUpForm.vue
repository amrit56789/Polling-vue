<template>
<form @submit.prevent="submitForm" class="m-auto border-2 border-slate-200 rounded-xl w-96 space-y-4 p-4">
    <h1 class="font-bold text-3xl">SignUp Form</h1>
    <div class="field">
        <label for="first-name" class="label">First name:</label>
        <input type="text" v-model="form.firstName" placeholder="First Name" class="input" id="first-name" />
        <p v-if="errors.firstName" class="text-red-500 text-sm mt-1 text-left">{{ errors.firstName }}</p>
    </div>

    <div class="field">
        <label for="last-name" class="label">Last name:</label>
        <input type="text" v-model="form.lastName" placeholder="Last Name" class="input" id="last-name" />
        <p v-if="errors.lastName" class="text-red-500 text-sm mt-1 text-left">{{ errors.lastName }}</p>
    </div>

    <div class="field">
        <label for="email" class="label">Email:</label>
        <input type="email" v-model="form.email" placeholder="Email" class="input" id="email" />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1 text-left">{{ errors.email }}</p>
    </div>

    <div class="field">
        <label for="roles" class="label">Roles:</label>
        <select v-model="form.roleId" class="input" id="roles">
            <option disabled value="">Select a role</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
        </select>
        <p v-if="errors.roleId" class="text-red-500 text-sm mt-1 text-left">{{ errors.roleId }}</p>
    </div>

    <div class="field relative">
        <label for="password" class="label">Password:</label>
        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="Password" class="input" id="password" />
        <span @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            <i :class="{'fas fa-eye-slash': showPassword, 'fas fa-eye': !showPassword}"></i>
        </span>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1 text-left">{{ errors.password }}</p>
    </div>

    <div class="field relative">
        <label for="confirm-password" class="label">Confirm Password:</label>
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" placeholder="Confirm Password" class="input" id="confirm-password" />
        <span @click="toggleConfirmPasswordVisibility" class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
            <i :class="{'fas fa-eye-slash': showConfirmPassword, 'fas fa-eye': !showConfirmPassword}"></i>
        </span>
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1 text-left">{{ errors.confirmPassword }}</p>
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
import {
    useAuthStore
} from '../stores/auth';
import {
    useValidation
} from '../FormValidation/validation';

export default {
    name: 'SignUpForm',
    setup() {
        const toast = useToast();
        const authStore = useAuthStore();
        const {
            validateForm
        } = useValidation();

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
        const showPassword = ref(false);
        const showConfirmPassword = ref(false);

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const toggleConfirmPasswordVisibility = () => {
            showConfirmPassword.value = !showConfirmPassword.value;
        };

        const submitForm = async () => {
            if (!validateForm(form, errors)) {
                return;
            }

            await authStore.signup(form.value);
            if (authStore.user) {
                toast.open({
                    message: 'User successfully signed up',
                    type: 'success',
                    position: 'top-right',
                    duration: 5000,
                });
                Object.keys(form.value).forEach(key => form.value[key] = '');
            }
        };

        return {
            form,
            errors,
            showPassword,
            showConfirmPassword,
            togglePasswordVisibility,
            toggleConfirmPasswordVisibility,
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
