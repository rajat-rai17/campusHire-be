'use strict'

import jwt from 'jsonwebtoken'

import { AppConstants, JWT_FIELDS_EXTRACT } from '../api/constants'

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


const studentJwtExtractor = async (request, response, next) => {
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
    for (const field of JWT_FIELDS_EXTRACT) {
      request.body[field] = decoded[field]
    }
    next()

}

export { jwtExtractor, studentJwtExtractor }
