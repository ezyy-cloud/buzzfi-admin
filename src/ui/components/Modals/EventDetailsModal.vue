<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

interface Event {
  id: number;
  title: string;
  date: string;
  type: "project" | "ticket" | "other";
  description: string;
}

const props = defineProps<{
  event: Event | undefined;
  show: boolean;
}>();

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="dark:bg-boxdark bg-white p-6 rounded max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">{{ event?.title }}</h3>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p>
        <strong>Date:</strong>
        {{ event?.date && new Date(event.date).toLocaleDateString() }}
      </p>
      <p><strong>Type:</strong> {{ event?.type }}</p>
      <p><strong>Description:</strong> {{ event?.description }}</p>
    </div>
  </div>
</template>
