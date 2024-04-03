
export function useValidation() {
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    };

    const validateForm = (form, errors) => {
        let isValid = true;
        Object.keys(errors.value).forEach((key) => (errors.value[key] = ''));

        if (!form.value.firstName) {
            errors.value.firstName = 'First Name is required.';
            isValid = false;
        } else if (form.value.firstName.length < 3) {
            errors.value.firstName = 'First Name must be at least 3 character.';
            isValid = false;
        }

        if (!form.value.lastName) {
            errors.value.lastName = 'Last Name is required';
            isValid = false;
        } else if (form.value.lastName.length < 3) {
            errors.value.lastName = 'Last Name must be at least 3 character.';
            isValid = false;
        }
        if (!form.value.email) {
            errors.value.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(form.value.email)) {
            errors.value.email = 'A valid email is required.';
            isValid = false;
        }
        if (!form.value.roleId) {
            errors.value.roleId = 'Role is required.';
            isValid = false;
        }
        if (!form.value.password || form.value.password.length < 8) {
            errors.value.password = 'Password is required and must be at least 8 characters long.';
            isValid = false;
        } else {
            const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password);
            const hasThreeLetters = (form.value.password.match(/[a-zA-Z]/g) || []).length >= 3;
            const hasUpperCase = /[A-Z]/.test(form.value.password);

            if (!hasSpecialCharacter || !hasThreeLetters || !hasUpperCase) {
                errors.value.password = 'Password must contain at least one special character, at least three letters (with at least one being uppercase), and must be at least 8 characters long.';
                isValid = false;
            }
        }

        if (form.value.password !== form.value.confirmPassword) {
            errors.value.confirmPassword = 'Passwords must match';
            isValid = false;
        }

        return isValid;
    };

    return {
        validateForm,
    };
}
