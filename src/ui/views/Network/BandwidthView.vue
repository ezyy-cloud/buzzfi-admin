<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import BandwidthView from "@/ui/components/Charts/Bandwidth.vue";

const pageTitle = ref("Bandwidth");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10"><BandwidthView /></div>
  </DefaultLayout>
</template>

<style lang="scss" scoped></style>
