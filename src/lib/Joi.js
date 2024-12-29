'use strict'

import { ErrorObject } from '../lib'

// Validation
const joiValidate = (values, joiSchema, next) => {
  const { error = null } = joiSchema.validate(values)
  if (error !== null) {
    const { details } = error
    const { message } = details[0]
    throw new ErrorObject(400, 'Bad Request', { message })
  }
  next()
}

const joiValidate2 = (values, joiSchema, next) => {
  const { error = null } = joiSchema.validate(values)
  if (error !== null) {
    const { details } = error
    const { message } = details[0]
    return { joiStatus: false, statusCode: 400, message }
  }
  return { joiStatus: true }
}

export { joiValidate, joiValidate2 }
