<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSalesStore } from '@/stores/voucherSales';
import moment from 'moment';

// Initialize sales store
const salesStore = useSalesStore();

// Reactive references for local component state
const transactions = computed(() => salesStore.transactions);
const loading = computed(() => salesStore.loading);
const error = computed(() => salesStore.error);

// Fetch transactions when the component is mounted
onMounted(() => {
  console.log('Fetching transactions on mount...');
  salesStore.fetchTransactions();
});

// Method to format the date
const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">All Transactions</h4>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-if="error" class="text-center text-red-500">
      <p>Error: {{ error }}</p>
    </div>
    <div v-if="!loading && !error" class="flex flex-col">
      <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Created</h5>
        </div>
        <div class="p-2.5 xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">User</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Quota</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Unit Price</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Quantity</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Total</h5>
        </div>
      </div>

      <div v-for="(transaction, key) in transactions" :key="transaction.id" :class="`grid grid-cols-3 sm:grid-cols-6 ${key === transactions.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
        }`">

        <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
          <p class="text-black dark:text-white">{{ formatDate(transaction.created_at) }}</p>
        </div>
        <div class="flex items-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ transaction.user_name }}</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ transaction.quota }}GB</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">${{ transaction.price }}</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">{{ JSON.parse(transaction.voucher_codes).length }}</p>
        </div>

        <div class="flex items-center justify-center p-2.5 xl:p-5">
          <p class="text-black dark:text-white">${{ JSON.parse(transaction.voucher_codes).length * transaction.price }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
