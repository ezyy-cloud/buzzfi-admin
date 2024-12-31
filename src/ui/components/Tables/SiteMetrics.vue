<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSitesStore } from '@/stores/sites';
import { useAgentsStore } from '@/stores/agents';
import { useSalesStore } from '@/stores/voucherSales';

const sitesStore = useSitesStore();
const agentsStore = useAgentsStore();
const salesStore = useSalesStore();

const loading = ref(false);
const error = ref<string | null>(null);

interface SiteMetric {
  id: number;
  name: string;
  visitors: number;
  revenue: number;
  sales: number;
  conversion: number;
}

const siteMetrics = ref<SiteMetric[]>([]);

const calculateSiteMetrics = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch all required data
    await sitesStore.fetchSites();
    await agentsStore.fetchAgents();

    // Calculate metrics for each site
    const metricsData = await Promise.all(
      sitesStore.sites.map(async (site) => {
        // Find all agents for this site using site ID
        const siteAgents = agentsStore.agents.filter(agent => 
          agent.site === site.id.toString()
        );
        
        let totalRevenue = 0;
        let totalSales = 0;

        // Calculate revenue and sales for each agent in the site
        await Promise.all(
          siteAgents.map(async (agent) => {
            const transactions = await salesStore.fetchAgentTransactions(agent.id);
            
            transactions?.forEach(transaction => {
              const voucherCount = JSON.parse(transaction.voucher_codes || '[]').length;
              totalRevenue += voucherCount * parseFloat(transaction.price || '0');
              totalSales += voucherCount;
            });
          })
        );

        // Calculate conversion rate (sales per agent)
        const conversion = siteAgents.length > 0 
          ? (totalSales / siteAgents.length)
          : 0;

        return {
          id: site.id,
          name: site.name,
          visitors: siteAgents.length, // Number of agents at the site
          revenue: totalRevenue,
          sales: totalSales,
          conversion: Number((conversion).toFixed(1))
        };
      })
    );

    // Sort by revenue (highest first)
    siteMetrics.value = metricsData.sort((a, b) => b.revenue - a.revenue);

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to calculate site metrics';
    console.error('Error calculating site metrics:', err);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

onMounted(() => {
  calculateSiteMetrics();
});
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <h4 class="mb-6 text-xl font-semibold text-black dark:text-white">Site Metrics</h4>

    <div class="flex flex-col">
      <div class="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
        <div class="p-2.5 xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Site</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Agents</h5>
        </div>
        <div class="p-2.5 text-center xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Revenue</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Sales</h5>
        </div>
        <div class="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 class="text-sm font-medium uppercase xsm:text-base">Sales/Agent</h5>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center p-4">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
      
      <div v-else-if="error" class="p-4 text-danger">
        {{ error }}
      </div>

      <div v-else>
        <div
          v-for="(site, key) in siteMetrics"
          :key="site.id"
          :class="`grid grid-cols-3 sm:grid-cols-5 ${
            key === siteMetrics.length - 1
              ? ''
              : 'border-b border-stroke dark:border-strokedark'
          }`"
        >
          <div class="flex items-center gap-3 p-2.5 xl:p-5">
            <p class="text-black dark:text-white">{{ site.name }}</p>
          </div>

          <div class="flex items-center justify-center p-2.5 xl:p-5">
            <p class="text-black dark:text-white">{{ site.visitors }}</p>
          </div>

          <div class="flex items-center justify-center p-2.5 xl:p-5">
            <p class="text-meta-3">{{ formatCurrency(site.revenue) }}</p>
          </div>

          <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p class="text-black dark:text-white">{{ site.sales }}</p>
          </div>

          <div class="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            <p class="text-meta-5">{{ site.conversion }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
