<template>
<nav v-if="isLoggedIn" class="bg-blue-600 p-4 text-white shadow-lg">
     <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center space-x-4">
               <router-link to="/polls" class="text-white hover:text-blue-300 transition duration-150 ease-in-out">Polls</router-link>
               <template v-if="user.roleId === 1">
                    <router-link to="/add-poll" class="text-white hover:text-blue-300 transition duration-150 ease-in-out">Add Poll</router-link>
                    <router-link to="/create-user" class="text-white hover:text-blue-300 transition duration-150 ease-in-out">Create User</router-link>
                    <router-link to="/users-list" class="text-white hover:text-blue-300 transition duration-150 ease-in-out">List Users</router-link>
               </template>
          </div>
          <div class="relative">
               <button @click="toggleDropdown" class="flex items-center focus:outline-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
                 <span class="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                   <svg class="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M24 20.188l-8-5.625v-7.82c0-1.008-.792-1.8-1.8-1.8s-1.8.792-1.8 1.8v7.82l-8 5.625v1.5l8-5.625v7.82l-3 .75v1.192l4-1 4 1v-1.192l-3-.75v-7.82l8 5.625v-1.5z" />
                   </svg>
                 </span>
                 <span class="ml-3">{{ user.firstName }}</span>
               </button>
               <div v-show="showDropdown" @click="showDropdown = false" class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 border border-gray-200">
                    <div class="px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-t-lg">
                      <div class="font-medium">{{ user.firstName }}</div>
                      <div class="text-gray-500">{{ user.email }}</div>
                    </div>
                    <div class="border-t border-gray-200"></div>
                    <button @click="logout" class="w-full hover:text-white text-left block px-4 py-3 text-sm text-gray-700 hover:bg-gray-500 focus:outline-none focus:bg-gray-100">
                      Logout
                    </button>
                  </div>
                  
             </div>
             
     </div>
</nav>
</template>

<script>
import {
     ref,
} from 'vue';
import {
     useAuthStore
} from '../stores/auth';
import {
     storeToRefs
} from 'pinia';
export default {
     name: 'NavbarHeader',
     setup() {
          const authStore = useAuthStore();
          const {logout} = authStore
          const {
               user, isLoggedIn
          } = storeToRefs(authStore)
          const showDropdown = ref(false);
          const toggleDropdown = () => showDropdown.value = !showDropdown.value;

          return {
               logout,
               toggleDropdown,
               showDropdown,
               user,
               isLoggedIn
          };
     },
};
</script>
