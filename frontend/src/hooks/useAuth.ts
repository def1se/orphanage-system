import { useState, useEffect } from 'react'
import keycloak from '../keycloak'

/**
 * Реактивный хук для отслеживания состояния аутентификации Keycloak.
 * Стандартный `keycloak.authenticated` — это простой геттер, который
 * не триггерит React-рендер. Этот хук исправляет это поведение.
 */
export function useAuth() {
  const [isAuth, setIsAuth] = useState(!!keycloak.authenticated)
  const [ready, setReady] = useState(!!keycloak.authenticated)

  useEffect(() => {
    setIsAuth(!!keycloak.authenticated)
    setReady(true)

    const onAuthSuccess = () => { setIsAuth(true); setReady(true) }
    const onAuthLogout = () => setIsAuth(false)
    const onReady = () => { setIsAuth(!!keycloak.authenticated); setReady(true) }

    keycloak.onAuthSuccess = onAuthSuccess
    keycloak.onAuthLogout = onAuthLogout
    keycloak.onReady = onReady

    return () => {
      if (keycloak.onAuthSuccess === onAuthSuccess) keycloak.onAuthSuccess = undefined
      if (keycloak.onAuthLogout === onAuthLogout) keycloak.onAuthLogout = undefined
      if (keycloak.onReady === onReady) keycloak.onReady = undefined
    }
  }, [])

  const parsed = keycloak.tokenParsed as any

  return {
    isAuth,
    ready,
    keycloak,
    parsed,
    username: parsed?.preferred_username ?? '',
    email: parsed?.email ?? '',
    name: parsed?.name ?? parsed?.preferred_username ?? '',
    roles: (parsed?.realm_access?.roles ?? []) as string[],
    userId: parsed?.sub ?? '',
    login: () => keycloak.login(),
    logout: () => keycloak.logout({ redirectUri: window.location.origin }),
    register: () => keycloak.register(),
  }
}
