// stores/networkStats.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface RadioTableEntry {
  name: string;
  radio: 'ng' | 'na';
  channel: string | number;
  ht: number;
  tx_power: number;
  tx_power_mode: string;
  min_txpower: number;
  max_txpower: number;
  nss: number;
  radio_caps: number;
  radio_caps2: number;
  antenna_gain: number;
  antenna_id: number;
  builtin_antenna: boolean;
  builtin_ant_gain: number;
  current_antenna_gain: number;
  has_dfs?: boolean;
  has_fccdfs?: boolean;
  is_11ac?: boolean;
  channel_optimization_enabled?: boolean;
  min_rssi_enabled?: boolean;
  min_rssi?: number;
  hard_noise_floor_enabled?: boolean;
  vwire_enabled?: boolean;
  state?: string;
  num_sta?: number;
  satisfaction?: number;
  cu_total?: number;
  cu_self_rx?: number;
  cu_self_tx?: number;
}

interface VapTableEntry {
  name: string;
  bssid: string;
  essid: string;
  radio: string;
  radio_name: string;
  up: boolean;
  enabled: boolean;
  is_guest: boolean;
  is_wep: boolean;
  usage: 'user' | 'guest';
  tx_bytes: number;
  rx_bytes: number;
  tx_errors: number;
  tx_retries: number;
  tx_packets: number;
  rx_packets: number;
  num_sta: number;
  channel: number;
  rx_nwids: number;
  rx_crypts: number;
  rx_frags: number;
  satisfaction: number;
  state: string;
  tx_power: number;
  id?: string;
  wlanconf_id?: string;
  site_id?: string;
}

interface UplinkStats {
  rx_bytes: number;
  tx_bytes: number;
  rx_bytes_mov: number;
  tx_bytes_mov: number;
  rx_packets: number;
  tx_packets: number;
  rx_rate: number;
  tx_rate: number;
  rx_retries: number;
  tx_retries: number;
  satisfaction: number;
}

interface UnifiDevice {
  _id: string;
  ip: string;
  mac: string;
  type: string;
  model: string;
  model_in_lts: boolean;
  model_in_eol: boolean;
  name: string;
  state: number;
  adopted: boolean;
  adopted_at: number;
  adopted_by_client: string;
  site_id: string;
  x_authkey: string;
  cfgversion: string;
  inform_url: string;
  inform_ip: string;
  version: string;
  required_version: string;
  board_rev: number;
  manufacturer_id: number;
  model_incompatible: boolean;
  ethernet_table: Array<{
    name: string;
    mac: string;
    num_port: number;
  }>;
  radio_table: RadioTableEntry[];
  vap_table: VapTableEntry[];
  uplink?: {
    type: string;
    up: boolean;
    name: string;
    full_duplex: boolean;
    speed: number;
    mac: string;
    ip: string;
    netmask: string;
    gateway: string;
    latency: number;
    uptime: number;
    tx_bytes: number;
    rx_bytes: number;
    drops: number;
    errors: number;
  };
  uplink_table?: Array<{
    name: string;
    type: string;
    up: boolean;
    uplink_mac: string;
    uplink_device_name?: string;
  }>;
  system_stats?: {
    cpu: string;
    mem: string;
    uptime: string;
  };
  stat?: {
    ap?: {
      [key: string]: number | string;
    };
  };
  bytes: number;
  bytes_r: number;
  tx_bytes: number;
  rx_bytes: number;
  bytes_d: number;
  tx_bytes_d: number;
  rx_bytes_d: number;
  last_seen: number;
  next_interval: number;
  satisfaction?: number;
  upgradable: boolean;
  uptime: number;
  isolated: boolean;
  hash_id: string;
  gateway_mac?: string;
  gateway_name?: string;
  x_vwirekey?: string;
  wifi_caps?: number;
  guest_kicks?: number;
  guest_token?: string;
  radio_table_stats?: Array<{
    name: string;
    radio: string;
    satisfaction: number;
    channel: number;
    tx_power: number;
    tx_packets: number;
    tx_retries: number;
    num_sta: number;
    cu_total: number;
    cu_self_rx: number;
    cu_self_tx: number;
  }>;
}

interface UnifiClient {
  _id: string;
  mac: string;
  site_id: string;
  is_guest: boolean;
  first_seen: number;
  last_seen: number;
  is_wired: boolean;
  name?: string;
  hostname?: string;
  ip: string;
  network_id?: string;
  oui?: string;
  radio?: 'ng' | 'na';
  radio_name?: string;
  essid?: string;
  bssid?: string;
  channel?: number;
  radio_proto?: string;
  tx_rate?: number;
  rx_rate?: number;
  tx_power?: number;
  idletime?: number;
  dhcpend_time?: number;
  uptime?: number;
  tx_bytes: number;
  rx_bytes: number;
  tx_packets: number;
  tx_retries: number;
  wifi_tx_attempts?: number;
  rx_packets: number;
  signal?: number;
  rssi?: number;
  noise?: number;
  satisfaction?: number;
  satisfaction_now?: number;
  satisfaction_real?: number;
  state?: number;
  state_ht?: boolean;
  state_pwrmgt?: boolean;
  dev_cat?: number;
  dev_family?: number;
  dev_vendor?: number;
  dev_id?: number;
  network?: string;
  blocked?: boolean;
  use_fixedip?: boolean;
  noted?: boolean;
  assoc_time?: number;
  latest_assoc_time?: number;
  tx_bytes_r?: number;
  rx_bytes_r?: number;
  qos_policy_applied?: boolean;
  anomalies?: number;
  fingerprint_override?: boolean;
  fingerprint_source?: string;
}

interface NetworkData {
  sites: any[];
  clients: UnifiClient[];
  devices: UnifiDevice[];
  users: any[];
  health: any[];
  dashboard: any[];
  alarms: any[];
  events: any[];
}

export const useNetworkStore = defineStore('network', {
  state: () => ({
    sites: [] as any[],
    clients: [] as UnifiClient[],
    devices: [] as UnifiDevice[],
    users: [] as any[],
    health: [] as any[],
    dashboard: [] as any[],
    alarms: [] as any[],
    events: [] as any[],
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
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`
          }
        });
        this[stateKey] = response.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred';
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false;
      }
    }
  },
});
