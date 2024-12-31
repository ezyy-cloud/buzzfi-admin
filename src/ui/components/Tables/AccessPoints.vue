<template>
  <div
    class="rounded-sm border border-stroke dark:bg-boxdark px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="flex justify-end items-center mb-4">
      <button
        class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        @click="showAddModal = true"
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

    <div class="max-w-full overflow-x-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="bg-gray-2 text-left dark:bg-meta-4">
            <th
              class="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
            >
              Name
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Status
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Model
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              IP Address
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Uptime
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Clients
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Throughput
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Channel Util.
            </th>
            <th class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Signal
            </th>
            <th class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              TX/RX Rates
            </th>
            <th class="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ap in aps" :key="ap.id">
            <td
              class="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
            >
              {{ ap.name }}
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <span
                :class="`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  ap.status === 'online'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`"
              >
                {{ ap.status }}
              </span>
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.model }}
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.ip }}
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.uptime }}
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.clients }}
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.throughput.tx }} / {{ ap.throughput.rx }} Mbps
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  class="bg-primary h-2.5 rounded-full"
                  :style="{ width: `${ap.channelUtilization}%` }"
                ></div>
              </div>
              <span class="text-xs ml-2">{{ ap.channelUtilization }}%</span>
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.signalStrength }} dBm
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {{ ap.txRate }} / {{ ap.rxRate }} Mbps
            </td>
            <td class="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              <div class="flex items-center space-x-3.5">
                <button class="hover:text-primary" @click="editAP(ap)">
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
                </button>
                <button class="hover:text-primary" @click="deleteAP(ap)">
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
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="dark:bg-boxdark p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Add New Access Point</h2>
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="newAP.name"
              id="name"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label for="model" class="block text-sm font-medium text-gray-700"
              >Model</label
            >
            <input
              v-model="newAP.model"
              id="model"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label for="ipAddress" class="block text-sm font-medium text-gray-700"
              >IP Address</label
            >
            <input
              v-model="newAP.ipAddress"
              id="ipAddress"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showAddModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="addAP"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Add Access Point
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="dark:bg-boxdark p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Edit Access Point</h2>
        <div class="space-y-4">
          <div>
            <label for="edit-name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              v-model="currentAP.name"
              id="edit-name"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label for="edit-status" class="block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              v-model="currentAP.status"
              id="edit-status"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label for="edit-model" class="block text-sm font-medium text-gray-700"
              >Model</label
            >
            <input
              v-model="currentAP.model"
              id="edit-model"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div>
            <label for="edit-ipAddress" class="block text-sm font-medium text-gray-700"
              >IP Address</label
            >
            <input
              v-model="currentAP.ipAddress"
              id="edit-ipAddress"
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="updateAP"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Access Point
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="dark:bg-boxdark p-6 rounded-lg w-96">
        <h2 class="text-xl font-semibold mb-4">Delete Access Point</h2>
        <p>Are you sure you want to delete {{ currentAP?.name }}?</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useNetworkStore } from "@/stores/networkStats";

const networkStore = useNetworkStore();

// Helper functions for formatting
const formatUptime = (seconds) => {
  if (!seconds) return '0d 0h';
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  return `${days}d ${hours}h`;
};

const formatThroughput = (bytes) => {
  if (!bytes) return '0';
  const mbps = (bytes * 8) / (1024 * 1024); // Convert bytes/s to Mbps
  return mbps.toFixed(1);
};

// Computed property for access points from store
const aps = computed(() => 
  networkStore.devices.map(device => ({
    id: device._id,
    name: device.name || device.mac,
    status: device.state === 1 && device.adopted ? 'online' : 'offline',
    model: device.model,
    ip: device.ip,
    uptime: formatUptime(device.uptime),
    clients: device.radio_table_stats?.reduce((sum, radio) => sum + (radio.num_sta || 0), 0) || 0,
    throughput: {
      tx: formatThroughput(device.tx_bytes_r),
      rx: formatThroughput(device.rx_bytes_r)
    }
  }))
);

const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const currentAP = ref(null);
const newAP = reactive({
  name: "",
  status: "online",
  model: "",
  ipAddress: "",
  uptime: "0d 0h",
  connectedClients: 0,
  totalThroughput: 0,
  channelUtilization: 0,
  signalStrength: 0,
  txRate: 0,
  rxRate: 0,
});

const addAP = () => {
  const id = (aps.value.length + 1).toString();
  aps.value.push({ id, ...newAP });
  showAddModal.value = false;
  Object.assign(newAP, {
    name: "",
    status: "online",
    model: "",
    ipAddress: "",
    uptime: "0d 0h",
    connectedClients: 0,
    totalThroughput: 0,
    channelUtilization: 0,
    signalStrength: 0,
    txRate: 0,
    rxRate: 0,
  });
};

const editAP = (ap) => {
  currentAP.value = { ...ap };
  showEditModal.value = true;
};

const updateAP = () => {
  const index = aps.value.findIndex((ap) => ap.id === currentAP.value.id);
  if (index !== -1) {
    aps.value[index] = { ...currentAP.value };
  }
  showEditModal.value = false;
};

const deleteAP = (ap) => {
  currentAP.value = ap;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  aps.value = aps.value.filter((ap) => ap.id !== currentAP.value.id);
  showDeleteModal.value = false;
};
</script>
