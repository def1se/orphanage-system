import { createStore } from './localStorage'

export interface MaterialOrder {
  id: number | string
  userId: string
  userName: string
  userEmail: string
  items: { itemName: string; quantity: number; price: number }[]
  totalAmount: number
  deliveryMethod: 'DELIVERY' | 'SELF'
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'
  address?: string
  createdAt: string
}

export const materialOrdersStore = createStore<MaterialOrder>('material_orders', [])
