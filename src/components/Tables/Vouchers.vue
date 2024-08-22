<template>
  <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <div class="header-container">
      <h4 class="header-title">All Vouchers</h4>
      <div class="header-action">
        <button class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white" @click.prevent="showModal = true">
          <svg class="fill-current duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Add Voucher Modal -->
    <Modal :show="showModal" @close="showModal = false">
      <h2 class="text-xl font-semibold mb-4">Add New Voucher</h2>
      <form @submit.prevent="addVoucherHandler">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
          <input v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">Price ($)</label>
          <input v-model="price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="price" type="number" step="0.01" placeholder="Price" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="validity">Validity (days)</label>
          <input v-model="validity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="validity" type="number" placeholder="Validity" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="quota">Quota (GB)</label>
          <input v-model="quota" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="quota" type="number" placeholder="Quota" required>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Add</button>
        </div>
      </form>
    </Modal>

    <!-- Edit Voucher Modal -->
    <Modal :show="showEditModal" @close="showEditModal = false">
      <h2 class="text-xl font-semibold mb-4">Edit Voucher</h2>
      <form @submit.prevent="updateVoucherHandler">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-name">Name</label>
          <input v-model="editVoucher.name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="edit-name" type="text" placeholder="Name" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-price">Price ($)</label>
          <input v-model="editVoucher.price" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="edit-price" type="number" step="0.01" placeholder="Price" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-validity">Validity (days)</label>
          <input v-model="editVoucher.validity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="edit-validity" type="number" placeholder="Validity" required>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="edit-quota">Quota (GB)</label>
          <input v-model="editVoucher.quota" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="edit-quota" type="number" placeholder="Quota" required>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded">Update</button>
        </div>
      </form>
    </Modal>

    <!-- Delete Voucher Modal -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false">
      <h2 class="text-xl font-semibold mb-4">Delete Voucher</h2>
      <p>Are you sure you want to delete {{ deleteVoucher.name }}?</p>
      <div class="flex justify-end space-x-4">
        <button @click="deleteVoucherConfirmed" class="bg-red-500 text-white py-2 px-4 rounded">Delete</button>
        <button @click="showDeleteModal = false" class="bg-gray-500 text-white py-2 px-4 rounded">Cancel</button>
      </div>
    </Modal>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-if="error" class="text-center text-red-500">
      <p>Error: {{ error }}</p>
    </div>
    <div v-if="!loading && !error" class="flex flex-col">
      <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
        <div class="p-2.5 xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Name</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Price</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Validity</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Quota</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Manage</h5>
        </div>
      </div>

      <div v-for="(voucher, key) in vouchers" :key="voucher.id" :class="`grid grid-cols-3 sm:grid-cols-5 ${key === vouchers.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`">
        <div class="flex items-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ voucher.name }}</p>
        </div>
        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">${{ voucher.price }}</p>
        </div>
        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ voucher.validity }} days</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ voucher.quota }} GB</p>
        </div>
        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5 space-x-4">
          <div class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white" @click="editVoucherHandler(voucher)">
            <svg class="fill-current duration-300 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 50 50">
              <path
                d="M 43.050781 1.9746094 C 41.800781 1.9746094 40.549609 2.4503906 39.599609 3.4003906 L 38.800781 4.1992188 L 45.699219 11.099609 L 46.5 10.300781 C 48.4 8.4007812 48.4 5.3003906 46.5 3.4003906 C 45.55 2.4503906 44.300781 1.9746094 43.050781 1.9746094 z M 37.482422 6.0898438 A 1.0001 1.0001 0 0 0 36.794922 6.3925781 L 4.2949219 38.791016 A 1.0001 1.0001 0 0 0 4.0332031 39.242188 L 2.0332031 46.742188 A 1.0001 1.0001 0 0 0 3.2578125 47.966797 L 10.757812 45.966797 A 1.0001 1.0001 0 0 0 11.208984 45.705078 L 43.607422 13.205078 A 1.0001 1.0001 0 1 0 42.191406 11.794922 L 9.9921875 44.09375 L 5.90625 40.007812 L 38.205078 7.8085938 A 1.0001 1.0001 0 0 0 37.482422 6.0898438 z">
              </path>
            </svg>
          </div>
          <div class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white" @click="deleteVoucherHandler(voucher)">
            <svg class="fill-current duration-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
              viewBox="0 0 32 32">
              <path
                d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useVouchersStore } from '@/stores/vouchers';
import Modal from '@/components/Modals/FormModal.vue';

const showModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const loading = ref(false);
const error = ref(null);

const voucherStore = useVouchersStore();

const name = ref('');
const price = ref(0);
const validity = ref(0);
const quota = ref(0);
const editVoucher = ref({});
const deleteVoucher = ref({});
const vouchers = ref([]);

const fetchVouchers = async () => {
  loading.value = true;
  error.value = null;
  try {
    await voucherStore.fetchVouchers();
    vouchers.value = voucherStore.vouchers;
  } catch (err) {
    error.value = 'Failed to fetch vouchers. Please try again.';
  } finally {
    loading.value = false;
  }
};

const addVoucherHandler = async () => {
  const newVoucher = {
    name: name.value,
    price: price.value,
    validity: validity.value,
    quota: quota.value,
  };
  try {
    await voucherStore.addVoucher(newVoucher);
    fetchVouchers();
    showModal.value = false;
    name.value = '';
    price.value = 0;
    validity.value = 0;
    quota.value = 0;
  } catch (err) {
    error.value = err.message;
  }
};

const editVoucherHandler = (voucher) => {
  editVoucher.value = { ...voucher };
  showEditModal.value = true;
};

const updateVoucherHandler = async () => {
  try {
    await voucherStore.updateVoucher(editVoucher.value.id, editVoucher.value);
    fetchVouchers();
    showEditModal.value = false;
    editVoucher.value = {};
  } catch (err) {
    error.value = 'Failed to update voucher. Please try again.';
  }
};

const deleteVoucherHandler = (voucher) => {
  deleteVoucher.value = { ...voucher };
  showDeleteModal.value = true;
};

const deleteVoucherConfirmed = async () => {
  try {
    await voucherStore.deleteVoucher(deleteVoucher.value.id);
    fetchVouchers();
    showDeleteModal.value = false;
    deleteVoucher.value = {};
  } catch (err) {
    error.value = 'Failed to delete voucher. Please try again.';
  }
};

onMounted(fetchVouchers);
</script>



<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .625rem;
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