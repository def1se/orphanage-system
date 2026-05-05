import { publicApi } from './axiosClient'
import api from './axiosClient'

export const childrenApi = {
  getPublic: (params?: any) => publicApi.get('/children/public', { params }).then(r => r.data),
  getAll: (params?: any) => api.get('/children', { params }).then(r => r.data),
  getById: (id: number) => api.get(`/children/${id}`).then(r => r.data),
  search: (q: string) => publicApi.get('/children/search', { params: { q } }).then(r => r.data),
  create: (data: any) => api.post('/children', data).then(r => r.data),
  update: (id: number, data: any) => api.put(`/children/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/children/${id}`),
  getMedicalRecords: (childId: number) => api.get(`/children/${childId}/medical-records`).then(r => r.data),
  addMedicalRecord: (childId: number, data: any) => api.post(`/children/${childId}/medical-records`, data).then(r => r.data),
}
