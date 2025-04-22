'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { StudentController } from '../controllers'
import { jwtExtractor, SendResponse, uploadResumeMiddleware } from '../../lib'
const { createStudent, updateStudent, removeStudent, listStudent, uploadResume, getResume } = StudentController

const { sendResponse } = SendResponse
const StudentRouter = new Express.Router()


StudentRouter.post('/create', watchTower(createStudent))
StudentRouter.post('/uploadResume',jwtExtractor, watchTower(uploadResume))
StudentRouter.get('/getResume',jwtExtractor, watchTower(getResume))
StudentRouter.post('/update', watchTower(updateStudent))
StudentRouter.post('/remove', watchTower(removeStudent))
StudentRouter.post('/list', watchTower(listStudent))



// Send Response
StudentRouter.use(sendResponse)

export { StudentRouter }
