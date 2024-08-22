<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/components/Breadcrumbs/BreadcrumbDefault.vue";
import SalesTable from "@/components/Tables/Sales.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const pageTitle = ref("Voucher Sales");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <SalesTable />
    </div>
  </DefaultLayout>
</template>
