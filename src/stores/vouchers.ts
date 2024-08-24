// stores/vouchers.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface Voucher {
  id: number;
  name: string;
  price: number;
  validity: number;
  quota: number;
}

export const useVouchersStore = defineStore('vouchers', {
  state: () => ({
    vouchers: [] as Array<Voucher>,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchVouchers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<Voucher[]>(`${API_URL}/vouchers`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.vouchers = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch vouchers';
      } finally {
        this.loading = false;
      }
    },
    async addVoucher(voucher: Voucher) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post<Voucher>(`${API_URL}/vouchers`, voucher, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.vouchers.push(response.data);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to add voucher';
      } finally {
        this.loading = false;
      }
    },
    async updateVoucher(id: number, updatedVoucher: Partial<Voucher>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put<Voucher>(`${API_URL}/vouchers/${id}`, updatedVoucher, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        const index = this.vouchers.findIndex((voucher: { id: number; }) => voucher.id === id);
        if (index !== -1) {
          this.vouchers[index] = response.data;
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update voucher';
      } finally {
        this.loading = false;
      }
    },
    async deleteVoucher(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await axios.get('/sanctum/csrf-cookie').then(response =>
          
          axios.delete(`${API_URL}/vouchers/${id}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Accept': 'application/json',
          },
        }));
        this.vouchers = this.vouchers.filter((voucher: { id: number; }) => voucher.id !== id);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete voucher';
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = null;
    },
  },
});
