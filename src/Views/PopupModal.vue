<template>
<div v-if="isVisible" class="modal-overlay">
    <div :class="['modal', typeClass]">
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="confirm">OK</button>
    </div>
</div>
</template>

<script>
export default {
    props: {
        isVisible: Boolean,
        title: String,
        message: String,
        type: String,
    },
    computed: {
        typeClass() {
            return this.type === 'error' ? 'modal-error' : 'modal-success';
        },
    },
    methods: {
        confirm() {
            this.$emit('confirmed');
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    padding: 20px;
    border-radius: 5px;
}

.modal-success {
    background-color: white;
}

.modal-error {
    background-color: red;
    color: white;
}
</style>
