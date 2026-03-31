require('dotenv').config()

const DEV_API_BASE_URL = 'http://127.0.0.1:8000'
const API_BASE_URL = (process.env.API_BASE_URL || (process.env.NODE_ENV === 'development' ? DEV_API_BASE_URL : '')).replace(/\/+$/, '')
const USER_API_BASE_URL = ((process.env.USER_API_BASE_URL || `${API_BASE_URL}/user`) || '/user').replace(/\/?$/, '/')
const TRACKING_BASE_URL = (process.env.TRACKING_BASE_URL || 'https://trackingbo.correos.gob.bo:8100').replace(/\/+$/, '')
const CONNECT_SRC = ["'self'"]
const IMG_SRC = ["'self'", 'data:', 'https:']
const MEDIA_SRC = ["'self'", 'https:']
const SCRIPT_SRC = process.env.NODE_ENV === 'development'
  ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
  : ["'self'", "'unsafe-inline'"]
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

if (/^https?:\/\//i.test(API_BASE_URL)) {
  CONNECT_SRC.push(API_BASE_URL)
  IMG_SRC.push(API_BASE_URL)
  MEDIA_SRC.push(API_BASE_URL)
}

if (/^https?:\/\//i.test(TRACKING_BASE_URL)) {
  CONNECT_SRC.push(TRACKING_BASE_URL)
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
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api.js'
  ],

  publicRuntimeConfig: {
    apiBaseUrl: API_BASE_URL,
    userApiBaseUrl: USER_API_BASE_URL,
    trackingBaseUrl: TRACKING_BASE_URL,
    axios: {
      browserBaseURL: API_BASE_URL || '/',
      baseURL: API_BASE_URL || '/'
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
    baseURL: API_BASE_URL || '/',
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
