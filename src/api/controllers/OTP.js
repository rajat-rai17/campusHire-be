'use strict'

import { OTPModel } from '../models'
import { ResponseBody } from '../../lib'


const createOTP = async (request, response, next) => {
  const { headers } = request

  const result = await OTPModel.createOTP(headers)
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}


export const OTPController = {
  createOTP,
}
