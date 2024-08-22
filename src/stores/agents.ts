import { defineStore } from 'pinia';
import axios from 'axios';
import { API_URL, TOKEN } from '@/config';

interface Agent {
  id: number;
  name: string;
  email: string;
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

    async addAgent(agent: {name: string, email: string, password: string, password_confirmation: string}) {
      console.log(agent)
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/users`, agent, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        this.agents.push(response.data); // Add the new agent to the state
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to add agent';
      } finally {
        this.loading = false;
      }
    },

    async updateAgent(updateAgent: {id: number, name: string, email: string, password: string}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`${API_URL}/users/${updateAgent.id}`, updateAgent, {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        });
        const index = this.agents.findIndex((agent: {id: number}) => agent.id === updateAgent.id);
        if (index !== -1) {
          this.agents[index] = response.data; // Update the agent in the state
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to update agent';
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