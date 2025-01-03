import { defineStore } from 'pinia'

export const useLinkStore = defineStore('links', {
  state: () => ({
    links: [],
    displayMode: 1, // 1: 随机, 2: 按月, 3: 按周, 4: 按节日
    holidayRange: 3, // 节日范围天数
  }),
  
  actions: {
    async addLink(link) {
      const response = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify(link)
      })
      if (response.ok) {
        this.links.push(await response.json())
      }
    },
    
    async deleteLink(id) {
      const response = await fetch(`/api/links/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        this.links = this.links.filter(link => link.id !== id)
      }
    },
    
    async updateDisplayMode(mode) {
      const response = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify({ displayMode: mode })
      })
      if (response.ok) {
        this.displayMode = mode
      }
    }
  }
}) 