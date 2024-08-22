<script setup lang="ts">
import { ref } from 'vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import Agents from '@/components/Tables/Agents.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const pageTitle = ref('Voucher Agents')
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <Agents />
    </div>
  </DefaultLayout>
</template>
