<template>
<div class="max-w-4xl mx-auto p-5">
     <h2 class="text-2xl font-semibold mb-5">{{ isEditPoll ? 'Edit Poll' : 'Add Poll' }}</h2>
     <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Poll Title -->
          <div>
               <label for="pollTitle" class="block text-xl font-medium text-gray-700 text-left">
                    Poll Title
               </label>
               <div class="mt-1">
                    <input id="pollTitle" name="pollTitle" type="text" required minlength="10" class="p-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter poll title here..." v-model="poll.title">
               </div>
          </div>

          <!-- Options -->
          <div v-for="(option, index) in poll.options" :key="index" class="pt-2">
               <label class="block text-lg font-medium text-left text-gray-700">Option {{ index + 1 }}</label>
               <div class="mt-1 flex rounded-md shadow-sm">
                    <input type="text" v-model="option.title" required class="flex-grow block w-full min-w-0 rounded-md sm:text-sm border-gray-300" />
                    <button type="button" @click="removeOption(index)" class="ml-2 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none">
                         Delete
                    </button>
               </div>
          </div>
          <div class="pt-5">
               <div class="flex justify-start">
                    <button type="button" @click="addOption" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-700">
                         Add Option
                    </button>
               </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-5">
               <div class="flex justify-end">
                    <button type="submit" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                         {{ isEditPoll ? 'Update Poll' : 'Create Poll' }}
                    </button>
               </div>
          </div>
     </form>
     <PopupModal :isVisible="showModal" :title="modalTitle" :message="modalMessage" :type="modalType" @confirmed="handleModalConfirm" />
</div>
</template>

<script>
import {
     ref,
     computed
} from 'vue';
import {
     useRouter
} from 'vue-router';
import {
     useAddPoll
} from "../composables/useAddPoll";
import {
     useAuthStore
} from '../stores/auth';
import PopupModal from './PopupModal.vue';
export default {
     name: 'AddPoll',
     components: {
          PopupModal
     },
     setup() {
          const router = useRouter();
          const authStore = useAuthStore();
          const showModal = ref(false);
          const modalTitle = ref('');
          const modalMessage = ref('');
          const modalType = ref('success');

          const existingPoll = computed(() => authStore.getCurrentPoll());
          const isEditPoll = computed(() => !!existingPoll.value);
          const checkIsEditOrAddPoll = isEditPoll.value ? {
               title: existingPoll.value.title,
               options: existingPoll.value.optionList.map(option => ({
                    title: option.optionTitle
               }))
          } : {
               title: '',
               options: [{
                    title: ''
               }, {
                    title: ''
               }]
          };
          const {
               poll,
               addOption,
               removeOption,
               submitForm
          } = useAddPoll(checkIsEditOrAddPoll);
          const handleSubmit = async () => {
               try {
                    const result = await submitForm();
                    if (result) {
                         modalTitle.value = "Success";
                         modalMessage.value = isEditPoll.value ? "Poll updated successfully!" : "Poll created successfully!";
                         modalType.value = 'success';
                         showModal.value = true;
                    }
               } catch (error) {
                    modalTitle.value = "Failed";
                    modalMessage.value = "Failed to process the poll!";
                    modalType.value = 'failed';
                    showModal.value = true;
                    console.error('Failed to process the poll:', error);
               }
          };

          const handleModalConfirm = () => {
               if (modalType.value === 'success') {
                    router.push('/polls');
               } else {
                    showModal.value = false;
               }
          };

          return {
               poll,
               addOption,
               removeOption,
               handleSubmit,
               showModal,
               modalMessage,
               modalType,
               modalTitle,
               handleModalConfirm,
               isEditPoll
          };
     },
};
</script>
