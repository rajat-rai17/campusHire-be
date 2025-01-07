'use strict'

import { CompanyModel } from '../models'
import { ResponseBody } from '../../lib'


const createCompany = async (request, response, next) => {
  const { header, body } = request

  const result = await CompanyModel.createCompany(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const updateCompany = async (request, response, next) => {
  const { header, body } = request

  const result = await CompanyModel.updateCompany(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}


const removeCompany = async (request, response, next) => {
  const { header, body } = request

  const result = await CompanyModel.removeCompany(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const listCompany = async (request, response, next) => {
  const { header, body } = request

  const result = await CompanyModel.listCompany(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}




export const CompanyController = {
  createCompany,
  updateCompany,
  removeCompany,
  listCompany
}
