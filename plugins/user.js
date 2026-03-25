export default function ({ $axios, $config, store }, inject) {
  const user = $axios.create({
    headers: {
      common: {
        Accept: 'application/json, text/plain, */*'
      }
    }
  })

  user.setBaseURL(($config && $config.userApiBaseUrl) || 'http://127.0.0.1:8000/user/')

  user.interceptors.request.use((config) => {
    const token = store && store.state && store.state.auth ? store.state.auth.token : null

    if (token) {
      config.headers.common.Authorization = `Bearer ${token}`
    }

    return config
  })

  user.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  )

  inject('user', user)
}
