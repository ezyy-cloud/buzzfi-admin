<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";
import { useSalesStore } from "@/stores/voucherSales";
import { useVouchersStore } from "@/stores/vouchers";

interface ChartDataType {
  series: { name: string; data: number[] }[];
  labels: string[];
}

const salesStore = useSalesStore();
const voucherStore = useVouchersStore();
const timeframe = ref("month");

const chartData = ref<ChartDataType>({
  series: [],
  labels: [],
});

const chart = ref(null);

onMounted(async () => {
  await salesStore.fetchTransactions();
  await voucherStore.fetchVouchers();
  updateChartData();
  watch(timeframe, updateChartData);
});

const updateChartData = () => {
  const now = new Date();
  let startDate: Date;
  let dateFormat: Intl.DateTimeFormatOptions;

  switch (timeframe.value) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      dateFormat = { month: "short", day: "numeric" };
      break;
    case "week":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 12 * 7);
      dateFormat = { month: "short", day: "numeric" };
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      dateFormat = { month: "short", year: "numeric" };
      break;
  }

  const filteredTransactions = salesStore.transactions.filter(
    (transaction) => new Date(transaction.created_at) >= startDate
  );

  const groupedData = groupTransactionsByTimeframeAndVoucher(
    filteredTransactions,
    timeframe.value
  );

  chartData.value = {
    series: voucherStore.vouchers.map((voucher) => ({
      name: voucher.name,
      data: groupedData.map((item) => item.voucherRevenue[voucher.id] || 0),
    })),
    labels: groupedData.map((item) =>
      new Date(item.date).toLocaleDateString("en-US", dateFormat)
    ),
  };
};

const groupTransactionsByTimeframeAndVoucher = (
  transactions: any[],
  timeframe: string
) => {
  const groupedData: {
    [key: string]: { date: string; voucherRevenue: { [key: string]: number } };
  } = {};
  const now = new Date();

  if (timeframe === "week") {
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i * 7
      );
      const key = weekStart.toISOString().split("T")[0];
      groupedData[key] = { date: key, voucherRevenue: {} };
    }
  } else if (timeframe === "month") {
    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthStart.getFullYear()}-${String(
        monthStart.getMonth() + 1
      ).padStart(2, "0")}`;
      groupedData[key] = { date: key, voucherRevenue: {} };
    }
  }

  transactions.forEach((transaction) => {
    const date = new Date(transaction.created_at);
    let key: string;
    let weekStart: Date;

    switch (timeframe) {
      case "day":
        key = date.toISOString().split("T")[0];
        break;
      case "week":
        weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        key = weekStart.toISOString().split("T")[0];
        break;
      case "month":
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
    }

    if (!groupedData[key]) {
      groupedData[key] = { date: key, voucherRevenue: {} };
    }

    const price = parseFloat(transaction.price);
    const quantity = JSON.parse(transaction.voucher_codes).length;
    const revenue = price * quantity;

    const voucher = voucherStore.vouchers.find((v) => v.quota === transaction.quota);
    if (voucher) {
      if (!groupedData[key].voucherRevenue[voucher.id]) {
        groupedData[key].voucherRevenue[voucher.id] = 0;
      }
      groupedData[key].voucherRevenue[voucher.id] += revenue;
    }
  });

  return Object.values(groupedData).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const apexOptions = computed(() => ({
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
  },
  colors: voucherStore.vouchers.map(
    (_, index) => `hsl(${(index * 360) / voucherStore.vouchers.length}, 70%, 50%)`
  ),
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    stacked: true,
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "smooth",
  },
  labels: {
    show: false,
    position: "top",
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: voucherStore.vouchers.map(
      (_, index) => `hsl(${(index * 360) / voucherStore.vouchers.length}, 70%, 50%)`
    ),
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: chartData.value.labels,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      text: "Revenue",
      style: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#8C8C8C",
      },
    },
    labels: {
      formatter: (value: number) => `$${value.toFixed(2)}`,
    },
  },
}));
</script>

<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8"
  >
    <div class="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
      <div class="flex w-full flex-wrap gap-3 sm:gap-5">
        <h4 class="text-xl font-bold text-black dark:text-white">Voucher Sales</h4>
      </div>
      <div class="flex w-full max-w-45 justify-end">
        <div class="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
          <button
            @click="timeframe = 'day'"
            :class="[
              'rounded py-1 px-3 text-xs font-medium',
              timeframe === 'day'
                ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white'
                : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark',
            ]"
          >
            Day
          </button>
          <button
            @click="timeframe = 'week'"
            :class="[
              'rounded py-1 px-3 text-xs font-medium',
              timeframe === 'week'
                ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white'
                : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark',
            ]"
          >
            Week
          </button>
          <button
            @click="timeframe = 'month'"
            :class="[
              'rounded py-1 px-3 text-xs font-medium',
              timeframe === 'month'
                ? 'bg-white text-black shadow-card dark:bg-boxdark dark:text-white'
                : 'text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark',
            ]"
          >
            Month
          </button>
        </div>
      </div>
    </div>
    <div>
      <div id="chartOne" class="-ml-5">
        <VueApexCharts
          type="area"
          height="350"
          :options="apexOptions"
          :series="chartData.series"
          ref="chart"
        />
      </div>
    </div>
  </div>
</template>
