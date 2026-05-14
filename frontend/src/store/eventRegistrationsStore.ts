import { createStore } from './localStorage'

/**
 * Регистрации на мероприятия хранятся в localStorage.
 * Ключ: 'event_registrations'
 */
export interface EventRegistration {
  id: number
  eventId: number
  userId: string
  name: string
  email: string
  phone: string
  notes: string
  registeredAt: string
  eventTitle?: string
}

export const eventRegistrationsStore = createStore<EventRegistration>('event_registrations', [])
