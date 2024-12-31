<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import DashboardStats from "@/ui/components/DataStats/DashboardStats.vue";
import VoucherSales from "@/ui/components/Charts/VoucherSales.vue";
import ClientAnalytics from "@/ui/components/Charts/ClientAnalytics.vue";
import UplinkWordCloud from "@/ui/components/Charts/UplinkWordCloud.vue";
import VendorSales from "@/ui/components/Charts/VendorSales.vue";
import VendorRevenue from "@/ui/components/VendorRevenue.vue";
import SiteMetrics from "@/ui/components/Tables/SiteMetrics.vue";
import SiteLocations from "@/ui/components/Maps/SiteLocations.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import { useSalesStore } from '@/stores/voucherSales';

const salesStore = useSalesStore();

onMounted(() => {
  // Initial data fetch
  salesStore.fetchTransactions();
  
  // Start polling every 5 seconds
  salesStore.startPolling(5000);
});

onUnmounted(() => {
  // Clean up polling when component is unmounted
  salesStore.stopPolling();
});
</script>

<template>
  <DefaultLayout>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"
    >
      <DashboardStats />
    </div>

    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
      <!-- ====== Voucher Sales Start -->
      <VoucherSales />
      <!-- ====== Voucher Sales End -->

      <!-- ====== Vendor Sales Start -->
      <VendorSales />
      <!-- ====== Vendor Sales End -->

      <!-- ====== Client Analytics Start -->
      <ClientAnalytics />
      <!-- ====== Client Analytics End -->

      <!-- ====== Access Point Locations Start -->
      <SiteLocations />
      <!-- ====== Access Point Locations End -->

      <!-- ====== Uplink Word Cloud Start -->
      <UplinkWordCloud />
      <!-- ====== Uplink Word Cloud End -->

      <!-- ====== Site Metrics Start -->
      <div class="col-span-12 xl:col-span-8">
        <SiteMetrics />
      </div>
      <!-- ====== Site Metrics End -->

      <!-- ====== Vendor Revenue Start -->
      <VendorRevenue />
      <!-- ====== Vendor Revenue End -->
    </div>
  </DefaultLayout>
</template>
