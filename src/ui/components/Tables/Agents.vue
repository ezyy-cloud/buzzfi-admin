<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="header-container">
      <h4 class="header-title">All Agents</h4>
      <div class="header-action">
        <button
          class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          @click.prevent="showModal = true"
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
    </div>

    <!-- Add Agent Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <h2 class="text-xl font-semibold mb-4">Add New Agent</h2>
      <form @submit.prevent="addAgentHandler">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
            >Name</label
          >
          <input
            v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
            >Email</label
          >
          <input
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password"
            >Password</label
          >
          <input
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
            Add
          </button>
        </div>
      </form>
    </Modal>

    <!-- Edit Agent Modal -->
    <Modal :show="showEditModal" @close="showEditModal = false">
      <h2 class="text-xl font-semibold mb-4">Edit Agent</h2>
      <form @submit.prevent="updateAgentHandler">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-name"
            >Name</label
          >
          <input
            v-model="editAgent.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-name"
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-email"
            >Email</label
          >
          <input
            v-model="editAgent.email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
            Update
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Agent Modal -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <h2 class="text-xl font-semibold mb-4">Delete Agent</h2>
      <p>Are you sure you want to delete {{ deleteAgent.name }}?</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="deleteAgentConfirmed"
          class="bg-red-500 text-white py-2 px-4 rounded"
        >
          Delete
        </button>
        <button
          @click="showDeleteModal = false"
          class="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-if="error" class="text-center text-red-500">
      <p>Error: {{ error }}</p>
    </div>
    <div v-if="!loading && !error" class="flex flex-col">
      <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-7">
        <div class="p-2.5 xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Name</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Email</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Role</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Active</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Location</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Sales</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Manage</h5>
        </div>
      </div>

      <div
        v-for="(agent, key) in agents"
        :key="agent.id"
        :class="`grid grid-cols-3 sm:grid-cols-7 ${
          key === agents.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
        }`"
      >
        <div class="flex items-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ agent.name || "Unknown" }}</p>
        </div>
        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ agent.email }}</p>
        </div>
        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ agent.role || "Agent" }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ agent.active ? "Yes" : "No" }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ agent.location || "Century Mall" }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">${{ agent.totalSales || 0 }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5 space-x-4">
          <div
            class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            @click="editAgentAction(agent)"
          >
            <svg
              class="fill-current duration-300 ease-in-out"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 50 50"
            >
              <path
                d="M 43.050781 1.9746094 C 41.800781 1.9746094 40.549609 2.4503906 39.599609 3.4003906 L 38.800781 4.1992188 L 45.699219 11.099609 L 46.5 10.300781 C 48.4 8.4007812 48.4 5.3003906 46.5 3.4003906 C 45.55 2.4503906 44.300781 1.9746094 43.050781 1.9746094 z M 37.482422 6.0898438 A 1.0001 1.0001 0 0 0 36.794922 6.3925781 L 4.2949219 38.791016 A 1.0001 1.0001 0 0 0 4.0332031 39.242188 L 2.0332031 46.742188 A 1.0001 1.0001 0 0 0 3.2578125 47.966797 L 10.757812 45.966797 A 1.0001 1.0001 0 0 0 11.208984 45.705078 L 43.607422 13.205078 A 1.0001 1.0001 0 1 0 42.191406 11.794922 L 9.9921875 44.09375 L 5.90625 40.007812 L 38.205078 7.8085938 A 1.0001 1.0001 0 0 0 37.482422 6.0898438 z"
              ></path>
            </svg>
          </div>
          <div
            class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            @click="confirmDeleteAgent(agent)"
          >
            <svg
              class="fill-current duration-300"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 32 32"
            >
              <path
                d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAgentsStore } from "@/stores/agents";
import { useSalesStore } from "@/stores/voucherSales";
import Modal from "@/ui/components/Modals/FormModal.vue";
import calculateTotalSales from "@/utilities/totalSales";

const showModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const agentsStore = useAgentsStore();
const salesStore = useSalesStore();
const agents = ref([]);
const name = ref("");
const email = ref("");
const password = ref("");
const editAgent = ref({});
const deleteAgent = ref({});
const loading = ref(true);
const error = ref(null);

const fetchAgents = async () => {
  try {
    loading.value = true;
    await agentsStore.fetchAgents();
    agents.value = agentsStore.agents;

    // Fetch sales data for each agent
    for (const agent of agents.value) {
      agent.totalSales = await getSales(agent.id);
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
};

const getSales = async (agentId) => {
  try {
    const transactions = await salesStore.fetchAgentTransactions(agentId);
    const totalSales = calculateTotalSales(transactions);
    return totalSales;
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return 0;
  }
};

const addAgentHandler = async () => {
  try {
    await agentsStore.addAgent({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password.value,
    });
    showModal.value = false;
    fetchAgents();
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
};

const updateAgentHandler = async () => {
  try {
    await agentsStore.updateAgent(editAgent.value);
    showEditModal.value = false;
    fetchAgents();
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
};

const confirmDeleteAgent = (agent) => {
  deleteAgent.value = agent;
  showDeleteModal.value = true;
};

const deleteAgentConfirmed = async () => {
  try {
    await agentsStore.deleteAgent(deleteAgent.value.id);
    showDeleteModal.value = false;
    fetchAgents();
  } catch (err) {
    error.value = err.response?.data?.message || err.message;
  }
};

const editAgentAction = (agent) => {
  editAgent.value = { ...agent };
  showEditModal.value = true;
};

onMounted(fetchAgents);
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-action button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
