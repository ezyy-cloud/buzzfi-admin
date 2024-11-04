import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface Site {
  id: number;
  name: string;                      // Name of the site
  description?: string;              // Optional description of the site
  coordinates?: string;              // Coordinates in format "lat,lng" if using as a single field
  address?: string;                  // Street address of the site
  city?: string;                     // City where the site is located
  province?: string;                 // Province/region of the site
  country?: string;                  // Country of the site
  type?: string;                     // Type or category, e.g., "commercial", "residential"
  contactPhone?: string;             // Contact phone number for the site
  status?: string | boolean;         // Status of the site; could be a string or boolean, depending on usage
  capacity?: number;                 // Capacity or size of the site
}

export const useSitesStore = defineStore('sites', {
  state: () => ({
    sites: [] as Site[],
    loading: false,
    site: {} as Site | null,
    error: null,
  }),
  actions: {
    async fetchSites() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/sites`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.sites = response.data; // Assign the fetched sites to the state
        return this.sites;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch sites';
      } finally {
        this.loading = false;
      }
    },

    async addSite(site: Site) {
      console.log(site)
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_URL}/sites`, site, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });

        this.sites.push(response.data); // Add the new site to the state
        return "success"; // Return success if the site was added successfully
      } catch (err: any) {
        this.error = err.response?.data || 'Failed to add site';
        return this.error; // Return the error message if the operation failed
      } finally {
        this.loading = false;
      }
    },

    async updateSite(updateSite: Site) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_URL}/sites/${updateSite.id}`, updateSite, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });

        const index = this.sites.findIndex((site: { id: number }) => site.id === updateSite.id);
        if (index !== -1) {
          this.sites[index] = response.data; // Update the site in the state
        }
        return "success"; // Return success if the site was added successfully
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update site';
      } finally {
        this.loading = false;
      }
    },

    async fetchSiteById(siteId: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/sites/${siteId}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.site = response.data;
        return this.site;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch site';
      } finally {
        this.loading = false;
      }
    },

    async deleteSite(siteId: number) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/sites/${siteId}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.sites = this.sites.filter((site) => site.id !== siteId); // Remove the site from the state
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete site';
      } finally {
        this.loading = false;
      }
    },
  },
});
