'use strict'

const {
  BODY_LIMIT,
  CORS_METHODS,
  CORS_ORIGIN,
  PARAMETER_LIMIT,
  PORT,
  VERSION,
  SERVICE_NAME,
  APP_NAME,
  NODE_ENV,
} = process.env

const SERVER_CONFIG = {
  BODY_LIMIT,
  CORS_METHODS,
  CORS_ORIGIN,
  PARAMETER_LIMIT,
  PORT,
  VERSION,
  SERVICE_NAME,
  APP_NAME,
  NODE_ENV,
}
// Terminate Server if any Cache Configuration is missing
Object.keys(SERVER_CONFIG).forEach((key) => {
  if (!SERVER_CONFIG[key]) {
    console.error('[Error] Missing SERVER Config:', key)
    return process.exit(1)
  }
})

export { SERVER_CONFIG }
