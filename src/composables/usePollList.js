import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

export function usePolls() {

     const isLoading = ref(false);
     const error = ref(null);
     const authStore = useAuthStore()
     const fetchPolls = async () => {
          isLoading.value = true;
          error.value = null;

          try {
             await authStore.getPollList();
             return true
          } catch (err) {
               console.error("Failed to fetch polls:", err.message);
               error.value = err.message;
               return false
          } finally {
               isLoading.value = false;
          }
     };

     onMounted(fetchPolls);

     return {
          isLoading,
          error,
          fetchPolls
     };
}
