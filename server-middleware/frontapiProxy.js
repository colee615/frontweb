const createUpstreamProxy = require('./upstreamProxy')

const target = (process.env.INTERNAL_API_BASE_URL || process.env.API_BASE_URL || '').trim()

module.exports = createUpstreamProxy({
  target,
  mountPath: '/frontapi'
})
