'use strict'

import { MONGO_MODEL, StudentModel } from '../models'
import { ResponseBody } from '../../lib'
import path from 'path'
import fs from 'fs'


const createStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.createStudent(header, body) 
  const responseBody = new ResponseBody(200,  'Success', result)
  response.body = responseBody

  next()
}

const updateStudent = async (request, response, next) => {
  const { header, body } = request

  const result = await StudentModel.updateStudent(header, body) 
  // const { status = true, statusCode = 400, message = 'Something went wrong' } = result
  // let responseBody = {}
  // status === false ? responseBody = new ResponseBody(statusCode, message) : responseBody = new ResponseBody(200, 'Success', result)
  const responseBody = new ResponseBody(200,  'Success', result)
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


const uploadResume = async (request, response, next) => {
   try {
    const tokenData = request?.body?.tokenData
    const userId = tokenData?.userId
  
      
      if (!userId || !request?.files?.file) {
        throw new Error('Invalid request. Missing file or user token.')
      }
  
      const file = request.files.file
      const extension = path.extname(file.name)
  
      if (extension !== '.pdf') {
        throw new Error('Only PDF files are allowed.')
      }
  
      const randomName = [...Array(10)].map(() => Math.random().toString(36)[2]).join('') + '.pdf'
      const savePath = path.join(process.cwd(), 'uploads', randomName)
  
      // Save the file using fs
      await file.mv(savePath)
  
      // Now update DB
      const result = await StudentModel.uploadResume(tokenData, randomName )
      response.body = new ResponseBody(200, 'Resume uploaded', result)
      next()
    } catch (err) {
      console.error('uploadResume error:', err)
      response.body = new ResponseBody(400, err.message)
      next()
    }
}


const getResume = async (req, res, next) => {
  try {
    const userId = req.body.tokenData?.userId
    if (!userId) throw new Error('Invalid or missing token.')

    // Get the resume filename from DB
    const user = await MONGO_MODEL.mongoFindOne('users', { userId, status: true })
    const resumeFile = user?.resumeFile
    if (!resumeFile) throw new Error('No resume found for user.')

    const filePath = path.join(process.cwd(), 'uploads', resumeFile)

    // Ensure file exists
    if (!fs.existsSync(filePath)) {
      throw new Error('Resume file not found.')
    }

    res.download(filePath, resumeFile) // triggers download
  } catch (err) {
    console.error('getResume error:', err)
    res.status(404).json({ message: err.message })
  }
}


export const StudentController = {
  createStudent,
  updateStudent,
  removeStudent,
  listStudent,
  uploadResume,
  getResume
}
