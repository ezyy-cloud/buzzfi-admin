<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import SupportTicket from "@/ui/components/Tables/SupportTicket.vue";

const pageTitle = ref("Support Tickets");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10"><SupportTicket /></div>
  </DefaultLayout>
</template>

<style lang="scss" scoped></style>
