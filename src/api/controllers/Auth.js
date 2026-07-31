'use strict'

import { AuthModel } from '../models'
import { ResponseBody } from '../../lib'


const verifyUser = async (request, response, next) => {
  const { body } = request

  const result = await AuthModel.verifyUser(body)
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}



const forgotPassword = async (request, response, next) => {
  const { body } = request

  const result = await AuthModel.forgotPassword(body)
  const { status = true, statusCode = 400, message = 'Something went wrong', newPassword, previewUrl } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, message, { newPassword, previewUrl })
  response.body = responseBody

  next()
}



const resetPassword = async (request, response, next) => {
  const { body } = request

  const result = await AuthModel.resetPassword(body)
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, message, result)
  response.body = responseBody

  next()
}

export const AuthController = {
  verifyUser,
  forgotPassword,
  resetPassword
}
