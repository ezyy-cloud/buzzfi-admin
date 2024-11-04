<script setup lang="ts">
import { ref } from "vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import Sites from "@/ui/components/Tables/Sites.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";

const pageTitle = ref("BuzzFi Sites");
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <Sites />
    </div>
  </DefaultLayout>
</template>
