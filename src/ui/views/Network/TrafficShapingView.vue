<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import TrafficShapingView from "@/ui/components/Tables/TrafficShapes.vue";

const pageTitle = ref("Traffic Shapes");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10"><TrafficShapingView /></div>
  </DefaultLayout>
</template>

<style lang="scss" scoped></style>
