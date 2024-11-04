<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <div class="header-container">
      <h4 class="header-title">All Sites</h4>
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

    <!-- Add Site Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <h2 class="text-xl font-semibold mb-4">Add New Site</h2>
      <form
        @submit.prevent="addSiteHandler"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
            >Name</label
          >
          <input
            v-model="newSite.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description"
            >Description</label
          >
          <textarea
            v-model="newSite.description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Optional description of the site"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="coordinates"
            >Coordinates</label
          >
          <input
            v-model="newSite.coordinates"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="coordinates"
            type="text"
            placeholder="lat,lng (e.g., 34.0522,-118.2437)"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="address"
            >Address</label
          >
          <input
            v-model="newSite.address"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Street Address"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="city"
            >City</label
          >
          <input
            v-model="newSite.city"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="city"
            type="text"
            placeholder="City"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="province"
            >Province/Region</label
          >
          <input
            v-model="newSite.province"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="province"
            type="text"
            placeholder="Province/Region"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="country"
            >Country</label
          >
          <input
            v-model="newSite.country"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="country"
            type="text"
            placeholder="Country"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="type"
            >Type</label
          >
          <input
            v-model="newSite.type"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="type"
            type="text"
            placeholder="Type (e.g., commercial, residential)"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="contactPhone"
            >Contact Phone</label
          >
          <input
            v-model="newSite.contactPhone"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="contactPhone"
            type="tel"
            placeholder="Contact Phone Number"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="status"
            >Status</label
          >
          <select
            v-model="newSite.status"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
          >
            <option :value="null" disabled>Select status</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="capacity"
            >Capacity</label
          >
          <input
            v-model.number="newSite.capacity"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="capacity"
            type="number"
            placeholder="Capacity"
          />
        </div>

        <div class="mb-4">{{ modalMessage }}</div>
        <div class="flex justify-between align-center mb-4 col-span-2">
          <button
            class="bg-grey-500 text-white py-2 px-4 rounded"
            @click.prevent="showModal = false"
          >
            Close
          </button>
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
            Add
          </button>
        </div>
      </form>
    </Modal>

    <!-- Edit Site Modal -->
    <Modal :show="showEditModal" @close="showEditModal = false">
      <h2 class="text-xl font-semibold mb-4">Edit Site</h2>
      <form
        @submit.prevent="updateSiteHandler"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-name"
            >Name</label
          >
          <input
            v-model="editSite.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-name"
            type="text"
            placeholder="Name"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-description"
            >Description</label
          >
          <textarea
            v-model="editSite.description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-description"
            placeholder="Optional description of the site"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-coordinates"
            >Coordinates</label
          >
          <input
            v-model="editSite.coordinates"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-coordinates"
            type="text"
            placeholder="lat,lng (e.g., 34.0522,-118.2437)"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-address"
            >Address</label
          >
          <input
            v-model="editSite.address"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-address"
            type="text"
            placeholder="Street Address"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-city"
            >City</label
          >
          <input
            v-model="editSite.city"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-city"
            type="text"
            placeholder="City"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-province"
            >Province/Region</label
          >
          <input
            v-model="editSite.province"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-province"
            type="text"
            placeholder="Province/Region"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-country"
            >Country</label
          >
          <input
            v-model="editSite.country"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-country"
            type="text"
            placeholder="Country"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-type"
            >Type</label
          >
          <input
            v-model="editSite.type"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-type"
            type="text"
            placeholder="Type (e.g., commercial, residential)"
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="edit-contactPhone"
            >Contact Phone</label
          >
          <input
            v-model="editSite.contactPhone"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-contactPhone"
            type="tel"
            placeholder="Contact Phone Number"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-status"
            >Status</label
          >
          <select
            v-model="editSite.status"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-status"
          >
            <option :value="null" disabled>Select status</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-capacity"
            >Capacity</label
          >
          <input
            v-model.number="editSite.capacity"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="edit-capacity"
            type="number"
            placeholder="Capacity"
          />
        </div>

        <div class="mb-4 col-span-2">{{ modalMessage }}</div>
        <div class="flex justify-between align-center mb-4 col-span-2">
          <button
            class="bg-grey-500 text-white py-2 px-4 rounded"
            @click.prevent="showEditModal = false"
          >
            Close
          </button>
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">
            Update
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Site Modal -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <h2 class="text-xl font-semibold mb-4">Delete Site</h2>
      <p>Are you sure you want to delete {{ deleteSite.name }}?</p>
      <div class="flex justify-end space-x-4">
        <button
          @click="deleteSiteConfirmed"
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
          <h5 class="text-sm font-medium uppercase xsm:text-base">City</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Type</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Contact</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Capacity</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Active</h5>
        </div>
      </div>

      <div
        v-for="(site, key) in sites"
        :key="site.id"
        :class="`grid grid-cols-3 sm:grid-cols-7 ${
          key === sites.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
        }`"
      >
        <div class="flex items-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ site.name }}</p>
        </div>
        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ site.city }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ site.type }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ site.contactPhone }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ site.capacity }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ site.status ? "Yes" : "No" }}</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5 space-x-4">
          <div
            class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            @click="editSiteAction(site)"
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
            @click="confirmDeleteSite(site)"
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
import { useSitesStore } from "@/stores/sites";
import Modal from "@/ui/components/Modals/FormModal.vue";

const showModal = ref(false); // For "Add Site" modal
const showEditModal = ref(false); // For "Edit Site" modal
const showDeleteModal = ref(false); // For "Delete Site" confirmation modal
const modalMessage = ref(""); // Message displayed in modals
const sitesStore = useSitesStore();
const sites = ref([]); // List of sites

// Fields for the "Add Site" form
const newSite = ref({
  name: "",
  description: "",
  coordinates: "",
  address: "",
  city: "",
  province: "",
  country: "",
  type: "",
  contactPhone: "",
  status: null,
  capacity: null,
});

// Fields for the "Edit Site" form
const editSite = ref({});

// Site to be deleted
const deleteSite = ref({});

// Fetch sites initially
const fetchSites = async () => {
  try {
    await sitesStore.fetchSites();
    sites.value = sitesStore.sites;
  } catch (err) {
    console.error("Error fetching sites:", err);
  }
};

// Add a new site
const addSiteHandler = async () => {
  try {
    const response = await sitesStore.addSite(newSite.value);
    if (response === "success") {
      showModal.value = false;
      resetFormFields();
      fetchSites(); // Refresh sites list
    } else {
      modalMessage.value = "Failed to add site.";
    }
  } catch (err) {
    modalMessage.value = err.response?.data?.message || err.message;
  }
};

// Open edit modal with site data
const editSiteAction = (site) => {
  editSite.value = { ...site };
  showEditModal.value = true;
};

// Update site
const updateSiteHandler = async () => {
  try {
    const response = await sitesStore.updateSite(editSite.value);
    if (response === "success") {
      showEditModal.value = false;
      fetchSites(); // Refresh sites list
    } else {
      modalMessage.value = "Failed to update site.";
    }
  } catch (err) {
    modalMessage.value = err.response?.data?.message || err.message;
  }
};

// Confirm delete action
const confirmDeleteSite = (site) => {
  deleteSite.value = site;
  showDeleteModal.value = true;
};

// Delete site
const deleteSiteConfirmed = async () => {
  try {
    await sitesStore.deleteSite(deleteSite.value.id);
    showDeleteModal.value = false;
    fetchSites();
  } catch (err) {
    modalMessage.value = err.response?.data?.message || err.message;
  }
};

// Reset form fields
const resetFormFields = () => {
  newSite.value = {
    name: "",
    description: "",
    coordinates: "",
    address: "",
    city: "",
    province: "",
    country: "",
    type: "",
    contactPhone: "",
    status: "",
    capacity: null,
  };
  modalMessage.value = "";
};

onMounted(fetchSites);
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
