import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function useAddPoll(initialPoll = { title: '', options: [{ title: '' }] }) {
     const authStore = useAuthStore();
     const isLoading = ref(false);
     const error = ref(null);

     const checkPollsIsArray = initialPoll.options?.map(option => {
          return { title: option.title || '' };
     }) || [{ title: '' }, { title: '' }];

     const poll = ref({
          title: initialPoll.title,
          options: checkPollsIsArray,
     });

     const addOption = () => {
          poll.value.options.push({ title: '' });
     };

     const removeOption = (index) => {
          if (poll.value.options.length > 1) {
               poll.value.options.splice(index, 1);
          }
     };

     const submitForm = async () => {
          if (!poll.value.title || poll.value.title.length < 10) {
               throw new Error("Poll title must be at least 10 characters.");
          }
          if (poll.value.options.some(option => !option.title.trim())) {
               throw new Error("All options must have a title.");
          }

          const payload = {
               title: poll.value.title,
               options: poll.value.options.map(option => ({ optionTitle: option.title.trim() })),
          };

          try {
               isLoading.value = true;
               await authStore.addPoll(payload);
               return true;
          } catch (err) {
               console.error("Failed to submit the poll:", err.message);
               error.value = err.message || 'Unknown error occurred.';
               return false;
          } finally {
               isLoading.value = false;
          }
     };

     return {
          poll,
          addOption,
          removeOption,
          submitForm,
          isLoading,
          error,
     };
}
