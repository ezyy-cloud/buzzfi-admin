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
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markerGroup: L.LayerGroup | null = null;

// Function to validate coordinates
const validateCoordinates = (lat: number, lng: number): boolean => {
  // Zimbabwe's approximate bounding box
  const ZIMBABWE_BOUNDS = {
    minLat: -22.5,
    maxLat: -15.5,
    minLng: 25.0,
    maxLng: 33.0
  };

  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= ZIMBABWE_BOUNDS.minLat &&
    lat <= ZIMBABWE_BOUNDS.maxLat &&
    lng >= ZIMBABWE_BOUNDS.minLng &&
    lng <= ZIMBABWE_BOUNDS.maxLng
  );
};

const initMap = async () => {
  // Fetch sites data
  await sitesStore.fetchSites();

  if (!mapContainer.value) return;

  // Create map instance with no zoom control (we'll add it later)
  map = L.map(mapContainer.value, {
    zoomControl: false
  }).setView([-19.0154, 29.1549], 7);

  // Add dark OpenStreetMap tiles
  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
  }).addTo(map);

  // Add single zoom control in top-left
  L.control.zoom({
    position: 'topleft'
  }).addTo(map);

  // Create a layer group for markers
  markerGroup = L.layerGroup().addTo(map);

  // Process and add valid site points
  const validSites = sitesStore.sites
    .filter(site => site.coordinates)
    .map(site => {
      const [lat, lng] = site.coordinates!.split(',').map(coord => parseFloat(coord.trim()));
      
      if (validateCoordinates(lat, lng)) {
        return {
          latitude: lat,
          longitude: lng,
          title: site.name,
          address: site.address
        };
      }
      return null;
    })
    .filter((site): site is NonNullable<typeof site> => site !== null);

  // Create markers for each site
  const markers = validSites.map(site => {
    const marker = L.circleMarker([site.latitude, site.longitude], {
      radius: 8,
      fillColor: "#FF5353",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });

    marker.bindPopup(`
      <strong>${site.title}</strong>
      ${site.address ? `<br>${site.address}` : ''}
    `);

    return marker;
  });

  // Add markers to the layer group
  markers.forEach(marker => marker.addTo(markerGroup!));

  // Fit map bounds to show all markers
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), {
      padding: [50, 50]
    });
  }
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
