import api from './axiosClient'

export interface Child {
  id: number
  firstName: string
  lastName: string
  middleName?: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  status: 'ACTIVE' | 'UNDER_GUARDIANSHIP' | 'ADOPTED' | 'GRADUATED' | 'TRANSFERRED'
  admissionDate: string
  roomNumber?: string
  healthNotes?: string
  educationNotes?: string
  photoUrl?: string
  responsibleEducatorId?: number
  age: number
  createdAt: string
  updatedAt: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const childrenApi = {
  getPublicChildren: (page = 0, size = 10) =>
    api.get<Page<any>>('/children/public', { params: { page, size } }),

  getAll: (page = 0, size = 20) =>
    api.get<Page<Child>>('/children', { params: { page, size, sort: 'lastName' } }),

  getById: (id: number) => api.get<Child>(`/children/${id}`),

  getByStatus: (status: string, page = 0) =>
    api.get<Page<Child>>(`/children/status/${status}`, { params: { page } }),

  search: (q: string, page = 0) =>
    api.get<Page<Child>>('/children/search', { params: { q, page } }),

  create: (data: Omit<Child, 'id' | 'age' | 'createdAt' | 'updatedAt'>) =>
    api.post<Child>('/children', data),

  update: (id: number, data: Partial<Child>) =>
    api.put<Child>(`/children/${id}`, data),

  delete: (id: number) => api.delete(`/children/${id}`),
}
