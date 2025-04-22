'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { JobController } from '../controllers'
import { jwtExtractor, SendResponse } from '../../lib'
const { createJob  , updateJob , removeJob, listJob, masterData, studentListJob, applyJob } = JobController

const { sendResponse } = SendResponse
const JobRouter = new Express.Router()


JobRouter.post('/create', watchTower(createJob))
JobRouter.post('/update', watchTower(updateJob))
JobRouter.post('/remove', watchTower(removeJob))
JobRouter.post('/applyJob',jwtExtractor, watchTower(applyJob))
JobRouter.post('/list', watchTower(listJob))
JobRouter.post('/studentListJob', jwtExtractor, watchTower(studentListJob))
JobRouter.post('/masterData', watchTower(masterData))



// Send Response
JobRouter.use(sendResponse)

export { JobRouter }
