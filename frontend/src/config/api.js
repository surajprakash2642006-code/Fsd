const isLocalDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

const productionBackendUrl = 'https://fsd-hqeo.onrender.com'
const localBackendUrl = 'http://localhost:5000'

const isLocalUrl = (url) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?=\/|$)/i.test(url)
const configuredApiUrl = import.meta.env.VITE_API_URL
const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL
const normalizeApiUrl = (url) => {
  const baseUrl = url.trim().replace(/\/+$/, '')
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`
}

export const API_BASE_URL =
  (configuredApiUrl && (isLocalDevelopment || !isLocalUrl(configuredApiUrl))
    ? normalizeApiUrl(configuredApiUrl)
    : normalizeApiUrl(isLocalDevelopment ? localBackendUrl : productionBackendUrl))

export const SOCKET_URL =
  (configuredSocketUrl && (isLocalDevelopment || !isLocalUrl(configuredSocketUrl))
    ? configuredSocketUrl
    : isLocalDevelopment
      ? localBackendUrl
      : productionBackendUrl)
