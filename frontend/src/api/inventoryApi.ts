import api from './axiosClient'

export interface InventoryItem {
  id: number
  name: string
  description?: string
  category: 'FOOD' | 'MEDICINE' | 'CLOTHING' | 'FURNITURE' | 'EDUCATIONAL' | 'HYGIENE' | 'SPORTS' | 'DONATION' | 'OTHER'
  quantity: number
  unit?: string
  minQuantity?: number
  unitPrice?: number
  expiryDate?: string
  supplier?: string
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'WRITTEN_OFF'
  isLowStock: boolean
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
}

export const inventoryApi = {
  getAll: (page = 0) => api.get<Page<InventoryItem>>('/inventory', { params: { page } }),

  getById: (id: number) => api.get<InventoryItem>(`/inventory/${id}`),

  getLowStock: () => api.get<InventoryItem[]>('/inventory/low-stock'),

  getByCategory: (category: string, page = 0) =>
    api.get<Page<InventoryItem>>(`/inventory/category/${category}`, { params: { page } }),

  create: (data: Omit<InventoryItem, 'id' | 'isLowStock'>) =>
    api.post<InventoryItem>('/inventory', data),

  update: (id: number, data: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/inventory/${id}`, data),

  adjustQuantity: (id: number, delta: number) =>
    api.patch<InventoryItem>(`/inventory/${id}/quantity`, null, { params: { delta } }),

  delete: (id: number) => api.delete(`/inventory/${id}`),
}
