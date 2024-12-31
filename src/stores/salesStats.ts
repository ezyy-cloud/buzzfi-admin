// stores/salesStats.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  activeVouchers: number;
  expiredVouchers: number;
}

interface VendorStats {
  vendorId: number;
  name: string;
  sales: number;
  revenue: number;
}

interface ClientStats {
  deviceType: string;
  count: number;
  percentage: number;
}

export const useSalesStatsStore = defineStore('salesStats', {
  state: () => ({
    stats: {
      totalSales: 0,
      totalRevenue: 0,
      activeVouchers: 0,
      expiredVouchers: 0
    } as SalesStats,
    vendorStats: [] as VendorStats[],
    clientStats: [] as ClientStats[],
    siteMetrics: [],
    loading: false,
    error: null as string | null,
    pollingInterval: null as number | null,
  }),
  
  actions: {
    async fetchSalesStats() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/sales/stats`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.stats = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch sales stats';
      } finally {
        this.loading = false;
      }
    },

    async fetchVendorStats() {
      try {
        const response = await axios.get(`${API_URL}/sales/vendors`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.vendorStats = response.data;
      } catch (err: any) {
        console.error('Failed to fetch vendor stats:', err);
      }
    },

    async fetchClientStats() {
      try {
        const response = await axios.get(`${API_URL}/sales/clients`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.clientStats = response.data;
      } catch (err: any) {
        console.error('Failed to fetch client stats:', err);
      }
    },

    async fetchSiteMetrics() {
      try {
        const response = await axios.get(`${API_URL}/sales/sites`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.siteMetrics = response.data;
      } catch (err: any) {
        console.error('Failed to fetch site metrics:', err);
      }
    },

    startPolling() {
      // Fetch initial data
      this.fetchAllData();
      
      // Set up polling every 5 seconds
      this.pollingInterval = window.setInterval(() => {
        this.fetchAllData();
      }, 5000);
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },

    async fetchAllData() {
      await Promise.all([
        this.fetchSalesStats(),
        this.fetchVendorStats(),
        this.fetchClientStats(),
        this.fetchSiteMetrics()
      ]);
    }
  },
});
