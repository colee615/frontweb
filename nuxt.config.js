require('dotenv').config()

const DEV_API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = normalizeBaseUrl(process.env.API_BASE_URL || (process.env.NODE_ENV === 'development' ? '/frontapi' : '/frontapi'))
const INTERNAL_API_BASE_URL = normalizeBaseUrl(process.env.INTERNAL_API_BASE_URL || DEV_API_BASE_URL)
const STORAGE_PROXY_BASE_URL = normalizeBaseUrl(process.env.STORAGE_PROXY_BASE_URL || INTERNAL_API_BASE_URL)
const USER_API_BASE_URL = ((process.env.USER_API_BASE_URL || `${API_BASE_URL}/user`) || '/user').replace(/\/?$/, '/')
const TRACKING_BASE_URL = (process.env.TRACKING_BASE_URL || 'https://trackingbo.correos.gob.bo:8100').replace(/\/+$/, '')
const POSTAL_CALCULATOR_API_URL = (process.env.POSTAL_CALCULATOR_API_URL || 'https://postar.correos.gob.bo:8104/api/calcular').replace(/\/+$/, '')
const CONNECT_SRC = ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com', 'https://www.googletagmanager.com']
const IMG_SRC = ["'self'", 'data:', 'https:']
const MEDIA_SRC = ["'self'", 'https:']
const SCRIPT_SRC = process.env.NODE_ENV === 'development'
  ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.googletagmanager.com']
  : ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com']
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

if (/^https?:\/\//i.test(API_BASE_URL)) {
  CONNECT_SRC.push(API_BASE_URL)
  IMG_SRC.push(API_BASE_URL)
  MEDIA_SRC.push(API_BASE_URL)
}

if (/^https?:\/\//i.test(TRACKING_BASE_URL)) {
  CONNECT_SRC.push(TRACKING_BASE_URL)
}

if (/^https?:\/\//i.test(POSTAL_CALCULATOR_API_URL)) {
  CONNECT_SRC.push(getOrigin(POSTAL_CALCULATOR_API_URL))
}

if (process.env.NODE_ENV === 'development') {
  IMG_SRC.push('http:')
  MEDIA_SRC.push('http:')
}

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Correos de Bolivia',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'referrer', name: 'referrer', content: 'strict-origin-when-cross-origin' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-0B0GGX8RWH'
      },
      {
        hid: 'gtag-config',
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0B0GGX8RWH');
        `,
        type: 'text/javascript'
      }
    ],
    __dangerouslyDisableSanitizersByTagID: {
      'gtag-config': ['innerHTML']
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.js'
  ],

  serverMiddleware: [
    { path: '/api/calculator', handler: '~/server-middleware/calculator.js' },
    { path: '/frontapi', handler: '~/server-middleware/frontapiProxy.js' },
    { path: '/frontstorage', handler: '~/server-middleware/frontstorageProxy.js' }
  ],

  publicRuntimeConfig: {
    apiBaseUrl: API_BASE_URL,
    internalApiBaseUrl: INTERNAL_API_BASE_URL,
    storageBaseUrl: '/frontstorage',
    userApiBaseUrl: USER_API_BASE_URL,
    trackingBaseUrl: TRACKING_BASE_URL,
    postalCalculatorApiUrl: POSTAL_CALCULATOR_API_URL,
    axios: {
      browserBaseURL: API_BASE_URL || '/',
      baseURL: INTERNAL_API_BASE_URL || API_BASE_URL || '/'
    }
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
  ],

  axios: {
    baseURL: INTERNAL_API_BASE_URL || API_BASE_URL || '/',
    browserBaseURL: API_BASE_URL || '/',
    timeout: 15000
  },

  render: {
    csp: IS_DEVELOPMENT
      ? false
      : {
          hashAlgorithm: 'sha256',
          policies: {
            'default-src': ["'self'"],
            'base-uri': ["'self'"],
            'frame-ancestors': ["'none'"],
            'object-src': ["'none'"],
            'img-src': IMG_SRC,
            'media-src': MEDIA_SRC,
            'font-src': ["'self'", 'data:', 'https:'],
            'style-src': ["'self'", "'unsafe-inline'", 'https:'],
            'script-src': SCRIPT_SRC,
            'connect-src': CONNECT_SRC
          }
        }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}

function getOrigin(url) {
  try {
    return new URL(url).origin
  } catch (error) {
    return url
  }
}

function normalizeBaseUrl(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (trimmed.startsWith('/')) {
    return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}`
  }

  return trimmed.replace(/\/+$/, '')
}
