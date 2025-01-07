'use strict'

import { JobModel } from '../models'
import { ResponseBody } from '../../lib'


const createJob = async (request, response, next) => {
  const { header, body } = request

  const result = await JobModel.createJob(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const updateJob = async (request, response, next) => {
  const { header, body } = request

  const result = await JobModel.updateJob(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}


const removeJob = async (request, response, next) => {
  const { header, body } = request

  const result = await JobModel.removeJob(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const listJob = async (request, response, next) => {
  const { header, body } = request

  const result = await JobModel.listJob(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}




export const JobController = {
  createJob,
  updateJob,
  removeJob,
  listJob
}
