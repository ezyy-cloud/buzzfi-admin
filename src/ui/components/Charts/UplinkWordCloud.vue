<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useNetworkStore } from "@/stores/networkStats";
import vuewordcloud from "vuewordcloud";

const networkStore = useNetworkStore();
const loading = ref(true);

// Process clients by last_uplink_name
const words = computed(() => {
  const stats = new Map();
  
  networkStore.clients.forEach(client => {
    if (client.last_uplink_name && client.last_uplink_name !== 'Unknown') {
      stats.set(client.last_uplink_name, (stats.get(client.last_uplink_name) || 0) + 1);
    }
  });

  // Convert to array format required by word cloud
  return Array.from(stats.entries())
    .map(([name, count]) => [name, count.toString()])
    .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
    .slice(0, 30); // Show top 30 uplinks
});

const cloudStyles = {
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  color: function(word: String, weight: number) {
    return weight > 8 ? '#3C50E0' : 
           weight > 6 ? '#6577F3' : 
           weight > 4 ? '#8FD0EF' : 
           weight > 2 ? '#0FADCF' : '#10B981';
  },
  rotation: function() {
    return ~~(Math.random() * 2) * 90;
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
