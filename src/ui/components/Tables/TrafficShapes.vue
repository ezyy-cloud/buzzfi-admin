<template>
  <div
    class="rounded-sm border border-stroke px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <!-- Policy List -->
    <div>
      <div
        class="p-4 bg-gray-50 font-medium text-gray-700 flex justify-between items-center"
      >
        <h2 class="text-lg">Existing Policies</h2>

        <button
          class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
          @click="
            showModal = true;
            editingPolicy = null;
          "
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
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr
              class="bg-gray-2 text-left dark:bg-meta-4 border-b border-[#eee] py-5 px-4 dark:border-strokedark"
            >
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Download Limit (kbps)
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Upload Limit (kbps)
              </th>
              <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="dark:bg-boxdark divide-y divide-gray-200">
            <tr v-for="policy in policies" :key="policy.id">
              <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {{ policy.name }}
              </td>
              <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {{ policy.downloadLimit }}
              </td>
              <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                {{ policy.uploadLimit }}
              </td>
              <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <button
                  @click="editPolicy(policy)"
                  class="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button
                  @click="deletePolicy(policy.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Policy Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div class="dark:bg-boxdark p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">
          {{ editingPolicy ? "Edit" : "Add" }} Traffic Shaping Policy
        </h2>
        <form @submit.prevent="savePolicy">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              v-model="currentPolicy.name"
              required
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="downloadLimit" class="block text-sm font-medium text-gray-700"
              >Download Limit (kbps)</label
            >
            <input
              type="number"
              id="downloadLimit"
              v-model="currentPolicy.downloadLimit"
              required
              min="0"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="mb-4">
            <label for="uploadLimit" class="block text-sm font-medium text-gray-700"
              >Upload Limit (kbps)</label
            >
            <input
              type="number"
              id="uploadLimit"
              v-model="currentPolicy.uploadLimit"
              required
              min="0"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showModal = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {{ editingPolicy ? "Update" : "Add" }} Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-vue-next";

// State
const policies = ref([]);
const showModal = ref(false);
const editingPolicy = ref(null);
const currentPolicy = reactive({
  id: null,
  name: "",
  downloadLimit: 0,
  uploadLimit: 0,
});

// API functions (to be implemented)
const fetchPolicies = async () => {
  // Fetch policies from UniFi API
  // This is a placeholder implementation
  policies.value = [
    { id: 1, name: "Basic", downloadLimit: 5000, uploadLimit: 2000 },
    { id: 2, name: "Premium", downloadLimit: 10000, uploadLimit: 5000 },
  ];
};

const addPolicy = async (policy) => {
  // Add policy to UniFi API
  // This is a placeholder implementation
  policies.value.push({ ...policy, id: Date.now() });
};

const updatePolicy = async (policy) => {
  // Update policy in UniFi API
  // This is a placeholder implementation
  const index = policies.value.findIndex((p) => p.id === policy.id);
  if (index !== -1) {
    policies.value[index] = policy;
  }
};

const deletePolicy = async (id) => {
  // Delete policy from UniFi API
  // This is a placeholder implementation
  policies.value = policies.value.filter((p) => p.id !== id);
};

// Event handlers
const editPolicy = (policy) => {
  editingPolicy.value = policy;
  Object.assign(currentPolicy, policy);
  showModal.value = true;
};

const savePolicy = async () => {
  if (editingPolicy.value) {
    await updatePolicy(currentPolicy);
  } else {
    await addPolicy(currentPolicy);
  }
  showModal.value = false;
  resetForm();
  await fetchPolicies();
};

const resetForm = () => {
  editingPolicy.value = null;
  Object.assign(currentPolicy, { id: null, name: "", downloadLimit: 0, uploadLimit: 0 });
};

// Fetch policies on component mount
fetchPolicies();
</script>
