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
            <div v-for="stat in networkStats" :key="stat.title" class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-lg font-semibold mb-2">{{ stat.title }}</h2>
              <p class="text-2xl font-bold" :class="stat.class">{{ stat.value }}</p>
              <i :class="stat.icon" class="text-2xl"></i>
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
                    <tr v-for="client in clientStatistics" :key="client.name"
                      class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td class="py-2 px-4">{{ client.name }}</td>
                      <td class="py-2 px-4">{{ client.ip }}</td>
                      <td class="py-2 px-4">
                        <span :class="getHealthColor(client.satisfaction)">
                          {{ client.satisfaction }}%
                        </span>
                      </td>
                      <td class="py-2 px-4">{{ client.uptime }}</td>
                      <td class="py-2 px-4">{{ client.dataUsage }}/s</td>
                      <td class="py-2 px-4">
                        <span :class="client.connectionType.includes('Wireless') ? 'text-blue-500' : 'text-gray-500'">
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
          <div class="bg-white dark:bg-boxdark rounded-lg shadow-lg dark:shadow-gray-900 p-4 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">Device Statistics</h2>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Total Devices: {{ apStatistics.length }}
              </div>
            </div>

            <div class="relative overflow-hidden rounded-lg bg-boxdark">
              <TransitionGroup name="slide" tag="div">
                <div v-for="(ap, index) in visibleDevices" :key="ap.name" v-show="index === currentSlide"
                  class="transition-transform duration-500">
                  <div class="bg-boxdark rounded-lg shadow-lg dark:shadow-gray-900 p-6">
                    <!-- Header Section -->
                    <div class="mb-6">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ ap.name }}</div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">{{ ap.mac }}</div>
                        </div>
                        <div class="flex items-center space-x-2">
                          <span
                            :class="ap.uptime ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'"
                            class="px-3 py-1 rounded-full text-sm font-medium">
                            <i class="fas fa-circle text-xs mr-1"></i>
                            {{ ap.uptime ? 'Online' : 'Offline' }}
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
                          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            System Stats
                          </h3>
                          <div class="space-y-4">
                            <!-- CPU -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400">CPU</span>
                                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                                  ap.system_stats?.cpu || 'N/A' }}%</span>
                              </div>
                              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div class="h-1.5 rounded-full transition-all duration-300"
                                  :class="getCPUColor(ap.system_stats?.cpu ? Number(ap.system_stats.cpu) : 0)"
                                  :style="{ width: (ap.system_stats?.cpu ? Number(ap.system_stats.cpu) : 0) + '%' }">
                                </div>
                              </div>
                            </div>
                            <!-- Memory -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400">Memory</span>
                                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                                  ap.system_stats?.mem || 'N/A' }}%</span>
                              </div>
                              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div class="h-1.5 rounded-full transition-all duration-300"
                                  :class="getMemoryColor(ap.system_stats?.mem ? Number(ap.system_stats.mem) : 0)"
                                  :style="{ width: (ap.system_stats?.mem ? Number(ap.system_stats.mem) : 0) + '%' }">
                                </div>
                              </div>
                            </div>
                            <!-- Load -->
                            <div>
                              <div class="flex items-center justify-between mb-2">
                                <span class="text-xs text-gray-500 dark:text-gray-400">Load</span>
                                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{
                                  ap.system_stats?.loadavg_1 || '0' }}</span>
                              </div>
                              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                  :style="{ width: ((parseFloat(ap.system_stats?.loadavg_1 || '0')) * 100) + '%' }">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Middle Column - Radio Stats -->
                      <div class="space-y-4 pt-4">
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0 px-4">Radio Status</h3>
                        <div v-for="radio in ap.radio_table_stats" :key="radio.name"
                          class="px-4 pb-4">
                          <div class="grid grid-cols-2 gap-4">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                              {{ radio.radio === 'ng' ? '2.4 GHz' : '5 GHz'
                              }}
                            </h3>
                            <div class="text-xs" :class="[getHealthColor(radio.satisfaction || 0).replace('bg-', 'text-').replace('/20', '')]">
                              {{ radio.satisfaction || 0 }}%
                            </div>
                          </div>
                          <div class="space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                              <div>
                                <span class="text-xs text-gray-500 dark:text-gray-400">Channel</span>
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {{ radio.channel }}
                                </p>
                              </div>
                              <div>
                                <span class="text-xs text-gray-500 dark:text-gray-400">Clients</span>
                                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {{ radio.num_sta || 0 }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Right Column - Network Stats -->
                      <div class="space-y-6 pt-4">
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 px-4">Device Info</h3>
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-2 gap-4">
                          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 pb-3">
                            <div class="flex  mb-2">
                              <i class="fas fa-clock text-gray-400"></i>
                              <div class="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
                            </div>
                            <p class="text-sm  text-gray-900 dark:text-white">
                              {{ formatUptime(ap.uptime ? Number(ap.uptime) : 0) }}
                            </p>
                          </div>
                          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                            <div class="flex  mb-2">
                              <i class="fas fa-users text-gray-400"></i>
                              <div class="text-sm text-gray-500 dark:text-gray-400">Clients</div>
                            </div>
                            <div class="text-sm text-gray-900 dark:text-white">
                              {{ getTotalClients(ap.radio_table_stats) }}
                            </div>
                          </div>
                        </div>

                        <!-- Channel Utilization Card -->
                        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4">
                          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Channel Utilization
                          </h3>
                          <div class="space-y-4">
                            <div>
                              <div class="grid grid-cols-2 gap-4 pb-4">
                                <div class="text-xs text-gray-500 dark:text-gray-400">Overall Usage</div>
                                <div class="text-xs font-medium text-gray-700 dark:text-gray-300 px-4">
                                  {{ ap.radio_table_stats ?
                                    Math.round(ap.radio_table_stats.reduce((sum, radio) => sum + (radio.cu_total || 0), 0)
                                      / ap.radio_table_stats.length)
                                  : '0' }}%
                                </div>
                              </div>
                              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div class="h-1.5 rounded-full transition-all duration-300" :class="getUtilizationColor(ap.channel_utilization)"
                                  :style="{
                                        width: ap.channel_utilization + '%'
                                      }">
                                </div>
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
                <button @click="prevSlide"
                  class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group">
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div class="flex items-center space-x-1">
                  <div v-for="(_, index) in apStatistics" :key="index" @click="currentSlide = index"
                    class="cursor-pointer w-2 h-2 rounded-full transition-all duration-300" :class="[
                      index === currentSlide
                        ? 'bg-primary dark:bg-primary w-4'
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    ]">
                  </div>
                </div>
                <button @click="nextSlide"
                  class="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group">
                  <svg
                    class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- WiFi Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">SSID Usage</h2>
              <apexchart type="pie" height="350" :options="ssidUsageOptions" :series="ssidUsageSeries"></apexchart>
            </div>
            <div class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-xl font-semibold mb-4">Channel Distribution</h2>
              <apexchart type="bar" height="350" :options="channelDistributionOptions"
                :series="[{ name: 'APs', data: channelDistributionSeries }]"></apexchart>
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
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Health Score</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.score.toString() }}%
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Device Status</div>
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
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Connected Clients</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.activeClients }}
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Network Load</div>
                    <div class="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {{ networkHealth.score.toString() }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Client Satisfaction Chart -->
          <div class="dark:bg-boxdark rounded-lg shadow p-4">
            <h2 class="text-xl font-semibold mb-4">Client Satisfaction</h2>
            <apexchart type="bar" height="350" :options="clientSatisfactionOptions" :series="clientSatisfactionSeries">
            </apexchart>
          </div>

          <!-- Health Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div v-for="stat in networkStats" :key="stat.title" class="dark:bg-boxdark rounded-lg shadow p-4">
              <h2 class="text-lg font-semibold mb-2">{{ stat.title }}</h2>
              <p class="text-2xl font-bold" :class="stat.class">{{ stat.value }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useNetworkStore } from "@/stores/networkStats";
import type { UnifiDevice, UnifiClient, RadioTableEntry, NetworkHealth, ChannelDistribution } from "@/types/unifi";
import { storeToRefs } from "pinia";
import DefaultLayout from "@/ui/layouts/DefaultLayout.vue";
import BreadcrumbDefault from "@/ui/components/Breadcrumbs/BreadcrumbDefault.vue";

const networkStore = useNetworkStore();
const { devices, clients } = storeToRefs(networkStore);

const currentSlide = ref(0);
const timer = ref<NodeJS.Timeout | null>(null);
const pageTitle = ref("Network Dashboard");

const calculateNetworkHealth = (): number => {
  const accessPoints = devices.value.filter((d) => d.type === 'uap');
  
  if (!accessPoints.length) return 0;

  const totalHealth = accessPoints.reduce((sum, device) => {
    // CPU health (weight: 0.3)
    const cpuHealth = 100 - parseFloat(device.system_stats?.cpu || '0');
    
    // Memory health (weight: 0.3)
    const memHealth = 100 - parseFloat(device.system_stats?.mem || '0');
    
    // Signal strength health (weight: 0.2)
    const signalHealth = device.radio_table_stats?.reduce((total, radio) => 
      total + (radio.signal || 0), 0) || 0;
    
    // Channel utilization health (weight: 0.2)
    const channelHealth = 100 - (device.radio_table_stats?.reduce((total, radio) => 
      total + (radio.cu_total || 0), 0) || 0);

    return sum + (cpuHealth * 0.3 + memHealth * 0.3 + signalHealth * 0.2 + channelHealth * 0.2);
  }, 0);

  return Math.round(totalHealth / accessPoints.length);
};

const networkHealth = computed<NetworkHealth>(() => {
  const activeDevices = devices.value.filter((d) => d.state === 1);
  const now = Date.now() / 1000;
  
  return {
    score: calculateNetworkHealth(),
    devicesOnline: activeDevices.length,
    totalDevices: devices.value.length,
    activeClients: clients.value.filter((client) =>
      client.last_seen ? now - client.last_seen < 300 : false
    ).length,
    totalClients: clients.value.length,
    totalAPs: devices.value.filter((d) => d.type === 'uap').length,
    activeAPs: activeDevices.filter((d) => d.type === 'uap').length,
  };
});

const networkLoad = computed(() => {
  return devices.value
    .filter((d) => d.type === 'uap')
    .reduce((sum, device) => {
      return sum + (device.system_stats?.loadavg_1 ? parseFloat(device.system_stats.loadavg_1) : 0);
    }, 0);
});

const totalChannelUtilization = computed(() => {
  return devices.value
    .filter((d) => d.type === 'uap')
    .reduce((sum, device) => {
      const radioStats = device.radio_table_stats || [];
      return sum + radioStats.reduce((total, radio) => total + (radio.cu_total || 0), 0);
    }, 0);
});

const networkStats = computed(() => {
  return [
    {
      title: 'Network Load',
      value: networkLoad.value.toFixed(2),
      icon: 'fas fa-network-wired',
      class: networkLoad.value > 2 ? 'text-red-500' : 'text-green-500'
    },
    {
      title: 'Channel Utilization',
      value: totalChannelUtilization.value.toFixed(2) + '%',
      icon: 'fas fa-signal',
      class: totalChannelUtilization.value > 80 ? 'text-red-500' : 'text-green-500'
    }
  ];
});

const clientStatistics = computed(() => {
  return clients.value.map((client) => ({
    name: client.name || client.hostname || 'Unknown Device',
    ip: client.ip,
    satisfaction: client.satisfaction || 0,
    uptime: formatUptime(client.uptime),
    dataUsage: formatBytes((client.tx_bytes_r || 0) + (client.rx_bytes_r || 0)),
    connectionType: client.is_wired ? 'Wired' : 'Wireless',
    associatedAP: client.essid || 'N/A'
  }));
});

const clientSatisfactionOptions = {
  chart: {
    type: 'pie',
    height: 350,
  },
  labels: ['Excellent', 'Good', 'Fair', 'Poor'],
  colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
};

const clientSatisfactionSeries = computed(() => {
  const wirelessClients = clients.value.filter((client) => !client.is_wired);
  return [
    wirelessClients.filter(c => (c.satisfaction || 0) >= 90).length,
    wirelessClients.filter(c => (c.satisfaction || 0) >= 70 && (c.satisfaction || 0) < 90).length,
    wirelessClients.filter(c => (c.satisfaction || 0) >= 50 && (c.satisfaction || 0) < 70).length,
    wirelessClients.filter(c => (c.satisfaction || 0) < 50).length,
  ];
});

const ssidUsageOptions = {
  chart: {
    type: 'donut'
  },
  labels: ['2.4 GHz', '5 GHz'],
  colors: ['#10B981', '#6366F1']
};

const ssidUsageSeries = computed(() => {
  const stats = devices.value
    .filter((device) => device.type === 'uap')
    .reduce((acc, device) => {
      const radioStats = device.radio_table_stats || [];
      const band24 = radioStats.find(r => r.radio === 'ng')?.num_sta || 0;
      const band5 = radioStats.find(r => r.radio === 'na')?.num_sta || 0;
      return [acc[0] + band24, acc[1] + band5];
    }, [0, 0]);
  return stats;
});

const channelDistributionOptions = {
  chart: {
    type: 'bar'
  },
  xaxis: {
    categories: [] as string[]
  }
};

const channelDistributionSeries = computed(() => {
  const channelCounts: ChannelDistribution = devices.value
    .filter((device) => device.type === 'uap')
    .reduce((acc: ChannelDistribution, device) => {
      const radioStats = device.radio_table_stats || [];
      radioStats.forEach((radio) => {
        if (radio.channel) {
          const channelKey = radio.channel.toString();
          acc[channelKey] = (acc[channelKey] || 0) + 1;
        }
      });
      return acc;
    }, {});

  channelDistributionOptions.xaxis.categories = Object.keys(channelCounts);
  return [{
    name: 'APs',
    data: Object.values(channelCounts)
  }];
});

// Helper Functions
const formatUptime = (seconds: number | undefined): string => {
  if (seconds === undefined) return 'N/A';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  
  return `${days}d ${hours}h ${minutes}m`;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getCPUColor = (cpu: number): string => {
  if (cpu >= 80) return 'bg-red-500';
  if (cpu >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getMemoryColor = (mem: number): string => {
  if (mem >= 80) return 'bg-red-500';
  if (mem >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getHealthColor = (health: number): string => {
  if (health >= 90) return 'bg-green-500/20 text-green-500';
  if (health >= 70) return 'bg-blue-500/20 text-blue-500';
  if (health >= 50) return 'bg-yellow-500/20 text-yellow-500';
  return 'bg-red-500/20 text-red-500';
};

const calculateHealthTrend = (current: number, previous: number): string => {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'stable';
};

const totalThroughput = computed(() => {
  return devices.value
    .filter((device) => device.type === 'uap')
    .reduce((sum, device) => {
      return sum + (device.stat?.tx_bytes || 0) + (device.stat?.rx_bytes || 0);
    }, 0);
});

const getTotalClients = (radioTableStats: RadioTableEntry[]): number => {
  return radioTableStats.reduce((total, radio) => total + (radio.num_sta || 0), 0);
};

const apStatistics = computed(() => {
  return devices.value
    .filter((device) => device.type === 'uap')
    .map((ap) => {
      const channelUtil = ap.radio_table_stats?.reduce((sum, radio) => 
        sum + (radio.cu_total || 0), 0) || 0;
      
      return {
        name: ap.name || '',
        uptime: ap.uptime ? formatUptime(Number(ap.uptime)) : 'N/A',
        model: ap.model || '',
        version: ap.version || '',
        ip: ap.ip || '',
        mac: ap.mac || '',
        connectedClients: getTotalClients(ap.radio_table_stats || []),
        totalThroughput: formatBytes((ap.stat?.tx_bytes || 0) + (ap.stat?.rx_bytes || 0)),
        channel_utilization: channelUtil,
        signalStrength: ap.radio_table_stats?.[0]?.signal || 0,
        system_stats: {
          cpu: ap.system_stats?.cpu || '0',
          mem: ap.system_stats?.mem || '0',
          loadavg_1: ap.system_stats?.loadavg_1 || '0'
        },
        network: {
          tx_bytes: ap.stat?.tx_bytes || 0,
          rx_bytes: ap.stat?.rx_bytes || 0
        },
        radio_table_stats: ap.radio_table_stats || []
      };
    });
});

const visibleDevices = computed(() => {
  return apStatistics.value.slice(currentSlide.value, currentSlide.value + 1);
});

const getUtilizationColor = (utilization: number): string => {
  const value = utilization || 0;
  if (value >= 80) return 'bg-red-500';
  if (value >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getTempWidth = (temp: number): string => {
  const value = temp || 0;
  return `${Math.min(value, 100)}%`;
};

// Initial data fetch
onMounted(() => {
  networkStore.fetchDevices();
  networkStore.fetchClients();
  
  timer.value = setInterval(() => {
    networkStore.fetchDevices();
    networkStore.fetchClients();
  }, 60000); // Update every minute
});

// Timer cleanup
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
});

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = apStatistics.value.length - 1;
  }
};

const nextSlide = () => {
  if (currentSlide.value < apStatistics.value.length - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0;
  }
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
