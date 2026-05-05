import api from './axiosClient'

export interface StaffMember {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  position: string
  phone?: string
  email?: string
  hireDate: string
  status: 'ACTIVE' | 'ON_LEAVE' | 'DISMISSED'
  notes?: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
}

export const staffApi = {
  getAll: (page = 0, size = 20) =>
    api.get<Page<StaffMember>>('/staff', { params: { page, size } }),

  getById: (id: number) => api.get<StaffMember>(`/staff/${id}`),

  getByPosition: (position: string, page = 0) =>
    api.get<Page<StaffMember>>(`/staff/position/${position}`, { params: { page } }),

  create: (data: Omit<StaffMember, 'id'>) => api.post<StaffMember>('/staff', data),

  update: (id: number, data: Partial<StaffMember>) =>
    api.put<StaffMember>(`/staff/${id}`, data),

  delete: (id: number) => api.delete(`/staff/${id}`),
  
  getEvents: () => api.get<any[]>('/staff/events'),
  registerForEvent: (eventId: number, data: { name: string, email: string }) => api.post(`/staff/events/${eventId}/register`, data),
  downloadEventsPdf: () => api.get('/staff/events/report/pdf', { responseType: 'blob' }),
}
