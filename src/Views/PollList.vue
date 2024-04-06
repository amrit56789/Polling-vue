<template>
<div class="max-w-4xl mx-auto py-6">
     <div v-if="isLoading" class="text-center">Loading polls...</div>
     <div v-if="error" class="text-red-500 text-center">{{ error }}</div>
     <div v-for="poll in polls" :key="poll.id" class="mt-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 rounded-lg shadow-lg px-5 py-4 hover:shadow-xl transition-shadow duration-300">
          <h3 class="text-2xl font-bold text-blue-900">{{ poll.title }}</h3>
          <form @submit.prevent="submitVote(poll.id)">
               <div v-for="option in poll.optionList" :key="option.id" class="mt-2">
                    <label :for="`option-${option.id}`" class="flex items-center cursor-pointer">
                         <input type="radio" :id="`option-${option.id}`" :name="`poll-${poll.id}`" :disabled="isVoted(poll.id)" v-model="selectedOption[poll.id]" :value="option.id" class="accent-blue-500 h-4 w-4">
                         <span class="ml-2 text-lg text-gray-700">{{ option.optionTitle }}</span>
                    </label>
               </div>
               <button type="submit" class="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200" :disabled="isVoted(poll.id)">Submit</button>
          </form>

          <!-- Admin controls -->
          <div v-if="user?.roleId === 1" class="flex space-x-3 mt-4 justify-end">
               <button @click="editPoll(poll.id)" class="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200">Edit</button>
               <button @click="showResults(poll.id)" class="px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors duration-200">Results</button>
          </div>
     </div>
     <button v-if="!isLoading && polls.length" @click="fetchPolls" class="mt-6 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 w-full font-semibold rounded-lg transition-colors duration-200">Load More</button>
</div>
</template>

<script>
import {
     ref
} from 'vue';
import {
     useRouter
} from 'vue-router';
import {
     usePolls
} from '../composables/usePollList';
import {
     useAuthStore
} from '../stores/auth';
import {
     storeToRefs
} from 'pinia';


export default {
     setup() {
          const {
               isLoading,
               error,
               fetchPolls
          } = usePolls();
          const router = useRouter();

          const selectedOption = ref({});
          const authStore = useAuthStore();
          const {
               polls,
               user
          } = storeToRefs(authStore)
          const isVoted = () => {
               // return localStorage.getItem(`voted_${pollId}`) ? true : false;
          };

          const submitVote = (pollId) => {
               if (!selectedOption.value[pollId] || isVoted(pollId)) return;
               console.log(`Submitting vote for poll ID ${pollId} and option ${selectedOption.value[pollId]}`);
               // localStorage.setItem(`voted_${pollId}`, true);
          };

         const editPoll = (pollId) => {
            const pollToEdit = polls.value.find(poll => poll.id === pollId);
            if (!pollToEdit) {
                console.error('Poll not found');
                return;
            }
            authStore.setCurrentPoll(pollToEdit);
            router.push({ name: 'EditPoll' });
        };
          const showResults = (pollId) => {
               console.log(`Showing results for poll ID ${pollId}`);
          };

          return {
               polls,
               isLoading,
               error,
               fetchPolls,
               isVoted,
               submitVote,
               selectedOption,
               user,
               editPoll,
               showResults,
          };
     },
};
</script>
