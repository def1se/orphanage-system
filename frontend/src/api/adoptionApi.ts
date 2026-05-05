import api from './axiosClient'

export interface AdoptionRequest {
  id: number
  childId: number
  applicantFirstName: string
  applicantLastName: string
  applicantMiddleName?: string
  applicantPhone?: string
  applicantEmail?: string
  requestType: 'ADOPTION' | 'GUARDIANSHIP' | 'FOSTER_CARE'
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'WITHDRAWN'
  submissionDate: string
  decisionDate?: string
  notes?: string
  curatorStaffId?: number
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
}

export const adoptionApi = {
  getAll: (page = 0) => api.get<Page<AdoptionRequest>>('/adoptions', { params: { page } }),

  getById: (id: number) => api.get<AdoptionRequest>(`/adoptions/${id}`),

  getByStatus: (status: string, page = 0) =>
    api.get<Page<AdoptionRequest>>(`/adoptions/status/${status}`, { params: { page } }),

  create: (data: Omit<AdoptionRequest, 'id'>) => api.post<AdoptionRequest>('/adoptions', data),

  updateStatus: (id: number, status: string) =>
    api.patch<AdoptionRequest>(`/adoptions/${id}/status`, null, { params: { status } }),

  update: (id: number, data: Partial<AdoptionRequest>) =>
    api.put<AdoptionRequest>(`/adoptions/${id}`, data),

  delete: (id: number) => api.delete(`/adoptions/${id}`),

  submitApplication: (data: any) => api.post('/adoptions/applications', data),
  getMyApplications: () => api.get<any[]>('/adoptions/applications/my'),
}
