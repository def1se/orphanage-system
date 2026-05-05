import axios from 'axios'
import keycloak from '../keycloak'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Добавляем Bearer токен к каждому запросу
api.interceptors.request.use((config) => {
  if (keycloak.token) {
    config.headers.Authorization = `Bearer ${keycloak.token}`
  }
  return config
})

// При 401 — пробуем обновить токен, иначе редиректим на логин
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await keycloak.updateToken(30)
        return api.request(error.config)
      } catch {
        keycloak.login()
      }
    }
    return Promise.reject(error)
  }
)

export default api
