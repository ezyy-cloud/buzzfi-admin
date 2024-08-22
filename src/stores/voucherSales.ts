// stores/voucherSales.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface Transaction {
  id: number;
  amount: number;
  date: string;
  created_at: string | number | Date;
  voucher_codes: string;
  price: string;
  user_id: any;
  agentId?: number; // Optional for general transactions
}

export const useSalesStore = defineStore('sales', {
  state: () => ({
    transactions: [] as Transaction[],
    agentTransactions: [] as Transaction[], // State for agent-specific transactions
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchTransactions() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Transaction[]>(`${API_URL}/transactions`, {
          headers: {
            'Authorization': `Bearer ${TOKEN }`,
          },
        });
        this.transactions = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch transactions';
      } finally {
        this.loading = false;
      }
    },

    async fetchAgentTransactions(agentId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Transaction[]>(`${API_URL}/transactions/user/${agentId}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN }`,
          },
        });
        this.agentTransactions = response.data; // Update state with agent-specific transactions
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch user transactions';
      } finally {
        this.loading = false;
      }
    },
  },
});
