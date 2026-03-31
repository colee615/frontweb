export default function ({ $axios, $config, store }, inject) {
  const defaultHeaders = {
    Accept: 'application/json, text/plain, */*',
    'X-Requested-With': 'XMLHttpRequest'
  }

  const api = $axios.create({ headers: { common: defaultHeaders } })

  const apiBaseUrl = ($config && $config.apiBaseUrl) || $axios.defaults.baseURL
  const userApiBaseUrl = ($config && $config.userApiBaseUrl) || apiBaseUrl

  api.setBaseURL(apiBaseUrl)

  const userApi = $axios.create({ headers: { common: defaultHeaders } })

  userApi.setBaseURL(userApiBaseUrl)

  api.interceptors.request.use((config) => {
    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  userApi.interceptors.request.use((config) => {
    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  inject('api', api)
  inject('userApi', userApi)
}
