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



export const AuthController = {
  verifyUser
}
