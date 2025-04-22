'use strict'

import jwt from 'jsonwebtoken'

import { AppConstants, JWT_FIELDS_EXTRACT } from '../api/constants'
import path from 'path'
import fs from 'fs'
import { ResponseBody } from './ResponseBody'

const jwtExtractor = async (request, response, next) => {
  const { headers } = request
  const { authorization } = headers

  if (!authorization) {
    return response.status(440).json({
      status: 440,
      message: 'Invalid Token'
    })
  }

 
  const token = authorization.split(' ')[1]; // Extract token after 'Bearer '
  
    const decoded = jwt.verify(token, AppConstants.jwtSecret);
    if (!decoded) {
      return response.status(403).json({ status: false, message: 'Invalid or Expired Token' });
    }
    // if(!decoded.type || decoded.type !== 'admin') {
    //   return response.status(403).json({ status: false, message: 'Invalid or Expired Token' });
    // }
    request.body.tokenData = decoded;
    // for (const field of JWT_FIELDS_EXTRACT) {
    //   request.body.[field] = decoded[field]
    // }
    next()

}




const uploadResumeMiddleware = async (request, response, next) => {
  try {
    const tokenData = request?.body?.tokenData || request?.tokenData
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
    // const result = await StudentModel.uploadResume({}, { userId, resumeFile: randomName })
    const result = {}
    response.body = new ResponseBody(200, 'Resume uploaded', result)
    next()
  } catch (err) {
    console.error('uploadResume error:', err)
    response.body = new ResponseBody(400, err.message)
    next()
  }

}

export { jwtExtractor, uploadResumeMiddleware }
