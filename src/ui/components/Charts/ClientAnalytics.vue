<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useNetworkStore } from "@/stores/networkStats";
import type { UnifiClient } from "@/types/network";
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";

const networkStore = useNetworkStore();
const loading = ref(true);

// Process clients by OUI
const chartData = computed(() => {
  const stats = new Map<string, number>();
  let totalKnownClients = 0;
  
  // Only count clients with known OUIs
  networkStore.clients.forEach((client: UnifiClient) => {
    if (client.oui && client.oui !== 'Unknown') {
      stats.set(client.oui, (stats.get(client.oui) || 0) + 1);
      totalKnownClients++;
    }
  });

  // Convert to arrays for ApexCharts
  const sortedData = Array.from(stats.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4); // Take top 4 for better visibility

  return {
    series: sortedData.map(([_, count]) => count),
    labels: sortedData.map(([oui, _]) => oui),
    percentages: sortedData.map(([_, count]) => 
      ((count / totalKnownClients) * 100).toFixed(1)
    )
  };
});

const apexOptions = computed(() => ({
  chart: {
    type: "donut",
    width: 380,
  },
  colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
  labels: chartData.value.labels,
  legend: {
    show: false,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
}));

const fetchData = async () => {
  loading.value = true;
  try {
    await networkStore.fetchClients();
    console.log('Clients with OUI:', networkStore.clients.map((client: UnifiClient) => ({
      _id: client._id,
      oui: client.oui,
      name: client.name
    })));
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
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5"
  >
    <div class="mb-3 justify-between gap-4 sm:flex">
      <div>
        <h4 class="text-xl font-bold text-black dark:text-white">Client OUI Distribution</h4>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-meta-1">Loading...</div>
    </div>
    
    <template v-else>
      <div class="mb-2">
        <div id="chartThree" class="mx-auto flex justify-center">
          <VueApexCharts
            type="donut"
            width="340"
            :options="apexOptions"
            :series="chartData.series"
          />
        </div>
      </div>
      <div class="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div
          v-for="(label, index) in chartData.labels"
          :key="label"
          class="w-full px-8 sm:w-1/2"
        >
          <div class="flex w-full items-center">
            <span
              class="mr-2 block h-3 w-full max-w-3 rounded-full"
              :class="{
                'bg-primary': index === 0,
                'bg-[#6577F3]': index === 1,
                'bg-[#8FD0EF]': index === 2,
                'bg-[#0FADCF]': index === 3,
              }"
            ></span>
            <p class="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>{{ label }}</span>
              <span>{{ chartData.percentages[index] }}%</span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
