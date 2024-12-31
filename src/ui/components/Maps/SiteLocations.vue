<template>
  <div
    class="col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7"
    style="min-height: 500px"
  >
    <h4 class="mb-2 text-xl font-bold text-black dark:text-white">
      Site Locations
    </h4>
    <div
      ref="mapContainer"
      style="width: 100%; height: calc(100% - 40px); min-height: 450px"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useSitesStore } from "@/stores/sites";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const sitesStore = useSitesStore();
const mapContainer = ref(null);
let map: L.Map | null = null;
let markerGroup: L.LayerGroup | null = null;

const initMap = () => {
  if (!mapContainer.value) return;
  
  map = L.map(mapContainer.value).setView([-19.0154, 29.1549], 7); // Zimbabwe center coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors'
  }).addTo(map);

  // Initialize marker group
  markerGroup = L.layerGroup();
  if (map) {
    markerGroup.addTo(map);
  }

  // Add markers for each site
  sitesStore.sites.forEach(site => {
    if (site.coordinates) {
      const [lat, lng] = site.coordinates.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: "#FF5353",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });

        marker.bindPopup(`
          <strong>${site.name}</strong>
          ${site.address ? `<br>${site.address}` : ''}
        `);

        if (markerGroup) {
          marker.addTo(markerGroup);
        }
      }
    }
  });
};

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
    map = null;
    markerGroup = null;
  }
});
</script>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 4px;
  padding: 2px;
  background: #1e1e1e;
  color: #fff;
}

.leaflet-popup-content {
  margin: 8px 10px;
  line-height: 1.4;
}

.leaflet-popup-tip {
  background: #1e1e1e;
}

.leaflet-container {
  font-family: inherit;
  background: #242424;
}

/* Custom zoom control styling */
.leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3) !important;
}

.leaflet-control-zoom a {
  background-color: #1e1e1e !important;
  color: #fff !important;
  border: 1px solid #333 !important;
}

.leaflet-control-zoom a:hover {
  background-color: #333 !important;
}

.leaflet-control-zoom-in {
  border-bottom: 1px solid #333 !important;
}

/* Attribution styling */
.leaflet-control-attribution {
  background: #1e1e1e !important;
  color: #666 !important;
}

.leaflet-control-attribution a {
  color: #888 !important;
}
</style>
