// stores/networkStats.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface NetworkData {
  [key: string]: any;
}

export const useNetworkStore = defineStore('network', {
  state: () => ({
    sites: [] as NetworkData[],
    clients: [] as NetworkData[],
    devices: [] as NetworkData[],
    users: [] as NetworkData[],
    health: [] as NetworkData[],
    dashboard: [] as NetworkData[],
    alarms: [] as NetworkData[],
    events: [] as NetworkData[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchSites() {
      return this.fetchData('sites', `${API_URL}/network/sites`);
    },
    async fetchClients() {
      return this.fetchData('clients', `${API_URL}/network/clients`);
    },
    async fetchDevices() {
      return this.fetchData('devices', `${API_URL}/network/devices`);
    },
    async fetchUsers() {
      return this.fetchData('users', `${API_URL}/network/users`);
    },
    async fetchHealth() {
      return this.fetchData('health', `${API_URL}/network/health`);
    },
    async fetchDashboard() {
      return this.fetchData('dashboard', `${API_URL}/network/dashboard`);
    },
    async fetchAlarms() {
      return this.fetchData('alarms', `${API_URL}/network/alarms`);
    },
    async fetchEvents() {
      return this.fetchData('events', `${API_URL}/network/events`);
    },
    async fetchData(stateKey: keyof NetworkData, url: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get<NetworkData[]>(url, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        (this as any)[stateKey] = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || `Failed to fetch ${String(stateKey)}`;
      } finally {
        this.loading = false;
      }
    },
  },
});
