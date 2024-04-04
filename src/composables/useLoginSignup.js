import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useValidation } from './useValidation';

function useToggleVisibility() {
    const isVisible = ref(false);
    const toggleVisibility = () => {
        isVisible.value = !isVisible.value;
    };
    return { isVisible, toggleVisibility };
}

export function useLogin() {
    const authStore = useAuthStore();
    const { validateForm } = useValidation();
    const { isVisible: showPassword, toggleVisibility: togglePasswordVisibility } = useToggleVisibility();

    const form = ref({
        email: '',
        password: '',
    });

    const errors = ref({
        email: '',
        password: '',
    });

    const isSubmitting = ref(false);
    const submitLogin = async () => {
        isSubmitting.value = true;
        if (!validateForm(form, errors, true)) {
            isSubmitting.value = false;
            return;
        }
        try {
            await authStore.login(form.value);
            Object.keys(form.value).forEach(key => form.value[key] = '');
            return true;
        } catch (error) {
            Object.keys(form.value).forEach(key => form.value[key] = '');
            console.error('Login failed:', error);
            return false;
        } finally {
            isSubmitting.value = false;
        }
    };
    return {
        form,
        errors,
        isSubmitting,
        submitLogin,
        showPassword,
        togglePasswordVisibility,
    };
}

export function useSignup() {
    const authStore = useAuthStore();
    const { validateForm } = useValidation();
    const { isVisible: showPassword, toggleVisibility: togglePasswordVisibility } = useToggleVisibility();
    const { isVisible: showConfirmPassword, toggleVisibility: toggleConfirmPasswordVisibility } = useToggleVisibility();
    const form = ref({
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '',
        confirmPassword: '',
    });

    const errors = ref({
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '',
        confirmPassword: '',
    });

    const isSubmitting = ref(false);
    const submitSignup = async () => {
        isSubmitting.value = true;
        if (!validateForm(form, errors, false)) {
            isSubmitting.value = false;
            return false;
        }
        try {
            await authStore.signUp(form.value);
            Object.keys(form.value).forEach(key => form.value[key] = '');
            return true;
        } catch (error) {
            Object.keys(form.value).forEach(key => form.value[key] = '');
            console.error('Signup failed:', error);
            return false;
        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        form,
        errors,
        isSubmitting,
        submitSignup,
        showPassword,
        togglePasswordVisibility,
        showConfirmPassword,
        toggleConfirmPasswordVisibility,
    };
}
