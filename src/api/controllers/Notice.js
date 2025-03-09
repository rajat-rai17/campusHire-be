'use strict'

import { NoticeModel } from '../models'
import { ResponseBody } from '../../lib'

const createNotice = async (request, response, next) => {
  const { header, body } = request

  const result = await NoticeModel.createNotice(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const updateNotice = async (request, response, next) => {
const { header, body } = request

const result = await NoticeModel.updateNotice(header, body) 
const { status = true, statusCode = 400, message = 'Something went wrong' } = result
let responseBody = {}
status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
response.body = responseBody

next()
}

const removeNotice = async (request, response, next) => {
  const { header, body } = request

  const result = await NoticeModel.removeNotice(header, body)
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const listNotice = async (request, response, next) => {
  const { header, body } = request

  const result = await NoticeModel.listNotice(header, body)
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)

  response.body = responseBody

  next()
}

const masterData = async (request, response, next) => {
  const { header, body } = request

  const result = await NoticeModel.masterData(header, body) 
  const responseBody = new ResponseBody(200,  'Success', result)
  response.body = responseBody

  next()
}

export const NoticeController = {
  createNotice,
  updateNotice,
  removeNotice,
  listNotice,
  masterData
}
