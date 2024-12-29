'use strict'

const watchTower = fn => (request, response, next) => Promise.resolve(fn(request, response, next)).catch(next)

export { watchTower }
