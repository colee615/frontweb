const VISITOR_KEY = 'cb_analytics_visitor'
const SESSION_KEY = 'cb_analytics_session'

function createToken(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function getOrCreateStorageValue(storage, key, prefix) {
  try {
    const currentValue = storage.getItem(key)

    if (currentValue) {
      return currentValue
    }

    const newValue = createToken(prefix)
    storage.setItem(key, newValue)
    return newValue
  } catch (error) {
    return createToken(prefix)
  }
}

function normalizeText(value, max = 255) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.replace(/\s+/g, ' ').trim().slice(0, max)
}

function normalizePath(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  }

  return value.trim().slice(0, 255)
}

export default ({ app }, inject) => {
  if (!process.client) {
    inject('analytics', {
      track() {},
      trackTrackingSearch() {},
      trackCalculatorQuote() {}
    })
    return
  }

  const runtimeBase = (app.$config && (app.$config.apiBaseUrl || (app.$config.axios && app.$config.axios.browserBaseURL))) || '/frontapi'
  const analyticsEndpoint = `${String(runtimeBase).replace(/\/+$/, '')}/api/analytics/collect`
  const visitorToken = getOrCreateStorageValue(window.localStorage, VISITOR_KEY, 'visitor')
  const sessionToken = getOrCreateStorageValue(window.sessionStorage, SESSION_KEY, 'session')
  let lastTrackedPath = ''

  const api = {
    track,
    trackTrackingSearch,
    trackCalculatorQuote
  }

  inject('analytics', api)

  function track(eventName, payload = {}) {
    const body = {
      visitor_token: visitorToken,
      session_token: sessionToken,
      event_name: eventName,
      page_path: normalizePath(payload.pagePath || (app.router && app.router.currentRoute && app.router.currentRoute.fullPath) || window.location.pathname),
      page_name: normalizeText(payload.pageName || document.title, 255),
      section_key: normalizeText(payload.sectionKey || '', 120) || null,
      label: normalizeText(payload.label || '', 255) || null,
      searched_term: normalizeText(payload.searchedTerm || '', 160) || null,
      referrer: normalizeText(document.referrer || '', 2000) || null,
      metadata: payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : null
    }

    return window.fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      keepalive: eventName === 'heartbeat' || eventName === 'cta_click',
      body: JSON.stringify(body)
    }).catch(() => {})
  }

  function trackTrackingSearch(code, payload = {}) {
    return track('tracking_search', {
      ...payload,
      searchedTerm: code,
      sectionKey: payload.sectionKey || 'tracking_form',
      label: payload.label || 'consulta_tracking'
    })
  }

  function trackCalculatorQuote(payload = {}) {
    return track('calculator_quote', {
      ...payload,
      sectionKey: payload.sectionKey || 'tariff_calculator',
      label: payload.label || 'cotizacion_tarifa'
    })
  }

  function trackPageView(route) {
    const path = normalizePath((route && route.fullPath) || (app.router && app.router.currentRoute && app.router.currentRoute.fullPath) || window.location.pathname)

    if (path === lastTrackedPath) {
      return
    }

    lastTrackedPath = path

    window.setTimeout(() => {
      track('page_view', {
        pagePath: path,
        pageName: document.title
      })
    }, 80)
  }

  function trackHeartbeat() {
    track('heartbeat', {
      pagePath: (app.router && app.router.currentRoute && app.router.currentRoute.fullPath) || window.location.pathname,
      pageName: document.title
    })
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      trackHeartbeat()
    }
  }

  function resolveSectionKey(element) {
    const explicit = element.dataset ? element.dataset.analyticsSection : ''

    if (explicit) {
      return explicit
    }

    const parent = element.closest('[data-analytics-section]')
    return parent && parent.dataset ? parent.dataset.analyticsSection || '' : ''
  }

  function resolveLabel(element) {
    if (element.dataset && element.dataset.analyticsLabel) {
      return element.dataset.analyticsLabel
    }

    const ariaLabel = element.getAttribute('aria-label')

    if (ariaLabel) {
      return ariaLabel
    }

    return normalizeText(element.textContent || element.value || '', 120)
  }

  function handleClick(event) {
    const target = event.target && event.target.closest
      ? event.target.closest('a,button,[data-analytics-click]')
      : null

    if (!target) {
      return
    }

    const label = resolveLabel(target)

    if (!label) {
      return
    }

    track('cta_click', {
      label,
      sectionKey: resolveSectionKey(target),
      pagePath: (app.router && app.router.currentRoute && app.router.currentRoute.fullPath) || window.location.pathname,
      pageName: document.title
    })
  }

  if (app.router) {
    app.router.afterEach((to) => {
      trackPageView(to)
    })
  }

  trackPageView(app.router && app.router.currentRoute)
  trackHeartbeat()

  const heartbeatTimer = window.setInterval(trackHeartbeat, 30000)

  document.addEventListener('click', handleClick, true)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', trackHeartbeat)

  if (typeof module !== 'undefined' && module.hot) {
    module.hot.dispose(() => {
      window.clearInterval(heartbeatTimer)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', trackHeartbeat)
    })
  }
}
