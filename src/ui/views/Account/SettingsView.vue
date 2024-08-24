<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import SettingsCard from "@/ui/components/SettingsCard.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";

const pageTitle = ref("Settings Page");
</script>

<template>
  <DefaultLayout>
    <div class="mx-auto max-w-270">
      <!-- Breadcrumb Start -->
      <BreadcrumbDefault :pageTitle="pageTitle" />
      <!-- Breadcrumb End -->
      <SettingsCard />
    </div>
  </DefaultLayout>
</template>
