'use strict'

import Joi from 'joi'

const JoiCreateOTPHeaders = Joi.object({
  email: Joi.string().required().email()
})

const JoiVerifyOTPVMSHeaders = Joi.object({
  oid: Joi.string().required(),
  otp: Joi.string().required(),
  'app-key': Joi.string().optional()
})

export { JoiCreateOTPVMSHeaders, JoiVerifyOTPVMSHeaders }
