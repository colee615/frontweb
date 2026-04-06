const axios = require('axios')

const DEFAULT_TIMEOUT = 15000

module.exports = async function calculatorMiddleware(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      success: false,
      message: 'Metodo no permitido.'
    })
  }

  try {
    const body = await readJsonBody(req)
    const payload = buildPayload(body)
    const apiResponse = await axios.post(resolveApiUrl(), payload, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      timeout: resolveTimeout(),
      validateStatus: () => true
    })

    return sendJson(res, apiResponse.status, normalizeApiResponse(apiResponse.data))
  } catch (error) {
    if (error && error.statusCode) {
      return sendJson(res, error.statusCode, {
        success: false,
        message: error.message
      })
    }

    const upstreamStatus = error.response && error.response.status ? error.response.status : 502
    const upstreamData = error.response && error.response.data ? error.response.data : null

    return sendJson(res, upstreamStatus, normalizeApiResponse(upstreamData, {
      success: false,
      message: 'No se pudo consultar la tarifa en este momento.'
    }))
  }
}

function resolveApiUrl() {
  const apiUrl = (process.env.POSTAL_CALCULATOR_API_URL || '').trim().replace(/\/+$/, '')

  if (!apiUrl) {
    throw createInputError('La URL de la API no esta configurada en el archivo .env.')
  }

  return apiUrl
}

function resolveTimeout() {
  return DEFAULT_TIMEOUT
}

function buildPayload(body = {}) {
  const category = normalizeString(body.category || body.categoria || 'EMS INT')
  const destination = normalizeString(body.destination || body.destino)
  const weight = Number.parseFloat(body.weight || body.peso)

  if (!category) {
    throw createInputError('La categoria es obligatoria.')
  }

  if (!destination) {
    throw createInputError('El destino es obligatorio.')
  }

  if (!Number.isFinite(weight) || weight <= 0) {
    throw createInputError('El peso debe ser mayor a 0.')
  }

  return {
    categoria: category,
    peso: weight,
    destino: destination
  }
}

function normalizeApiResponse(payload, fallback = null) {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload
  }

  if (fallback) {
    return fallback
  }

  return {
    success: true,
    data: payload
  }
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}


function createInputError(message) {
  const error = new Error(message)
  error.statusCode = 422
  return error
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body)
  }

  return new Promise((resolve, reject) => {
    let rawBody = ''

    req.on('data', (chunk) => {
      rawBody += chunk
    })

    req.on('end', () => {
      if (!rawBody) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(rawBody))
      } catch (error) {
        reject(createInputError('El cuerpo de la solicitud no es JSON valido.'))
      }
    })

    req.on('error', reject)
  })
}
