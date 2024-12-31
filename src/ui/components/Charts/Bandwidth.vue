<template>
  <div class="grid grid-cols-1 gap-4">
    <div class="bg-white dark:bg-boxdark rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">Top Clients Bandwidth Usage</h3>
      <VueApexCharts
        :options="chartOptions.clients"
        :series="series.clients"
        height="350"
      />
    </div>
    <div class="bg-white dark:bg-boxdark rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">SSID Bandwidth Distribution</h3>
      <VueApexCharts
        :options="chartOptions.ssid"
        :series="series.ssid"
        height="350"
      />
    </div>
    <div class="bg-white dark:bg-boxdark rounded-lg shadow p-4">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">DPI Application Usage</h3>
      <VueApexCharts
        :options="chartOptions.dpi"
        :series="series.dpi"
        height="350"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useNetworkStore } from "@/stores/networkStats";

const networkStore = useNetworkStore();

// Get current theme
const isDarkMode = computed(() => document.documentElement.classList.contains('dark'));

// Common chart theme
const getChartTheme = computed(() => ({
  mode: isDarkMode.value ? 'dark' : 'light',
  palette: 'palette1',
  monochrome: {
    enabled: false,
    color: '#008FFB',
    shadeTo: isDarkMode.value ? 'dark' : 'light',
    shadeIntensity: 0.65
  }
}));

const chartOptions = ref({
  clients: {
    chart: {
      id: "client-bandwidth",
      type: "bar",
      stacked: true,
      foreColor: isDarkMode.value ? '#A3AED0' : '#333',
      background: 'transparent',
      theme: getChartTheme.value,
      toolbar: {
        show: false
      }
    },
    dataLabels: { 
      enabled: false
    },
    xaxis: {
      categories: [],
      labels: {
        show: true,
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: isDarkMode.value ? '#A3AED0' : '#333'
        }
      }
    },
    yaxis: {
      title: {
        text: "Bandwidth (MB)",
        style: {
          color: isDarkMode.value ? '#A3AED0' : '#333'
        }
      },
      labels: {
        show: true,
        style: {
          colors: isDarkMode.value ? '#A3AED0' : '#333'
        },
        formatter: function(val) {
          return val.toFixed(1);
        }
      }
    },
    colors: ["#008FFB", "#00E396"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      floating: false,
      fontSize: '14px',
      offsetY: 0,
      itemMargin: {
        horizontal: 10,
        vertical: 0
      },
      labels: {
        colors: isDarkMode.value ? '#A3AED0' : '#333'
      }
    },
    tooltip: {
      theme: isDarkMode.value ? 'dark' : 'light',
      y: {
        formatter: function(val) {
          return val.toFixed(1) + ' MB';
        }
      }
    }
  },
  ssid: {
    chart: {
      id: "ssid-distribution",
      type: "pie",
      foreColor: isDarkMode.value ? '#A3AED0' : '#333',
      background: 'transparent',
      theme: getChartTheme.value
    },
    labels: [],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 8,
      labels: {
        colors: isDarkMode.value ? '#A3AED0' : '#333'
      }
    },
    tooltip: {
      theme: isDarkMode.value ? 'dark' : 'light'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        }
      }
    }]
  },
  dpi: {
    chart: {
      id: "dpi-usage",
      type: "treemap",
      foreColor: isDarkMode.value ? '#A3AED0' : '#333',
      background: 'transparent',
      theme: getChartTheme.value
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: [isDarkMode.value ? '#fff' : '#000']
      },
      formatter: function(text, op) {
        return [text, op.value + ' GB']
      }
    },
    plotOptions: {
      treemap: {
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        distributed: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: isDarkMode.value ? '#008FFB' : '#008FFB'
            }
          ]
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      offsetY: -8,
      labels: {
        colors: isDarkMode.value ? '#A3AED0' : '#333'
      }
    },
    tooltip: {
      theme: isDarkMode.value ? 'dark' : 'light',
      y: {
        formatter: function(value) {
          return value + ' GB'
        }
      }
    }
  },
});

// Helper functions
const bytesToMbps = (bytes) => (bytes * 8) / (1024 * 1024);
const bytesToMB = (bytes) => bytes / (1024 * 1024);
const bytesToGB = (bytes) => bytes / (1024 * 1024 * 1024);

// Computed properties for chart data
const series = computed(() => ({
  clients: [
    {
      name: "Download",
      data: networkStore.clients
        .sort((a, b) => b.rx_bytes - a.rx_bytes)
        .slice(0, 10)
        .map(client => bytesToMB(client.rx_bytes).toFixed(2))
    },
    {
      name: "Upload",
      data: networkStore.clients
        .sort((a, b) => b.tx_bytes - a.tx_bytes)
        .slice(0, 10)
        .map(client => bytesToMB(client.tx_bytes).toFixed(2))
    }
  ],
  ssid: networkStore.clients
    .filter(client => !client.is_wired && client.essid)
    .reduce((acc, client) => {
      const ssid = client.essid;
      const usage = bytesToGB(client.rx_bytes + client.tx_bytes);
      
      const existingSSID = acc.find(item => item.name === ssid);
      if (existingSSID) {
        existingSSID.value += usage;
      } else {
        acc.push({ name: ssid, value: usage });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value)
    .map(item => parseFloat(item.value.toFixed(2))),
  dpi: [{
    data: networkStore.devices
      .map(device => ({
        x: device.name || device.mac,
        y: parseFloat(bytesToGB(device.rx_bytes + device.tx_bytes).toFixed(2))
      }))
      .sort((a, b) => b.y - a.y)
  }],
}));

// Update chart categories based on data
const updateChartCategories = () => {
  // Update client chart categories
  chartOptions.value.clients.xaxis.categories = networkStore.clients
    .sort((a, b) => b.rx_bytes - a.rx_bytes)
    .slice(0, 10)
    .map(client => client.hostname || client.mac);

  // Update SSID chart labels
  chartOptions.value.ssid.labels = networkStore.clients
    .filter(client => !client.is_wired && client.essid)
    .map(client => client.essid)
    .filter((value, index, self) => self.indexOf(value) === index);
};

// Watch for theme changes
watch(() => isDarkMode.value, (newValue) => {
  // Update chart themes
  const theme = {
    mode: newValue ? 'dark' : 'light',
    palette: 'palette1',
    monochrome: {
      enabled: false,
      color: '#008FFB',
      shadeTo: newValue ? 'dark' : 'light',
      shadeIntensity: 0.65
    }
  };

  // Update all charts
  ['clients', 'ssid', 'dpi'].forEach(chartId => {
    chartOptions.value[chartId].chart.foreColor = newValue ? '#A3AED0' : '#333';
    chartOptions.value[chartId].chart.theme = theme;
    chartOptions.value[chartId].tooltip.theme = newValue ? 'dark' : 'light';

    if (chartOptions.value[chartId].legend) {
      chartOptions.value[chartId].legend.labels.colors = newValue ? '#A3AED0' : '#333';
    }

    if (chartOptions.value[chartId].xaxis?.labels) {
      chartOptions.value[chartId].xaxis.labels.style.colors = newValue ? '#A3AED0' : '#333';
    }

    if (chartOptions.value[chartId].yaxis?.title) {
      chartOptions.value[chartId].yaxis.title.style.color = newValue ? '#A3AED0' : '#333';
    }

    if (chartOptions.value[chartId].yaxis?.labels) {
      chartOptions.value[chartId].yaxis.labels.style.colors = newValue ? '#A3AED0' : '#333';
    }
  });
}, { immediate: true });

// Watch for data changes
watch(() => networkStore.devices, updateChartCategories, { deep: true });
watch(() => networkStore.clients, updateChartCategories, { deep: true });

onMounted(async () => {
  await Promise.all([
    networkStore.fetchDevices(),
    networkStore.fetchClients()
  ]);
  updateChartCategories();
});
</script>

<style scoped>
.bandwidth-dashboard {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-container {
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
</style>
