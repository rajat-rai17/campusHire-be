'use strict'

import Joi from 'joi'

const JoiCreateOTPVMSHeaders = Joi.object({
  email: Joi.string().required().email(),
  'app-key': Joi.string().optional()
})

const JoiVerifyOTPVMSHeaders = Joi.object({
  oid: Joi.string().required(),
  otp: Joi.string().required(),
  'app-key': Joi.string().optional()
})

export { JoiCreateOTPVMSHeaders, JoiVerifyOTPVMSHeaders }
