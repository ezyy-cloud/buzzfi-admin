<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div>
      <div class="p-6 flex justify-end items-center border-gray-200">
        <button
          class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          @click="showModal = true"
        >
          <svg
            class="fill-current duration-300 ease-in-out"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr
                class="bg-gray-2 text-left dark:bg-meta-4 border-b border-[#eee] py-5 px-4 dark:border-strokedark"
              >
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  ID
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Title
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Site
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Priority
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Status
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Created At
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in tickets" :key="ticket.id">
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {{ ticket.id }}
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {{ ticket.title }}
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {{ ticket.site }}
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span
                    :class="priorityClass(ticket.priority)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <span
                    :class="statusClass(ticket.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ ticket.status }}
                  </span>
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {{ ticket.createdAt }}
                </td>
                <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {{ ticket.notes }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create Ticket Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="dark:bg-boxdark rounded-lg w-full max-w-md">
        <div class="p-6">
          <h2 class="text-lg font-semibold mb-4">Create New Support Ticket</h2>
          <form @submit.prevent="createTicket">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700"
                >Title</label
              >
              <input
                v-model="newTicket.title"
                id="title"
                type="text"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div class="mb-4">
              <label for="site" class="block text-sm font-medium text-gray-700"
                >Site</label
              >
              <input
                v-model="newTicket.site"
                id="site"
                type="text"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <textarea
                v-model="newTicket.description"
                id="description"
                rows="3"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              ></textarea>
            </div>
            <div class="mb-4">
              <label for="priority" class="block text-sm font-medium text-gray-700"
                >Priority</label
              >
              <select
                v-model="newTicket.priority"
                id="priority"
                required
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="notes" class="block text-sm font-medium text-gray-700"
                >Notes</label
              >
              <textarea
                v-model="newTicket.notes"
                id="notes"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                @click="showModal = false"
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition duration-300 ease-in-out"
              >
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { PlusIcon } from "lucide-vue-next";

const showModal = ref(false);

const tickets = ref([
  {
    id: 1,
    title: "Slow Internet Connection",
    site: "Main Office",
    priority: "high",
    status: "open",
    createdAt: "2023-06-01",
    notes: "Affecting multiple users",
  },
  {
    id: 2,
    title: "Wi-Fi Not Working",
    site: "Branch Office",
    priority: "medium",
    status: "in progress",
    createdAt: "2023-06-02",
    notes: "Issue started after recent storm",
  },
  {
    id: 3,
    title: "Router Configuration Issue",
    site: "Data Center",
    priority: "low",
    status: "closed",
    createdAt: "2023-06-03",
    notes: "Resolved by updating firmware",
  },
]);

const newTicket = reactive({
  title: "",
  site: "",
  description: "",
  priority: "medium",
  notes: "",
});

const priorityClass = (priority) => {
  switch (priority) {
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-grey-100 text-grey-800";
  }
};

const statusClass = (status) => {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-800";
    case "in progress":
      return "bg-purple-100 text-purple-800";
    case "closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const createTicket = () => {
  // In a real application, you would send this data to your backend
  const ticket = {
    id: tickets.value.length + 1,
    ...newTicket,
    status: "open",
    createdAt: new Date().toISOString().split("T")[0],
  };
  tickets.value.push(ticket);
  showModal.value = false;
  // Reset form
  Object.assign(newTicket, {
    title: "",
    site: "",
    description: "",
    priority: "medium",
    notes: "",
  });
};
</script>
