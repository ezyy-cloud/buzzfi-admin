<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useNetworkStore } from "@/stores/networkStats";
import type { UnifiClient } from "@/types/network";
import vuewordcloud from "vuewordcloud";

const networkStore = useNetworkStore();
const loading = ref(true);

// Process clients by last_uplink_name
const words = computed<[string, number][]>(() => {
  const stats = new Map<string, number>();
  
  networkStore.clients.forEach((client: UnifiClient) => {
    if (client.last_uplink_name && client.last_uplink_name !== 'Unknown') {
      stats.set(client.last_uplink_name, (stats.get(client.last_uplink_name) || 0) + 1);
    }
  });

  // Convert to array format required by word cloud
  return Array.from(stats.entries())
    .map(([name, count]): [string, number] => [name, count])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30); // Show top 30 uplinks
});

const cloudStyles = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  color: '#4318FF',
  rotation: {
    from: -60,
    to: 60
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    await networkStore.fetchClients();
    console.log('Word Cloud Data:', words.value);
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-xl font-bold text-black dark:text-white">Client Distribution by Uplink</h4>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center min-h-[500px]">
      <div class="text-meta-1">Loading...</div>
    </div>
    
    <template v-else>
      <div class="min-h-[500px] relative">
        <vuewordcloud
          :words="words"
          :color="cloudStyles.color"
          :font-family="cloudStyles.fontFamily"
          :font-weight="cloudStyles.fontWeight"
          :rotation="cloudStyles.rotation"
          :spacing="2"
          font-size-ratio="4"
          class="word-cloud"
        />
      </div>

      <div class="mt-4 text-sm text-meta-2 text-center">
        * Size represents number of clients connected to each uplink
      </div>
    </template>
  </div>
</template>

<style scoped>
.word-cloud {
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100% !important;
  height: 100% !important;
}
</style>
