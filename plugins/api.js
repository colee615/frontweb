export default function ({ $axios, $config, store }, inject) {
  const defaultHeaders = {
    Accept: 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest'
  }

  const api = $axios.create({ headers: { common: defaultHeaders } })

  const isServer = process.server
  const serverBaseUrl = ($config && $config.axios && $config.axios.baseURL) || $axios.defaults.baseURL
  const browserBaseUrl = ($config && ($config.apiBaseUrl || ($config.axios && $config.axios.browserBaseURL))) || $axios.defaults.baseURL
  const apiBaseUrl = (isServer ? serverBaseUrl : browserBaseUrl) || serverBaseUrl || browserBaseUrl

  const serverUserApiBaseUrl = serverBaseUrl ? String(serverBaseUrl).replace(/\/+$/, '') + '/user/' : ''
  const browserUserApiBaseUrl = ($config && $config.userApiBaseUrl) || (browserBaseUrl ? String(browserBaseUrl).replace(/\/+$/, '') + '/user/' : '')
  const userApiBaseUrl = (isServer ? serverUserApiBaseUrl : browserUserApiBaseUrl) || serverUserApiBaseUrl || browserUserApiBaseUrl || apiBaseUrl

  api.setBaseURL(apiBaseUrl)

  const userApi = $axios.create({ headers: { common: defaultHeaders } })

  userApi.setBaseURL(userApiBaseUrl)

  function normalizeDuplicatedFrontapi(config, baseUrl) {
    if (!config || typeof config.url !== 'string') {
      return config
    }

    const normalizedBase = String(baseUrl || '').replace(/\/+$/, '')
    const hasFrontapiBase = /\/frontapi$/i.test(normalizedBase)

    if (hasFrontapiBase && /^\/frontapi\//i.test(config.url)) {
      config.url = config.url.replace(/^\/frontapi/i, '')
    }

    return config
  }

  api.interceptors.request.use((config) => {
    normalizeDuplicatedFrontapi(config, apiBaseUrl)

    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  userApi.interceptors.request.use((config) => {
    normalizeDuplicatedFrontapi(config, userApiBaseUrl)

    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  inject('api', api)
  inject('userApi', userApi)
}
