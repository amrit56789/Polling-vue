<template>
<div class="flex justify-center gap-10 mt-32">

     <form @submit.prevent="handleUserLogin" class=" border-2 border-slate-200 rounded-xl space-y-4 p-4 shadow-lg flex flex-col justify-between">
          <h1 class="font-bold text-2xl text-center">Login</h1>
          <div class="field">
               <label for="email" class="label">Email:</label>
               <input type="email" v-model="loginForm.email" placeholder="Email" class="input" id="email" />
               <p v-if="errors.email" class="text-red-500 text-sm mt-1 text-left">{{ errors.email }}</p>
          </div>

          <div class="field relative">
               <label for="password" class="label">Password:</label>
               <input type="password" v-model="loginForm.password" placeholder="Password" class="input" id="password" />
               <p v-if="errors.password" class="text-red-500 text-sm mt-1 text-left">{{ errors.password }}</p>
          </div>

          <button type="submit" class="btn flex justify-center items-center" :disabled="isSubmitting">
               <span v-if="!isSubmitting">Login</span>
               <div v-else class="button-loader"></div>
          </button>
          <ToastMessage v-if="toastMessage.message" :message="toastMessage.message" :type="toastMessage.type" />

     </form>
</div>
</template>

<script>
import {
     ref
} from 'vue';
import {
     useAuthStore
} from '../stores/auth';
import {
     useValidation
} from '../FormValidation/validation';
import ToastMessage from "./ToastMessage.vue"

export default {
     name: 'LoginForm',
     components: {
          ToastMessage,
     },
     setup() {
          const authStore = useAuthStore();
          const toastMessage = ref({
               message: '',
               type: 'info'
          });

          const showToast = (message, type = 'info') => {
               toastMessage.value = {
                    message,
                    type
               };
          };

          const {
               validateForm
          } = useValidation();
          const isSubmitting = ref(false);
          const loginForm = ref({
               email: '',
               password: '',
          });

          const errors = ref({
               email: '',
               password: '',
          });

          const handleUserLogin = async () => {
               if (!validateForm(loginForm, errors, true)) {
                    isSubmitting.value = false;
                    return;
               }

               if (errors.value.email || errors.value.password) {
                    isSubmitting.value = false;
                    return;
               }

               try {
                    await authStore.login(loginForm.value);
                    showToast('User successfully logged in', 'success');

                    loginForm.value.email = '';
                    loginForm.value.password = '';
               } catch (error) {
                    showToast('Login failed. Please check your credentials.', 'error');

               } finally {
                    isSubmitting.value = false;
               }
          };

          return {
               loginForm,
               errors,
               handleUserLogin,
               isSubmitting,
               showToast,
               toastMessage,
          };
     },
};
</script>

<style scoped>
form {
     width: 30%;
     background-color: #FFFFFF;
     padding: 20px 40px;
}

.input {
     width: 100%;
     padding: 0.5rem;
     margin: 0.1rem 0;
     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
     border: none;
     border-bottom: 1px solid #592525;
     font-size: 0.8rem;
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
     margin-bottom: 5px;
     color: #929191;
     font-size: 0.95rem;
}

.btn {
     background-color: #1DB75F;
     color: white;
     padding: 0.5rem 1rem;
     border: none;
     border-radius: 0.25rem;
     cursor: pointer;
     width: 100%;
     position: relative;
     display: inline-flex;
     align-items: center;
     justify-content: center;
}

.button-loader {
     border: 2px solid #f3f3f3;
     border-top: 2px solid #3498db;
     border-radius: 50%;
     width: 16px;
     height: 16px;
     animation: spin 1s linear infinite;
}

.btn:hover {
     background-color: #23824c;
}

@keyframes spin {
     0% {
          transform: rotate(0deg);
     }

     100% {
          transform: rotate(360deg);
     }
}
</style>
