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
              <p
                v-if="stat.trend"
                class="text-caption"
                :class="stat.trend >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ stat.trend >= 0 ? "+" : "" }}{{ stat.trend }}% from last hour
              </p>
            </div>
          </div>

          <!-- Client Statistics -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold">Client Statistics</h2>
              <div class="text-sm text-gray-500">
                Total Clients: {{ clientStatistics.length }}
              </div>
            </div>
            <div class="overflow-x-auto">
              <div class="max-h-[600px] overflow-y-auto">
                <table class="min-w-full">
                  <thead class="sticky top-0 bg-white dark:bg-boxdark z-10">
                    <tr class="border-b dark:border-gray-700">
                      <th class="text-left py-3 px-4">Device Name</th>
                      <th class="text-left py-3 px-4">IP Address</th>
                      <th class="text-left py-3 px-4">Satisfaction</th>
                      <th class="text-left py-3 px-4">Uptime</th>
                      <th class="text-left py-3 px-4">Data Usage</th>
                      <th class="text-left py-3 px-4">Connection Type</th>
                      <th class="text-left py-3 px-4">Associated AP</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y dark:divide-gray-700">
                    <tr
                      v-for="client in clientStatistics"
                      :key="client.name"
                      class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td class="py-2 px-4">{{ client.name }}</td>
                      <td class="py-2 px-4">{{ client.ip }}</td>
                      <td class="py-2 px-4">
                        <span :class="getHealthColor(parseInt(client.satisfaction).toString())">
                          {{ client.satisfaction }}
                        </span>
                      </td>
                      <td class="py-2 px-4">{{ client.uptime }}</td>
                      <td class="py-2 px-4">{{ client.dataUsage }}</td>
                      <td class="py-2 px-4">
                        <span
                          :class="
                            client.connectionType.includes('Wireless')
                              ? 'text-blue-500'
                              : 'text-gray-500'
                          "
                        >
                          {{ client.connectionType }}
                        </span>
                      </td>
                      <td class="py-2 px-4">{{ client.associatedAP }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Access Point Statistics -->
          <div
            class="bg-white dark:bg-boxdark rounded-lg shadow-lg dark:shadow-gray-900 p-4 mb-8"
          >
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Device Statistics
              </h2>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Total Devices: {{ apStatistics.length }}
              </div>
            </div>

            <div class="relative overflow-hidden rounded-lg bg-boxdark">
              <TransitionGroup name="slide" tag="div">
                <div
                  v-for="(ap, index) in apStatistics"
                  :key="ap.name"
                  v-show="index === currentSlide"
                  class="transition-transform duration-500"
                >
                  <div class="bg-boxdark rounded-lg shadow-lg dark:shadow-gray-900 p-6">
                    <!-- Header Section -->
                    <div class="mb-6">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div
                            class="text-lg font-semibold text-gray-800 dark:text-gray-100"
                          >
                            {{ ap.name }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ ap.mac }}
                          </div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span
                            :class="
                              ap.uptime
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                            "
                            class="px-3 py-1 rounded-full text-sm font-medium"
                          >
                            <i class="fas fa-circle text-xs mr-1"></i>
                            {{ ap.uptime ? "Online" : "Offline" }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Main Content Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <!-- Left Column - System Stats -->
                      <div class="space-y-6">
                        <!-- System Stats Card -->
                        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                          <h3
                            class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4"
                          >
                            System Stats
                          </h3>
                          <div class="space-y-4">
                            <!-- CPU -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400"
                                  >CPU</span
                                >
                                <span
                                  class="text-xs font-medium text-gray-700 dark:text-gray-300"
                                  >{{ ap.system_stats?.cpu || "0" }}%</span
                                >
                              </div>
                              <div
                                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                              >
                                <div
                                  class="h-1.5 rounded-full transition-all duration-300"
                                  :class="
                                    getCPUColor(parseInt(ap.system_stats?.cpu || '0').toString())
                                  "
                                  :style="{
                                    width: (ap.system_stats?.cpu || '0') + '%',
                                  }"
                                ></div>
                              </div>
                            </div>
                            <!-- Memory -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400"
                                  >Memory</span
                                >
                                <span
                                  class="text-xs font-medium text-gray-700 dark:text-gray-300"
                                  >{{ ap.system_stats?.mem || "0" }}%</span
                                >
                              </div>
                              <div
                                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                              >
                                <div
                                  class="h-1.5 rounded-full transition-all duration-300"
                                  :class="
                                    getMemoryColor(
                                      parseInt(ap.system_stats?.mem || '0').toString()
                                    )
                                  "
                                  :style="{
                                    width: (ap.system_stats?.mem || '0') + '%',
                                  }"
                                ></div>
                              </div>
                            </div>
                            <!-- Load -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400"
                                  >CPU Usage</span
                                >
                                <span
                                  class="text-xs font-medium text-gray-700 dark:text-gray-300"
                                  >{{ ap.system_stats?.cpu || "0" }}%</span
                                >
                              </div>
                              <div
                                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                              >
                                <div
                                  class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  :style="{
                                    width:
                                      parseFloat(ap.system_stats?.cpu || '0') + '%',
                                  }"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Middle Column - Radio Stats -->
                      <div class="space-y-4 pt-4">
                        <h3
                          class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0 px-4"
                        >
                          Radio Status
                        </h3>
                        <div
                          v-for="radio in ap.radio_table_stats"
                          :key="radio.name"
                          class="px-4 pb-4"
                        >
                          <div class="grid grid-cols-2 gap-4">
                            <h3
                              class="text-sm font-medium text-gray-500 dark:text-gray-400"
                            >
                              {{ radio.radio === "ng" ? "2.4 GHz" : "5 GHz" }}
                            </h3>
                            <div
                              class="text-xs"
                              :class="[
                                getHealthColor(radio.satisfaction.toString())
                                  .replace('bg-', 'text-')
                                  .replace('/20', ''),
                              ]"
                            >
                              {{ radio.satisfaction }}%
                            </div>
                          </div>
                          <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                              <div>
                                <span class="text-xs text-gray-500 dark:text-gray-400"
                                  >Channel</span
                                >
                                <p
                                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  {{ radio.channel }}
                                </p>
                              </div>
                              <div>
                                <span class="text-xs text-gray-500 dark:text-gray-400"
                                  >Clients</span
                                >
                                <p
                                  class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                  {{ radio.num_sta || 0 }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Right Column - Network Stats -->
                      <div class="space-y-6 pt-4">
                        <h3
                          class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 px-4"
                        >
                          Device Info
                        </h3>
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-2 gap-4">
                          <div
                            class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 pb-3"
                          >
                            <div class="flex mb-2">
                              <i class="fas fa-clock text-gray-400"></i>
                              <div class="text-sm text-gray-500 dark:text-gray-400">
                                Uptime
                              </div>
                            </div>
                            <p class="text-sm text-gray-900 dark:text-white">
                              {{ formatUptime(ap.uptime) }}
                            </p>
                          </div>
                          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                            <div class="flex mb-2">
                              <i class="fas fa-users text-gray-400"></i>
                              <div class="text-sm text-gray-500 dark:text-gray-400">
                                Clients
                              </div>
                            </div>
                            <div class="text-sm text-gray-900 dark:text-white">
                              {{ getTotalClients(ap.radio_table_stats) }}
                            </div>
                          </div>
                        </div>

                        <!-- Channel Utilization Card -->
                        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                          <h3
                            class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                          >
                            Channel Utilization
                          </h3>
                          <div class="space-y-4">
                            <div>
                              <div class="grid grid-cols-2 gap-4 pb-4">
                                <div class="text-xs text-gray-500 dark:text-gray-400">
                                  Overall Usage
                                </div>
                                <div
                                  class="text-xs font-medium text-gray-700 dark:text-gray-300 px-4"
                                >
                                  {{
                                    ap.radio_table_stats
                                      ? Math.round(
                                          ap.radio_table_stats.reduce(
                                            (sum, radio) => sum + (radio.cu_total || 0),
                                            0
                                          ) / ap.radio_table_stats.length
                                        )
                                      : "0"
                                  }}%
                                </div>
                              </div>
                              <div
                                class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5"
                              >
                                <div
                                  class="h-1.5 rounded-full transition-all duration-300"
                                  :class="
                                    getUtilizationColor(
                                      ap.radio_table_stats
                                        ? Math.round(
                                            ap.radio_table_stats.reduce(
                                              (sum, radio) => sum + (radio.cu_total || 0),
                                              0
                                            ) / ap.radio_table_stats.length
                                          ).toString()
                                        : '0'
                                    )
                                  "
                                  :style="{
                                    width:
                                      (ap.radio_table_stats
                                        ? Math.round(
                                            ap.radio_table_stats.reduce(
                                              (sum, radio) => sum + (radio.cu_total || 0),
                                              0
                                            ) / ap.radio_table_stats.length
                                          )
                                        : 0) + '%',
                                  }"
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Navigation Controls -->
              <div class="flex items-center justify-center space-x-4 mt-4">
                <button
                  @click="prevSlide"
                  class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div class="flex items-center space-x-1">
                  <div
                    v-for="(_, index) in apStatistics"
                    :key="index"
                    @click="currentSlide = index"
                    class="cursor-pointer w-2 h-2 rounded-full transition-all duration-300"
                    :class="[
                      index === currentSlide
                        ? 'bg-primary dark:bg-primary w-4'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
                    ]"
                  ></div>
                </div>
                <button
                  @click="nextSlide"
                  class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
                >
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- WiFi Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">SSID Usage</h2>
              <apexchart
                type="pie"
                height="350"
                :options="ssidUsageOptions"
                :series="ssidUsageSeries"
              ></apexchart>
            </div>
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">Channel Distribution</h2>
              <apexchart
                type="bar"
                height="350"
                :options="channelDistributionOptions"
                :series="channelDistributionSeries"
              ></apexchart>
            </div>
          </div>

          <!-- Network Health -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4 mb-16">
            <h2 class="text-xl font-semibold mb-4">Network Health</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 class="font-semibold mb-2">System Status</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Health Score
                    </div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.score }}%
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Device Status
                    </div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.devicesOnline }}/{{ networkHealth.totalDevices }}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="font-semibold mb-2">Network Performance</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Connected Clients
                    </div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.connectedClients }}
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Network Load
                    </div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.load }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Satisfaction Chart -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4">
            <h2 class="text-xl font-semibold mb-4">Client Satisfaction</h2>
            <apexchart
              type="bar"
              height="350"
              :options="clientSatisfactionOptions"
              :series="clientSatisfactionSeries"
            >
            </apexchart>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useNetworkStore } from "@/stores/networkStats";
import type { UnifiClient, UnifiDevice } from "@/stores/networkStats";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";

const pageTitle = "Network Dashboard";
const networkStore = useNetworkStore();

// Network Overview Stats
const networkOverview = computed(() => [
  {
    title: "Total Devices",
    value: networkStore.devices.length,
    trend: calculateDeviceTrend(),
  },
  {
    title: "Active Clients",
    value: networkStore.clients.filter(
      (client) => Date.now() / 1000 - client.last_seen < 300
    ).length,
    trend: calculateClientTrend(),
  },
  {
    title: "Network Health",
    value: calculateNetworkHealth() + "%",
    trend: calculateHealthTrend(),
  },
  {
    title: "Total Throughput",
    value: formatDataRate(calculateTotalThroughput()),
    trend: calculateThroughputTrend(),
  },
]);

// Client Statistics
const clientStatistics = computed(() =>
  networkStore.clients.map((client: UnifiClient) => ({
    name: client.name || client.hostname || "Unknown Device",
    ip: client.ip || "N/A",
    satisfaction: client.satisfaction ? `${client.satisfaction}%` : "N/A",
    uptime: client.uptime ? formatUptime(client.uptime) : "N/A",
    dataUsage: formatDataRate(client.tx_bytes + client.rx_bytes),
    connectionType: client.is_wired ? "Wired" : `Wireless (${client.radio || "Unknown"})`,
    associatedAP: client.last_uplink_name || "Unknown AP",
  }))
);

// Access Point Statistics
const apStatistics = computed(() =>
  networkStore.devices
    .filter((device: UnifiDevice) => device.type === "uap")
    .map((ap) => ({
      name: ap.name,
      uptime: ap.uptime,
      mac: ap.mac,
      model: ap.model,
      version: ap.version,
      ip: ap.ip,
      rxBytes: ap.uplink.rx_bytes,
      txBytes: ap.uplink.tx_bytes,
      connectedClients:
        ap.radio_table_stats?.reduce((sum, radio) => sum + (radio.num_sta || 0), 0) || 0,
      totalThroughput: formatDataRate(ap.tx_bytes + ap.rx_bytes),
      system_stats: {
        cpu: ap['system-stats']?.cpu || '0',
        mem: ap['system-stats']?.mem || '0',
        uptime: ap['system-stats']?.uptime || '0'
      },
      network: {
        drops: ap.uplink?.drops || 0,
        errors: ap.uplink?.errors || 0,
        latency: ap.uplink?.latency || 0,
      },
      radio_table_stats: ap.radio_table_stats || [],
    }))
);

// SSID Usage Stats
const ssidUsageData = computed(() => {
  const ssidStats = new Map<string, number>();
  networkStore.devices
    .filter((device: UnifiDevice) => device.type === "uap")
    .forEach((ap) => {
      ap.vap_table?.forEach((vap) => {
        const current = ssidStats.get(vap.essid) || 0;
        ssidStats.set(vap.essid, current + (vap.num_sta || 0));
      });
    });
  return Array.from(ssidStats.entries()).map(([name, value]) => ({
    name,
    value,
  }));
});

const ssidUsageSeries = computed(() => ssidUsageData.value.map((item) => item.value));
const ssidUsageOptions = computed(() => ({
  chart: {
    type: "pie",
  },
  labels: ssidUsageData.value.map((item) => item.name),
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: "bottom",
        },
      },
    },
  ],
}));

// Channel Distribution Stats
const channelDistributionData = computed(() => {
  const stats = {
    "2.4GHz": 0,
    "5GHz": 0,
  };

  networkStore.clients
    .filter((client) => !client.is_wired)
    .forEach((client: UnifiClient) => {
      if (client.radio === "ng") stats["2.4GHz"]++;
      else if (client.radio === "na") stats["5GHz"]++;
    });

  return stats;
});

const channelDistributionSeries = computed(() => [
  {
    name: "Clients",
    data: Object.values(channelDistributionData.value),
  },
]);

const channelDistributionOptions = computed(() => ({
  chart: {
    type: "bar",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: Object.keys(channelDistributionData.value),
  },
}));

// Network Health
const networkHealth = computed(() => {
  const devices = networkStore.devices;
  const activeDevices = devices.filter((d) => d.state === 1);
  const totalSatisfaction = activeDevices.reduce(
    (sum, device) => sum + (device.satisfaction || 0),
    0
  );

  return {
    score: calculateNetworkHealth(),
    devicesOnline: activeDevices.length,
    totalDevices: devices.length,
    connectedClients: networkStore.clients.filter(
      (client) => Date.now() / 1000 - client.last_seen < 300
    ).length,
    load: calculateNetworkLoad(),
    trend: calculateHealthTrend(),
    clientTrend: calculateClientTrend(),
  };
});

// Client Satisfaction Distribution
const clientSatisfactionSeries = computed(() => {
  const clients = networkStore.clients.filter((client) => !client.is_wired);
  const distribution = {
    excellent: clients.filter((c) => (c.satisfaction || 0) >= 90).length,
    good: clients.filter((c) => (c.satisfaction || 0) >= 70 && (c.satisfaction || 0) < 90)
      .length,
    fair: clients.filter((c) => (c.satisfaction || 0) >= 50 && (c.satisfaction || 0) < 70)
      .length,
    poor: clients.filter((c) => (c.satisfaction || 0) > 0 && (c.satisfaction || 0) < 50)
      .length,
  };

  return [
    {
      name: "Clients",
      data: Object.values(distribution),
    },
  ];
});

const clientSatisfactionOptions = computed(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      borderRadius: 4,
      distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val || "";
    },
  },
  legend: { show: false },
  xaxis: {
    categories: ["Excellent", "Good", "Fair", "Poor"],
    labels: {
      style: { fontSize: "12px" },
    },
  },
  yaxis: {
    title: { text: "Number of Clients" },
  },
  colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + " clients";
      },
    },
  },
}));

// Helper Functions
function calculateNetworkHealth(): number {
  const devices = networkStore.devices;
  if (!devices.length) return 0;

  const totalSatisfaction = devices.reduce(
    (sum, device) => sum + (device.satisfaction || 0),
    0
  );

  return Math.round(totalSatisfaction / devices.length);
}

function calculateTotalThroughput(): number {
  return networkStore.devices.reduce(
    (sum, device) => sum + device.tx_bytes + device.rx_bytes,
    0
  );
}

function formatDataRate(bytes: number): string {
  const units = ["bps", "Kbps", "Mbps", "Gbps"];
  let value = bytes * 8; // Convert to bits
  let unitIndex = 0;

  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

function formatUptime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "N/A";

  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function calculateClientTrend(): number {
  return 0;
}

function calculateDeviceTrend(): number {
  return 0;
}

function calculateHealthTrend(): number {
  return 0;
}

function calculateThroughputTrend(): number {
  return 0;
}

function calculateNetworkLoad(): number {
  const devices = networkStore.devices;
  const accessPoints = devices.filter((d: UnifiDevice) => d.type === "uap");
  const connectedClients = networkStore.clients.filter(
    (client) => Date.now() / 1000 - client.last_seen < 300
  ).length;

  if (!accessPoints.length) return 0;

  // Calculate average clients per AP (as a percentage of typical capacity)
  // Assuming a typical AP can handle 30-50 clients efficiently
  const maxClientsPerAP = 40;
  const avgClientsPerAP = connectedClients / accessPoints.length;
  const load = Math.round((avgClientsPerAP / maxClientsPerAP) * 100);

  // Cap at 100%
  return Math.min(load, 100);
}

function getTotalClients(radioTableStats: any[]) {
  return radioTableStats.reduce(
    (sum: any, radio: { num_sta: any }) => sum + (radio.num_sta || 0),
    0
  );
}

function formatBytes(bytes: any) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

// Initial data fetch
onMounted(async () => {
  await Promise.all([
    networkStore.fetchDevices(),
    networkStore.fetchClients(),
    networkStore.fetchHealth(),
  ]);

  // Set up polling for updates
  setInterval(async () => {
    await Promise.all([
      networkStore.fetchDevices(),
      networkStore.fetchClients(),
      networkStore.fetchHealth(),
    ]);
  }, 60000); // Update every minute
});

const currentSlide = ref(0);

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    // Loop to the last slide
    currentSlide.value = apStatistics.value.length - 1;
  }
}

function nextSlide() {
  if (currentSlide.value < apStatistics.value.length - 1) {
    currentSlide.value++;
  } else {
    // Loop back to the first slide
    currentSlide.value = 0;
  }
}

let slideInterval: NodeJS.Timeout;

onMounted(() => {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});

const visibleDevices = computed(() => {
  return apStatistics.value.slice(currentSlide.value, currentSlide.value + 1);
});

const getCPUColor = (cpu: string) => {
  const value = parseInt(cpu);
  if (value >= 90) return "bg-red-500";
  if (value >= 70) return "bg-orange-500";
  return "bg-green-500";
};

const getMemoryColor = (memory: string) => {
  const value = parseInt(memory);
  if (value >= 90) return "bg-red-500";
  if (value >= 70) return "bg-orange-500";
  return "bg-green-500";
};

const getTempWidth = (temp: string) => {
  const value = parseInt(temp);
  return Math.min(100, (value / 80) * 100) + "%";
};

const getUtilizationColor = (utilization: string) => {
  const value = parseInt(utilization);
  if (value >= 80) return "bg-red-500 text-red-800 dark:text-red-400";
  if (value >= 60) return "bg-orange-500 text-orange-800 dark:text-orange-400";
  return "bg-green-500 text-green-800 dark:text-green-400";
};

const getHealthColor = (health: string) => {
  const value = parseInt(health);
  if (value >= 80)
    return "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400";
  if (value >= 60)
    return "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-400";
  return "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400";
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>

<style>
.slide-move {
  transition: transform 0.5s ease-in-out;
}

.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-leave-active {
  transition: all 0.5s ease-in;
  position: absolute;
  width: 100%;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
