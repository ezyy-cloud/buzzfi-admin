<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7"
  >
    <h4 class="mb-2 text-xl font-bold text-black dark:text-white">
      Access Points Locations
    </h4>
    <div
      ref="chartdiv"
      class="mapOne map-btn !h-90"
      style="width: 100%; height: 100%"
    ></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, ref } from "vue";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_zimbabwe from "@amcharts/amcharts5-geodata/zimbabweHigh";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default defineComponent({
  name: "MapChart",
  setup() {
    const chartdiv = ref(null);
    let root = null;

    const initChart = () => {
      root = am5.Root.new(chartdiv.value);
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
        })
      );

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_zimbabwe,
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        interactive: true,
      });

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x677935),
      });

      const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          autoScale: true,
        })
      );

      pointSeries.pushDataItem({ latitude: -17.8292, longitude: 31.0522 });

      pointSeries.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 5,
            fill: am5.color("#fff"),
          }),
        });
      });

      chart.zoomToGeoPoint({ latitude: -19.0154, longitude: 29.1549 }, 2);

      polygonSeries.appear(1000, 100);
      pointSeries.appear(1000, 100);
      chart.appear(1000, 100);
    };

    onMounted(() => {
      initChart();
    });

    onBeforeUnmount(() => {
      if (root) {
        root.dispose();
      }
    });

    return { chartdiv };
  },
});
</script>
