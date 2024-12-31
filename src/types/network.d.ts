export interface UnifiClient {
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
  radio?: string;
  radio_proto?: string;
  radio_name?: string;
  satisfaction?: number;
  uptime?: number;
  tx_bytes: number;
  rx_bytes: number;
  last_uplink_name?: string;
}

export interface RadioStats {
  name: string;
  channel: number;
  channel_width: number;
  tx_power: number;
  tx_power_mode: string;
  channel_utilization: number;
  num_sta?: number;
  signal_strength?: number;
  tx_rate?: number;
  rx_rate?: number;
  cu_total?: number;
  radio?: string;
  satisfaction?: number;
}

export interface SystemStats {
  cpu: number;
  mem: number;
  uptime: number;
  loadavg_1?: number;
}

export interface UplinkStats {
  drops: number;
  errors: number;
  latency: number;
  signal_strength?: number;
  tx_rate?: number;
  rx_rate?: number;
}

export interface UnifiDevice {
  _id: string;
  ip: string;
  mac: string;
  type: string;
  model: string;
  name: string;
  version: string;
  state: number;
  adopted: boolean;
  system_stats?: SystemStats;
  radio_table_stats?: RadioStats[];
  tx_bytes?: number;
  rx_bytes?: number;
  uplink?: UplinkStats;
  connectedClients?: number;
  totalThroughput?: string;
  signalStrength?: string | number;
  channel_utilization?: number;
}

export interface DeviceStats {
  name: string;
  uptime: number;
  model: string;
  ip: string;
  mac: string;
  connectedClients: number;
  totalThroughput: string;
  channel_utilization: number;
  signalStrength: number;
  txRate: number;
  rxRate: number;
  system_stats: {
    cpu: number;
    mem: number;
    uptime: number;
  };
  network: {
    drops: number;
    errors: number;
    latency: number;
  };
  radio_table_stats: Array<{
    name: string;
    channel: number;
    channel_width: number;
    tx_power: number;
    tx_power_mode: string;
    channel_utilization: number;
    signal_strength?: number;
    tx_rate?: number;
    rx_rate?: number;
  }>;
}
