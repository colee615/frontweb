const http = require('http')
const https = require('https')
const { URL } = require('url')

module.exports = function createUpstreamProxy(options = {}) {
  const target = typeof options.target === 'string' ? options.target.trim().replace(/\/+$/, '') : ''
  const mountPath = typeof options.mountPath === 'string' ? options.mountPath : ''
  const forceStoragePrefix = options.forceStoragePrefix === true

  if (!/^https?:\/\//i.test(target)) {
    return function proxyNotConfigured(req, res) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ message: 'Proxy no configurado.', target }))
    }
  }

  return function upstreamProxy(req, res) {
    const incoming = new URL(req.url || '/', 'http://localhost')
    let pathname = incoming.pathname || '/'

    if (mountPath && pathname.startsWith(mountPath)) {
      pathname = pathname.slice(mountPath.length) || '/'
    }

    if (!pathname.startsWith('/')) {
      pathname = `/${pathname}`
    }

    if (forceStoragePrefix) {
      pathname = normalizeStoragePath(pathname)
    }

    const upstreamUrl = new URL(target)
    upstreamUrl.pathname = pathname
    upstreamUrl.search = incoming.search

    const client = upstreamUrl.protocol === 'https:' ? https : http
    const agent = upstreamUrl.protocol === 'https:'
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined

    const requestOptions = {
      protocol: upstreamUrl.protocol,
      hostname: upstreamUrl.hostname,
      port: upstreamUrl.port || (upstreamUrl.protocol === 'https:' ? 443 : 80),
      method: req.method,
      path: `${upstreamUrl.pathname}${upstreamUrl.search}`,
      headers: {
        ...req.headers,
        host: upstreamUrl.host,
        connection: 'close'
      },
      agent
    }

    const upstreamRequest = client.request(requestOptions, (upstreamResponse) => {
      res.statusCode = upstreamResponse.statusCode || 502

      Object.entries(upstreamResponse.headers || {}).forEach(([key, value]) => {
        if (typeof value !== 'undefined') {
          res.setHeader(key, value)
        }
      })

      upstreamResponse.pipe(res)
    })

    upstreamRequest.on('error', (error) => {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({
        message: 'No se pudo contactar el servicio de origen.',
        error: error && error.message ? error.message : 'Upstream error'
      }))
    })

    req.pipe(upstreamRequest)
  }
}

function normalizeStoragePath(pathname) {
  let normalized = pathname

  if (normalized.startsWith('/frontstorage')) {
    normalized = normalized.slice('/frontstorage'.length) || '/'
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`
  }

  normalized = normalized.replace(/^\/storage\/storage(\/|$)/i, '/storage$1')

  if (/^\/storage(\/|$)/i.test(normalized)) {
    return normalized
  }

  return `/storage${normalized}`
}
