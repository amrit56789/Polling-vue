import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import {
    useRouter
} from 'vue-router';
export function usePolls() {

     const isLoading = ref(false);
     const error = ref(null);
     const authStore = useAuthStore();
     const router = useRouter()
     const currentPage = ref(1);
     const limit = ref(10);
 
     const fetchPolls = async () => {
          isLoading.value = true;
          error.value = null;
          try {
              await authStore.getPollList(currentPage.value, limit.value);
          } catch (err) {
              console.error("Failed to fetch polls:", err.message);
              error.value = err.message;
          } finally {
              isLoading.value = false;
          }
      };
  
      const deletePoll = async (pollId) => {
          isLoading.value = true;
          try {
              const result = await authStore.deletePolls(pollId);
              if (result.statusText === "OK") {
                  await fetchPolls(); // Refetch polls after deletion
                  return true;
              }
          } catch (err) {
              console.error("Failed to delete poll:", err.message);
              error.value = err.message;
              return false;
          } finally {
              isLoading.value = false;
          }
      };

      const editPoll = (pollId) => {
          const pollToEdit = authStore.polls.find(poll => poll.id === pollId);
          if (!pollToEdit) {
              console.error('Poll not found');
              return;
          }
          authStore.setCurrentPoll(pollToEdit);
          router.push({
              name: 'EditPoll'
          });
      };
  

      const loadMore = () => {
          currentPage.value++;
          fetchPolls();
      };

      const submitVotes = async (optionId) => {
          isLoading.value = true;
          const payload = { optionId };
          try {
              const result = await authStore.votes(payload);
              if (result.statusText === "OK") {
                  return true;
              }
          } catch (err) {
              console.error("Failed to submit vote:", err.message);
              error.value = err.message;
              return false;
          } finally {
              isLoading.value = false;
          }
      };
  
      const getVotes = async (pollId) =>{
          isLoading.value = true;
          try {
              const result = await authStore.getPollsVotes(pollId);
              if (result.statusText === "OK") {
                  return result.data;
              }
          } catch (err) {
              console.error("Failed to submit vote:", err.message);
              error.value = err.message;
              return false;
          } finally {
              isLoading.value = false;
          }
      }
      onMounted(fetchPolls);


     return {
          isLoading,
          error,
          fetchPolls,
          deletePoll,
          editPoll,
          loadMore,
          submitVotes,
          getVotes
     };
}
