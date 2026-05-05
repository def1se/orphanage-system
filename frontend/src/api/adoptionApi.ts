import { publicApi } from './axiosClient'
import api from './axiosClient'

export const happyStoriesApi = {
  getAll: (params?: any) => publicApi.get('/adoptions/stories/public', { params }).then(r => r.data),
  getById: (id: string) => publicApi.get(`/adoptions/stories/${id}`).then(r => r.data),
  create: (data: any) => api.post('/adoptions/stories', data).then(r => r.data),
  update: (id: string, data: any) => api.put(`/adoptions/stories/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/adoptions/stories/${id}`),
}

export const adoptionRequestsApi = {
  create: (data: any) => api.post('/adoptions/requests', data).then(r => r.data),
  getMyRequests: () => api.get('/adoptions/requests/my').then(r => r.data),
  getAll: (params?: any) => api.get('/adoptions/requests', { params }).then(r => r.data),
  updateStatus: (id: number, status: string, comment: string) =>
    api.patch(`/adoptions/requests/${id}/status`, { status, adminComment: comment }).then(r => r.data),
  delete: (id: number) => api.delete(`/adoptions/requests/${id}`),
}
