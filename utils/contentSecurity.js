const ASSET_KEYS = new Set([
  'logo_url',
  'background_image',
  'iconImage',
  'image',
  'media_url',
  'src',
  'poster',
  'poster_image',
  'seal_logo'
])

const LINK_KEYS = new Set([
  'url',
  'app_store_url',
  'play_store_url',
  'view_all_url',
  'primary_button_url',
  'secondary_button_url'
])

const COLOR_KEYS = new Set([
  'primary_color',
  'secondary_color',
  'accent_color'
])

export function sanitizeAssetUrl(value) {
  return resolveAssetUrl(sanitizeUrl(value, { allowStorage: true, allowContact: false }))
}

export function sanitizeLinkUrl(value) {
  return sanitizeUrl(value, { allowStorage: false, allowContact: true })
}

export function sanitizeHexColor(value) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(normalized) ? normalized : null
}

export function sanitizeContentTree(input) {
  if (!input || typeof input !== 'object') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeContentTree(item))
  }

  return Object.keys(input).reduce((accumulator, key) => {
    const value = input[key]

    if (value && typeof value === 'object') {
      accumulator[key] = sanitizeContentTree(value)
      return accumulator
    }

    if (ASSET_KEYS.has(key)) {
      accumulator[key] = sanitizeAssetUrl(value)
      return accumulator
    }

    if (LINK_KEYS.has(key)) {
      accumulator[key] = sanitizeLinkUrl(value) || '#'
      return accumulator
    }

    if (COLOR_KEYS.has(key)) {
      accumulator[key] = sanitizeHexColor(value)
      return accumulator
    }

    accumulator[key] = value
    return accumulator
  }, {})
}

function sanitizeUrl(value, { allowStorage, allowContact }) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!normalized) {
    return null
  }

  if (normalized === '#') {
    return normalized
  }

  if (/^(javascript|data|vbscript):/i.test(normalized)) {
    return null
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized
  }

  if (allowStorage && /^\/?storage\//i.test(normalized.replace(/^\/+/, ''))) {
    return normalized.startsWith('/') ? normalized : `/${normalized}`
  }

  if (normalized.startsWith('/')) {
    return normalized
  }

  if (allowContact && /^(mailto|tel):/i.test(normalized)) {
    return normalized
  }

  return null
}

function resolveAssetUrl(value) {
  if (!value) {
    return value
  }

  const runtimeApiBaseUrl = getRuntimeApiBaseUrl()
  const runtimeStorageBaseUrl = getRuntimeStorageBaseUrl() || runtimeApiBaseUrl

  if (/^\/frontstorage\/storage\//i.test(value)) {
    return value.replace(/^\/frontstorage\/storage\//i, '/frontstorage/')
  }

  if (/^\/storage\//i.test(value) && runtimeStorageBaseUrl) {
    return `${runtimeStorageBaseUrl}${value.replace(/^\/storage/i, '')}`
  }

  if (/^http:\/\//i.test(value)) {
    const upgraded = upgradeHttpAssetUrl(value, runtimeApiBaseUrl, runtimeStorageBaseUrl)
    return upgraded || value
  }

  if (/^https?:\/\//i.test(value)) {
    const rewritten = remapAbsoluteStorageUrl(value, runtimeStorageBaseUrl)
    return rewritten || value
  }

  return value
}

function getRuntimeApiBaseUrl() {
  if (typeof window === 'undefined') {
    return ''
  }

  const nuxtConfig = window.__NUXT__ && window.__NUXT__.config
  const apiBaseUrl = nuxtConfig && typeof nuxtConfig.apiBaseUrl === 'string'
    ? nuxtConfig.apiBaseUrl.trim().replace(/\/+$/, '')
    : ''

  return /^https?:\/\//i.test(apiBaseUrl) ? apiBaseUrl : ''
}

function getRuntimeStorageBaseUrl() {
  if (typeof window === 'undefined') {
    return ''
  }

  const nuxtConfig = window.__NUXT__ && window.__NUXT__.config
  const storageBaseUrl = nuxtConfig && typeof nuxtConfig.storageBaseUrl === 'string'
    ? nuxtConfig.storageBaseUrl.trim().replace(/\/+$/, '')
    : ''

  if (!storageBaseUrl) {
    return ''
  }

  if (storageBaseUrl.startsWith('/')) {
    return storageBaseUrl
  }

  return /^https?:\/\//i.test(storageBaseUrl) ? storageBaseUrl : ''
}

function upgradeHttpAssetUrl(value, runtimeApiBaseUrl, runtimeStorageBaseUrl) {
  if (typeof window === 'undefined' || window.location.protocol !== 'https:') {
    return null
  }

  try {
    const assetUrl = new URL(value)
    const currentUrl = new URL(window.location.href)
    const apiUrl = runtimeApiBaseUrl ? new URL(runtimeApiBaseUrl) : null

    const isSameCurrentHost = assetUrl.hostname === currentUrl.hostname
    const isSameApiHost = apiUrl ? assetUrl.hostname === apiUrl.hostname : false

    if (!isSameCurrentHost && !isSameApiHost) {
      return null
    }

    if (/^\/storage\//i.test(assetUrl.pathname) && runtimeStorageBaseUrl) {
      return `${runtimeStorageBaseUrl}${assetUrl.pathname.replace(/^\/storage/i, '')}${assetUrl.search || ''}`
    }

    assetUrl.protocol = 'https:'
    return assetUrl.toString()
  } catch (error) {
    return null
  }
}

function remapAbsoluteStorageUrl(value, runtimeStorageBaseUrl) {
  if (!runtimeStorageBaseUrl) {
    return null
  }

  try {
    const parsed = new URL(value)

    if (!/^\/storage\//i.test(parsed.pathname)) {
      return null
    }

    return `${runtimeStorageBaseUrl}${parsed.pathname.replace(/^\/storage/i, '')}${parsed.search || ''}`
  } catch (error) {
    return null
  }
}
