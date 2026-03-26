export default function ({ $axios, $config, store }, inject) {
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    }
  })

  const apiBaseUrl = ($config && $config.apiBaseUrl) || $axios.defaults.baseURL
  const userApiBaseUrl = ($config && $config.userApiBaseUrl) || apiBaseUrl

  api.setBaseURL(apiBaseUrl)

  const userApi = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    }
  })

  userApi.setBaseURL(userApiBaseUrl)

  api.interceptors.request.use((config) => {
    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  })

  userApi.interceptors.request.use((config) => {
    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  })

  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  )

  userApi.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  )

  inject('api', api)
  inject('userApi', userApi)
}
