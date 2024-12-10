<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import AccessPointsTable from "@/ui/components/Tables/AccessPoints.vue";

const pageTitle = ref("Access Points");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10"><AccessPointsTable /></div>
  </DefaultLayout>
</template>

<style lang="scss" scoped></style>
