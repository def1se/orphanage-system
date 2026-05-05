/**
 * Простой localStorage store с подпиской на изменения.
 * Используется как временное хранилище пока бэкенд в разработке.
 */

export function lsGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function lsSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

/** Создать хуки CRUD для конкретного ключа */
export function createStore<T extends { id: number | string }>(key: string, initial: T[]) {
  const getAll = (): T[] => lsGet<T[]>(key, initial)
  const save = (items: T[]) => lsSet(key, items)

  const add = (item: Omit<T, 'id'> & { id?: number | string }): T => {
    const items = getAll()
    const newItem = { ...item, id: item.id ?? Date.now() } as T
    save([...items, newItem])
    return newItem
  }

  const update = (id: number | string, patch: Partial<T>): T | null => {
    const items = getAll()
    let updated: T | null = null
    const next = items.map(i => {
      if (i.id === id) { updated = { ...i, ...patch } as T; return updated }
      return i
    })
    save(next)
    return updated
  }

  const remove = (id: number | string) => {
    save(getAll().filter(i => i.id !== id))
  }

  return { getAll, add, update, remove, save }
}
