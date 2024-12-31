export interface RadioTableEntry {
  name: string;
  radio: 'ng' | 'na';
  radio_name?: string;
  channel: string | number;
  ht: number;
  tx_power: number;
  tx_power_mode: string;
  min_txpower: number;
  max_txpower: number;
  nss: number;
  radio_caps: number;
  radio_caps2: number;
  min_rssi?: number;
  antenna_gain?: number;
  cu_total?: number;
  cu_self?: number;
  cu_other?: number;
  num_sta?: number;
  signal?: number;
  satisfaction?: number;
  signal_strength?: number;
}

export interface ChannelDistribution {
  [key: string]: number;
}

export interface SystemStats {
  cpu: string;
  mem: string;
  loadavg_1: string;
}

export interface NetworkStats {
  tx_bytes: number;
  rx_bytes: number;
}

export interface Uplink {
  [key: string]: any;
}

export interface UnifiDevice {
  _id: string;
  ip: string;
  mac: string;
  type: string;
  model: string;
  model_in_lts?: boolean;
  model_in_eol?: boolean;
  name: string;
  state: number;
  adopted: boolean;
  adopted_at?: number;
  adopted_by_client?: string;
  system_stats?: SystemStats;
  radio_table_stats?: RadioTableEntry[];
  tx_bytes?: number;
  rx_bytes?: number;
  tx_bytes_r?: number;
  rx_bytes_r?: number;
  num_sta?: number;
  version?: string;
  uplink?: Uplink;
  disabled: boolean;
  last_seen: number;
  uptime?: number;
  stat?: NetworkStats;
}

export interface UnifiClient {
  _id: string;
  mac: string;
  site_id?: string;
  is_guest?: boolean;
  first_seen?: number;
  last_seen?: number;
  is_wired: boolean;
  name?: string;
  hostname: string;
  ip: string;
  network_id?: string;
  satisfaction?: number;
  uptime?: number;
  tx_bytes?: number;
  rx_bytes?: number;
  radio?: string;
  last_uplink_name?: string;
  essid?: string;
  signal?: number;
  tx_bytes_r?: number;
  rx_bytes_r?: number;
}

export interface NetworkHealth {
  score: number;
  devicesOnline: number;
  totalDevices: number;
  activeClients: number;
  totalClients: number;
  totalAPs: number;
  activeAPs: number;
}

export interface NetworkStats {
  title: string;
  value: string | number;
  icon: string;
  class: string;
}

export interface SSIDStats {
  [key: string]: number;
}

export interface RadioStatsMap {
  [key: string]: RadioTableEntry[];
}

export interface ChannelUtilizationMap {
  [key: string]: number;
}

export interface SatisfactionDistribution {
  excellent: number;
  good: number;
  fair: number;
  poor: number;
}

export interface ChartOptions {
  chart: {
    type: string;
    height?: number;
  };
  labels: string[];
  responsive?: Array<{
    breakpoint?: number;
    options?: {
      chart?: {
        width?: number;
      };
      legend?: {
        position?: string;
      };
    };
  }>;
  colors?: string[];
  dataLabels?: {
    enabled: boolean;
    formatter?: (val: number) => string;
  };
  legend?: {
    position: string;
    horizontalAlign: string;
    labels?: {
      colors: string;
    };
  };
  tooltip?: {
    y: {
      formatter: (val: number) => string;
    };
  };
}
