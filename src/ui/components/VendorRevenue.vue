<template>
  <div class="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
    <h4 class="mb-6 px-7.5 text-xl font-bold text-black dark:text-white">
      Agent Revenue
    </h4>

    <div>
      <div v-if="loading" class="flex items-center justify-center py-4">
        <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
      
      <div v-else-if="error" class="px-7.5 text-danger">
        {{ error }}
      </div>

      <div v-else class="flex flex-col gap-4">
        <div v-for="agent in agentRevenueList" :key="agent.id" class="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4">
          <div class="relative h-14 w-14 rounded-full">
            <img :src="agent.avatar || defaultAvatar" :alt="agent.name" class="h-full w-full rounded-full object-cover object-center" />
            <span :class="agent.active ? 'bg-success' : 'bg-danger'" class="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white"></span>
          </div>

          <div class="flex flex-1 items-center justify-between">
            <div>
              <h5 class="font-medium text-black dark:text-white">
                {{ agent.name }}
              </h5>
              <p class="text-sm">{{ formatCurrency(agent.revenue) }}</p>
            </div>
            <span class="text-sm text-meta-3" v-if="agent.salesCount">
              {{ agent.salesCount }} sales
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAgentsStore } from '@/stores/agents';
import { useSalesStore } from '@/stores/voucherSales';
import defaultAvatar from '@/ui/assets/images/user/user-01.png';

interface AgentRevenue {
  id: number;
  name: string;
  revenue: number;
  salesCount: number;
  active: boolean;
  avatar?: string;
}

const agentsStore = useAgentsStore();
const salesStore = useSalesStore();
const loading = ref(false);
const error = ref<string | null>(null);
const agentRevenueList = ref<AgentRevenue[]>([]);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const calculateAgentRevenue = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Fetch all agents
    await agentsStore.fetchAgents();
    
    // Calculate revenue for each agent
    const revenueData = await Promise.all(
      agentsStore.agents.map(async (agent) => {
        // Fetch agent-specific transactions and store the result directly
        const transactions = await salesStore.fetchAgentTransactions(agent.id);
        
        // Calculate total revenue and sales from transactions
        let totalRevenue = 0;
        let totalSales = 0;
        
        // Use the returned transactions directly instead of accessing store state
        transactions?.forEach(transaction => {
          const voucherCount = JSON.parse(transaction.voucher_codes || '[]').length;
          totalRevenue += voucherCount * parseFloat(transaction.price || '0');
          totalSales += voucherCount;
        });
        
        return {
          id: agent.id,
          name: agent.name,
          revenue: totalRevenue,
          salesCount: totalSales,
          active: agent.active || false,
          avatar: undefined
        };
      })
    );

    // Sort by revenue (highest first)
    agentRevenueList.value = revenueData.sort((a, b) => b.revenue - a.revenue);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to calculate agent revenue';
    console.error('Error calculating agent revenue:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  calculateAgentRevenue();
});
</script>
