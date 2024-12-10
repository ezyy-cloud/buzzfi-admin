<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->

    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-10">
        <div class="container mx-auto p-4">
          <!-- Network Overview -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div
              v-for="stat in networkOverview"
              :key="stat.title"
              class="dark:bg-boxdark rounded-lg shadow p-4"
            >
              <h2 class="text-lg font-semibold mb-2">{{ stat.title }}</h2>
              <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
          </div>

          <!-- Client Statistics -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-8">
            <h2 class="text-xl font-semibold mb-4">Client Statistics</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr>
                    <th class="text-left">Device Name</th>
                    <th class="text-left">IP Address</th>
                    <th class="text-left">MAC Address</th>
                    <th class="text-left">Signal Strength</th>
                    <th class="text-left">Uptime</th>
                    <th class="text-left">Data Usage</th>
                    <th class="text-left">Connection Type</th>
                    <th class="text-left">Associated AP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="client in clientStatistics" :key="client.mac">
                    <td>{{ client.name }}</td>
                    <td>{{ client.ip }}</td>
                    <td>{{ client.mac }}</td>
                    <td>{{ client.signalStrength }} dBm</td>
                    <td>{{ client.uptime }}</td>
                    <td>{{ client.dataUsage }}</td>
                    <td>{{ client.connectionType }}</td>
                    <td>{{ client.associatedAP }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Access Point Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              v-for="ap in apStatistics"
              :key="ap.name"
              class="dark:bg-boxdark rounded-lg shadow p-4"
            >
              <h3 class="text-lg font-semibold mb-2">{{ ap.name }}</h3>
              <p>Uptime: {{ ap.uptime }}</p>
              <p>Connected Clients: {{ ap.connectedClients }}</p>
              <p>Total Throughput: {{ ap.totalThroughput }}</p>
              <p>Channel Utilization: {{ ap.channelUtilization }}%</p>
              <p>Signal Strength: {{ ap.signalStrength }} dBm</p>
              <p>TX/RX Rates: {{ ap.txRate }} / {{ ap.rxRate }} Mbps</p>
            </div>
          </div>

          <!-- Network Statistics -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-8">
            <h2 class="text-xl font-semibold mb-4">Network Statistics</h2>
            <apexchart
              type="area"
              height="350"
              :options="chartOptions.networkStats"
              :series="networkStatsSeries"
            ></apexchart>
          </div>

          <!-- WiFi Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">SSID Data Usage</h2>
              <apexchart
                type="pie"
                height="350"
                :options="chartOptions.ssidUsage"
                :series="ssidUsageSeries"
              ></apexchart>
            </div>
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">Channel Distribution</h2>
              <apexchart
                type="bar"
                height="350"
                :options="chartOptions.channelDistribution"
                :series="channelDistributionSeries"
              ></apexchart>
            </div>
          </div>

          <!-- Switch Statistics -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-8">
            <h2 class="text-xl font-semibold mb-4">Switch Port Status</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="port in switchPorts"
                :key="port.number"
                class="p-2 border rounded"
              >
                <p class="font-semibold">Port {{ port.number }}</p>
                <p>
                  Status:
                  <span
                    :class="port.status === 'Up' ? 'text-green-600' : 'text-red-600'"
                    >{{ port.status }}</span
                  >
                </p>
                <p>Throughput: {{ port.throughput }}</p>
                <p>PoE: {{ port.poe }}</p>
              </div>
            </div>
          </div>

          <!-- Router/Gateway Statistics -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-8">
            <h2 class="text-xl font-semibold mb-4">Router/Gateway Statistics</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>WAN IP: {{ routerStats.wanIp }}</p>
                <p>WAN Status: {{ routerStats.wanStatus }}</p>
                <p>WAN Throughput: {{ routerStats.wanThroughput }}</p>
              </div>
              <div>
                <h3 class="font-semibold mb-2">Firewall Activity</h3>
                <p>Allowed Connections: {{ routerStats.firewallAllowed }}</p>
                <p>Blocked Connections: {{ routerStats.firewallBlocked }}</p>
              </div>
            </div>
          </div>

          <!-- Network Health -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4">
            <h2 class="text-xl font-semibold mb-4">Network Health</h2>
            <div
              v-for="alert in networkHealth.alerts"
              :key="alert.id"
              class="mb-2 p-2 rounded"
              :class="alertClass(alert.severity)"
            >
              {{ alert.message }}
            </div>
            <div class="mt-4">
              <h3 class="font-semibold mb-2">System Resource Usage</h3>
              <p>CPU: {{ networkHealth.cpu }}%</p>
              <p>RAM: {{ networkHealth.ram }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import VueApexCharts from "vue3-apexcharts";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";

const pageTitle = ref("Network Dashboard");
// Mock data - replace with actual API calls

// Network Overview
const networkOverview = ref([
  { title: "Total Clients", value: 42 },
  { title: "Active APs", value: 5 },
  { title: "Total Throughput", value: "1.2 Gbps" },
  { title: "Avg. Latency", value: "12 ms" },
]);

// Client Statistics
const clientStatistics = ref([
  {
    name: "Device 1",
    ip: "192.168.1.100",
    mac: "00:11:22:33:44:55",
    signalStrength: -65,
    uptime: "2h 30m",
    dataUsage: "1.2 GB",
    connectionType: "WiFi",
    associatedAP: "AP-1",
  },
  {
    name: "Device 2",
    ip: "192.168.1.101",
    mac: "00:11:22:33:44:56",
    signalStrength: -72,
    uptime: "4h 15m",
    dataUsage: "3.5 GB",
    connectionType: "LAN",
    associatedAP: "N/A",
  },
  // Add more client data as needed
]);

// Access Point Statistics
const apStatistics = ref([
  {
    name: "AP-1",
    uptime: "5d 12h",
    connectedClients: 15,
    totalThroughput: "450 Mbps",
    channelUtilization: 65,
    signalStrength: -55,
    txRate: 780,
    rxRate: 650,
  },
  {
    name: "AP-2",
    uptime: "3d 8h",
    connectedClients: 8,
    totalThroughput: "280 Mbps",
    channelUtilization: 45,
    signalStrength: -58,
    txRate: 650,
    rxRate: 520,
  },
  // Add more AP data as needed
]);

// Network Statistics Chart
const networkStatsSeries = ref([
  { name: "Download", data: [30, 40, 35, 50, 49, 60, 70] },
  { name: "Upload", data: [20, 25, 30, 35, 30, 40, 45] },
]);

// SSID Usage Chart
const ssidUsageSeries = ref([300, 250, 200, 100]);

// Channel Distribution Chart
const channelDistributionSeries = ref([{ name: "Clients", data: [10, 15, 8, 12, 7, 5] }]);

// Switch Port Status
const switchPorts = ref([
  { number: 1, status: "Up", throughput: "100 Mbps", poe: "15.4W" },
  { number: 2, status: "Down", throughput: "0 Mbps", poe: "0W" },
  { number: 3, status: "Up", throughput: "1 Gbps", poe: "30W" },
  { number: 4, status: "Up", throughput: "10 Mbps", poe: "7.5W" },
  // Add more port data as needed
]);

// Router/Gateway Statistics
const routerStats = reactive({
  wanIp: "203.0.113.1",
  wanStatus: "Connected",
  wanThroughput: "950 Mbps",
  firewallAllowed: 15000,
  firewallBlocked: 500,
});

// Network Health
const networkHealth = reactive({
  alerts: [
    { id: 1, severity: "warning", message: "High CPU usage on AP-2" },
    { id: 2, severity: "error", message: "Switch port 2 is down" },
  ],
  cpu: 65,
  ram: 78,
});

// Chart Options
const chartOptions = reactive({
  networkStats: {
    chart: {
      type: "area",
      height: 350,
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "datetime",
      categories: [
        "2023-05-01T00:00:00.000Z",
        "2023-05-01T01:30:00.000Z",
        "2023-05-01T02:30:00.000Z",
        "2023-05-01T03:30:00.000Z",
        "2023-05-01T04:30:00.000Z",
        "2023-05-01T05:30:00.000Z",
        "2023-05-01T06:30:00.000Z",
      ],
    },
    tooltip: { x: { format: "dd/MM/yy HH:mm" } },
  },
  ssidUsage: {
    chart: { type: "pie" },
    labels: ["SSID-1", "SSID-2", "SSID-3", "SSID-4"],
    responsive: [
      {
        breakpoint: 480,
        options: { chart: { width: 200 }, legend: { position: "bottom" } },
      },
    ],
  },
  channelDistribution: {
    chart: { type: "bar" },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "55%", endingShape: "rounded" },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Channel 1",
        "Channel 6",
        "Channel 11",
        "Channel 36",
        "Channel 40",
        "Channel 44",
      ],
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " clients";
        },
      },
    },
  },
});

// Helper function for alert styling
const alertClass = (severity: string) => {
  return severity === "warning"
    ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800";
};

onMounted(() => {
  // Fetch data from UniFi API
  fetchData();
});

const fetchData = async () => {
  try {
    // Replace with actual API calls
    // const response = await fetch('/api/unifi')
    // const data = await response.json()
    // Update reactive data with fetched data
    // networkOverview.value = data.networkOverview
    // clientStatistics.value = data.clientStatistics
    // ...
  } catch (error) {
    console.error("Error fetching UniFi data:", error);
  }
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
