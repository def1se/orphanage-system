import { publicApi } from './axiosClient'
import api from './axiosClient'

export const shelterNeedsApi = {
  getAll: (params?: any) => publicApi.get('/inventory/needs', { params }).then(r => r.data),
  create: (data: any) => api.post('/inventory/needs', data).then(r => r.data),
  update: (id: number, data: any) => api.put(`/inventory/needs/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/inventory/needs/${id}`),
}

export const donationsApi = {
  create: (data: any) => api.post('/inventory/donations', data).then(r => r.data),
  getAll: (params?: any) => api.get('/inventory/donations', { params }).then(r => r.data),
  getStats: () => api.get('/inventory/donations/stats').then(r => r.data),
}

export const materialHelpApi = {
  create: (data: any) => api.post('/inventory/material-help', data).then(r => r.data),
  getAll: (params?: any) => api.get('/inventory/material-help', { params }).then(r => r.data),
}
