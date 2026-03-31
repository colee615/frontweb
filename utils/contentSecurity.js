const ASSET_KEYS = new Set([
  'logo_url',
  'background_image',
  'iconImage',
  'image',
  'src',
  'poster',
  'poster_image'
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
  return sanitizeUrl(value, { allowStorage: true, allowContact: false })
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
