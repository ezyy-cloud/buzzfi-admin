<script setup lang="ts">
import DashboardStats from "@/ui/components/DataStats/DashboardStats.vue";
import VoucherSales from "@/ui/components/Charts/VoucherSales.vue";
import ClientAnalytics from "@/ui/components/Charts/ClientAnalytics.vue";
import VendorSales from "@/ui/components/Charts/VendorSales.vue";
import VendorRevenue from "@/ui/components/VendorRevenue.vue";
import SiteMetrics from "@/ui/components/Tables/SiteMetrics.vue";
import AccessPointLocations from "@/ui/components/Maps/AccessPointLocations.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
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
      <AccessPointLocations />
      <!-- ====== Access Point Locations End -->

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
