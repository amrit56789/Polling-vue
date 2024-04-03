<template>
     <transition name="fade">
       <div v-if="visible" :class="['toast', type]" @click="hide">
         {{ message }}
       </div>
     </transition>
</template>
   
<script>
import { ref } from 'vue';

export default {
  name: 'ToastMessage',
  props: {
    message: String,
    type: {
      type: String,
      default: 'info', 
    },
  },
  setup() {
    const visible = ref(false);

    const show = () => {
      visible.value = true;
      setTimeout(() => {
        visible.value = false;
      }, 3000); // Adjust the duration if needed
    };

    const hide = () => {
      visible.value = false;
    };

    show();

    return {
      visible,
      hide,
    };
  },
};
</script>
   
<style scoped>
.toast {
  width: 60%;
  max-width: 600px;
  margin: auto;
  padding: 20px; 
  border-radius: 10px;
  color: white;
  position: fixed;
  left: 50%; 
  bottom: 20px;
  transform: translateX(-50%);
  user-select: none;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.info { background-color: #3498db; }
.success { background-color: #2ecc71; }
.warning { background-color: #f39c12; }
.error { background-color: #e74c3c; }
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(20px); /* Add a slight movement to the fade effect */
}
</style>
