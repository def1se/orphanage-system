import { publicApi } from './axiosClient'
import api from './axiosClient'

export const eventsApi = {
  getAll: () => publicApi.get('/staff/events').then(r => r.data),
  getById: (id: number) => publicApi.get(`/staff/events/${id}`).then(r => r.data),
  register: (eventId: number, data: { name: string; email: string; phone?: string; notes?: string }) =>
    publicApi.post(`/staff/events/${eventId}/register`, data).then(r => r.data),
  create: (data: any) => api.post('/staff/events', data).then(r => r.data),
  update: (id: number, data: any) => api.put(`/staff/events/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/staff/events/${id}`),
  getPdfReport: () => api.get('/staff/events/report/pdf', { responseType: 'blob' }).then(r => r.data),
}

export const articlesApi = {
  getPublished: (params?: any) => publicApi.get('/staff/articles/public', { params }).then(r => r.data),
  getLatest: () => publicApi.get('/staff/articles/public/latest').then(r => r.data),
  getById: (id: number) => publicApi.get(`/staff/articles/${id}`).then(r => r.data),
  getAll: (params?: any) => api.get('/staff/articles', { params }).then(r => r.data),
  create: (data: any) => api.post('/staff/articles', data).then(r => r.data),
  update: (id: number, data: any) => api.put(`/staff/articles/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/staff/articles/${id}`),
}

export const volunteersApi = {
  apply: (data: any) => api.post('/staff/volunteers', data).then(r => r.data),
  getAll: (params?: any) => api.get('/staff/volunteers', { params }).then(r => r.data),
  updateStatus: (id: number, status: string) => api.patch(`/staff/volunteers/${id}/status`, { status }).then(r => r.data),
  delete: (id: number) => api.delete(`/staff/volunteers/${id}`),
}

export const usersApi = {
  getAll: (params?: any) => api.get('/staff/users', { params }).then(r => r.data),
  getById: (id: string) => api.get(`/staff/users/${id}`).then(r => r.data),
  update: (id: string, data: any) => api.put(`/staff/users/${id}`, data).then(r => r.data),
  updateRole: (id: string, role: string) => api.patch(`/staff/users/${id}/role`, { role }).then(r => r.data),
  delete: (id: string) => api.delete(`/staff/users/${id}`),
}
