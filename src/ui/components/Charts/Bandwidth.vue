<template>
  <div class="bandwidth-dashboard">
    <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10 my-10">
      <h2 class="text-white">Gateway Bandwidth Usage</h2>
      <apexchart
        type="area"
        height="350"
        :options="chartOptions.gateway"
        :series="series.gateway"
      ></apexchart>
    </div>

    <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10 my-10">
      <h2 class="text-white">SSID Bandwidth Distribution</h2>
      <apexchart
        type="pie"
        height="350"
        :options="chartOptions.ssid"
        :series="series.ssid"
      ></apexchart>
    </div>

    <div class="chart-grid">
      <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10">
        <h2>Top Clients Bandwidth Usage</h2>
        <apexchart
          type="bar"
          height="350"
          :options="chartOptions.clients"
          :series="series.clients"
        ></apexchart>
      </div>
      <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10">
        <h2>DPI Application Bandwidth Usage</h2>
        <apexchart
          type="treemap"
          height="350"
          :options="chartOptions.dpi"
          :series="series.dpi"
        ></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "BandwidthDashboard",
  components: {
    apexchart: VueApexCharts,
  },
  setup() {
    const chartOptions = ref({
      gateway: {
        chart: {
          id: "gateway-bandwidth",
          type: "area",
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "Bandwidth (Mbps)",
          },
        },
        colors: ["#008FFB", "#00E396"],
      },
      clients: {
        chart: {
          id: "client-bandwidth",
          type: "bar",
          stacked: true,
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: [],
        },
        yaxis: {
          title: {
            text: "Bandwidth (MB)",
          },
        },
        colors: ["#008FFB", "#00E396"],
      },
      ssid: {
        chart: {
          id: "ssid-bandwidth",
          type: "pie",
        },
        dataLabels: { enabled: false },
        labels: [],
        colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
      },
      dpi: {
        chart: {
          id: "dpi-bandwidth",
          type: "treemap",
        },
        colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"],
      },
    });

    const series = ref({
      gateway: [
        {
          name: "Download",
          data: [],
        },
        {
          name: "Upload",
          data: [],
        },
      ],
      clients: [
        {
          name: "Download",
          data: [],
        },
        {
          name: "Upload",
          data: [],
        },
      ],
      ssid: [],
      dpi: [
        {
          data: [],
        },
      ],
    });

    const fetchData = () => {
      // Mock data for Gateway Bandwidth Usage
      const gatewayData = Array.from({ length: 24 }, (_, i) => ({
        time: new Date(2023, 0, 1, i, 0, 0).getTime() / 1000,
        wan_rx_kbps: Math.floor(Math.random() * 500000) + 100000, // Random value between 100-600 Mbps
        wan_tx_kbps: Math.floor(Math.random() * 200000) + 50000, // Random value between 50-250 Mbps
      }));

      chartOptions.value.gateway.xaxis.categories = gatewayData.map((d) =>
        new Date(d.time * 1000).toLocaleTimeString()
      );
      series.value.gateway[0].data = gatewayData.map(
        (d) => +(d.wan_rx_kbps / 1000).toFixed(2)
      ); // Convert to Mbps
      series.value.gateway[1].data = gatewayData.map(
        (d) => +(d.wan_tx_kbps / 1000).toFixed(2)
      ); // Convert to Mbps

      // Mock data for Top Clients Bandwidth Usage
      const clientsData = [
        { hostname: "Laptop-1", rx_bytes: 1500000000, tx_bytes: 500000000 },
        { hostname: "Phone-1", rx_bytes: 800000000, tx_bytes: 200000000 },
        { hostname: "SmartTV", rx_bytes: 2000000000, tx_bytes: 100000000 },
        { hostname: "Tablet", rx_bytes: 500000000, tx_bytes: 150000000 },
        { hostname: "Desktop-1", rx_bytes: 1000000000, tx_bytes: 300000000 },
      ];

      chartOptions.value.clients.xaxis.categories = clientsData.map((c) => c.hostname);
      series.value.clients[0].data = clientsData.map(
        (c) => +(c.rx_bytes / (1024 * 1024)).toFixed(2)
      ); // Convert to MB
      series.value.clients[1].data = clientsData.map(
        (c) => +(c.tx_bytes / (1024 * 1024)).toFixed(2)
      ); // Convert to MB

      // Mock data for SSID Bandwidth Distribution
      const ssidData = [
        { essid: "Main-2.4GHz", rx_bytes: 5000000000, tx_bytes: 2000000000 },
        { essid: "Main-5GHz", rx_bytes: 10000000000, tx_bytes: 5000000000 },
        { essid: "Guest", rx_bytes: 2000000000, tx_bytes: 500000000 },
        { essid: "IoT", rx_bytes: 1000000000, tx_bytes: 200000000 },
      ];

      chartOptions.value.ssid.labels = ssidData.map((s) => s.essid);
      series.value.ssid = ssidData.map(
        (s) => +((s.rx_bytes + s.tx_bytes) / (1024 * 1024 * 1024)).toFixed(2)
      ); // Convert to GB

      // Mock data for DPI Application Bandwidth Usage
      const dpiData = [
        { category: "Streaming", rx_bytes: 15000000000, tx_bytes: 1000000000 },
        { category: "Web Browsing", rx_bytes: 5000000000, tx_bytes: 1000000000 },
        { category: "Social Media", rx_bytes: 3000000000, tx_bytes: 500000000 },
        { category: "File Transfer", rx_bytes: 2000000000, tx_bytes: 8000000000 },
        { category: "Gaming", rx_bytes: 1000000000, tx_bytes: 500000000 },
      ];

      series.value.dpi[0].data = dpiData.map((d) => ({
        x: d.category,
        y: +((d.rx_bytes + d.tx_bytes) / (1024 * 1024 * 1024)).toFixed(2), // Convert to GB
      }));
    };

    onMounted(() => {
      fetchData();
      // Refresh mock data every 5 minutes
      setInterval(fetchData, 5 * 60 * 1000);
    });

    return {
      chartOptions,
      series,
    };
  },
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
