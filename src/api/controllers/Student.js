'use strict'

import { StudentModel } from '../models'
import { ResponseBody } from '../../lib'


const createStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.createStudent(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const updateStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.updateStudent(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}


const removeStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.removeStudent(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}

const listStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.listStudent(header, body) 
  const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  let responseBody = {}
  status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  response.body = responseBody

  next()
}




export const StudentController = {
  createStudent,
  updateStudent,
  removeStudent,
  listStudent
  

}
