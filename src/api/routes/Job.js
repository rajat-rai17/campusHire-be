'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { JobController } from '../controllers'
import { SendResponse } from '../../lib'
const { createJob  , updateJob , removeJob, listJob } = JobController

const { sendResponse } = SendResponse
const JobRouter = new Express.Router()


JobRouter.post('/create', watchTower(createJob))
JobRouter.post('/update', watchTower(updateJob))
JobRouter.post('/remove', watchTower(removeJob))
JobRouter.post('/list', watchTower(listJob))



// Send Response
JobRouter.use(sendResponse)

export { JobRouter }
