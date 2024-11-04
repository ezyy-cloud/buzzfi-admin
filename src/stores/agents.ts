import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface Agent {
  id: number;
  name: string;
  email: string;
  contactPhone?: string | null;
  role?: string | null;
  active?: boolean;
  site?: string | null;
}

export const useAgentsStore = defineStore('agents', {
  state: () => ({
    agents: [] as Agent[],
    loading: false,
    error: null,
  }),
  actions: {

    async fetchAgents() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.agents = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch agents';
      } finally {
        this.loading = false;
      }
    },

    async addAgent(agent: { name: string; email: string; password: string; password_confirmation: string; contactPhone?: string; role?: string; active?: boolean; site?: string }) {
      console.log(agent);
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/users`, agent, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        
        this.agents.push(response.data); // Add the new agent to the state
        return "success"; // Return success if the agent was added successfully
        
      } catch (err: any) {
        this.error = err.response?.data || 'Failed to add agent';
        return this.error; // Return the error message if the operation failed
        
      } finally {
        this.loading = false;
      }
    },
    
    async updateAgent(updateAgent: { id: number; name?: string; email?: string; password?: string; contactPhone?: string; role?: string; active?: boolean; site?: string }) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(
          `${API_URL}/users/${updateAgent.id}`,
          updateAgent,
          {
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
            },
          }
        );
        // Update agent in state only if response is successful and data is returned
        if (response.data) {
          const index = this.agents.findIndex((agent: { id: number }) => agent.id === updateAgent.id);
          if (index !== -1) {
            this.agents[index] = response.data.user; // Replace agent data with updated response
            return "success"; // Return success if the agent was updated successfully
          } else {
            console.warn(`Agent with ID ${updateAgent.id} not found in state.`);
          }
        }
      } catch (err: any) {
        // Log full error details for debugging
        console.error("Error updating agent:", err);
        this.error = err.response?.data?.message || "Failed to update agent";
      } finally {
        this.loading = false;
      }
    },

    async deleteAgent(agentId: number) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`${API_URL}/users/${agentId}`, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.agents = this.agents.filter((agent) => agent.id !== agentId); // Remove the agent from the state
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to delete agent';
      } finally {
        this.loading = false;
      }
    },
  },
});
