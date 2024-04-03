export function useValidation() {
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase()) ? '' : 'A valid email is required.';
    };

    const validateFirstName = (firstName) => {
        if (!firstName) return 'First Name is required.';
        if (firstName.length < 3) return 'First Name must be at least 3 characters.';
        return '';
    };

    const validateLastName = (lastName) => {
        if (!lastName) return 'Last Name is required.';
        if (lastName.length < 3) return 'Last Name must be at least 3 characters.';
        return '';
    };

    const validatePassword = (password) => {
        if (!password || password.length < 8) {
            return 'Password is required and must be at least 8 characters long.';
        }
        const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasThreeLetters = (password.match(/[a-zA-Z]/g) || []).length >= 3;
        const hasUpperCase = /[A-Z]/.test(password);

        if (!hasSpecialCharacter || !hasThreeLetters || !hasUpperCase) {
            return 'Password must contain at least one special character, at least three letters (with at least one being uppercase), and must be at least 8 characters long.';
        }
        return '';
    };

    const validateConfirmPassword = (password, confirmPassword) => {
        return password === confirmPassword ? '' : 'Passwords must match.';
    };

    const validateRole = (roleId) => {
        return roleId ? '' : 'Role is required.';
    };

    const validateForm = (form, errors) => {
        let isValid = true;
        Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));

        errors.value.firstName = validateFirstName(form.value.firstName);
        errors.value.lastName = validateLastName(form.value.lastName);
        errors.value.email = validateEmail(form.value.email);
        errors.value.password = validatePassword(form.value.password);
        errors.value.confirmPassword = validateConfirmPassword(form.value.password, form.value.confirmPassword);
        errors.value.roleId = validateRole(form.value.roleId);

        isValid = !Object.values(errors.value).some(error => error !== '');

        return isValid;
    };

    return {
        validateForm,
        validateEmail,
    };
}
