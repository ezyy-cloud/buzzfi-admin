<!-- Modal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
  >
    <div class="relative bg-white dark:bg-boxdark rounded-lg p-4 shadow-lg min-w-80">
      <!-- Close button inside modal -->
      <button
        class="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
        @click="closeModal"
      >
        ✖
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
/* Add any additional styles for the modal */
</style>
