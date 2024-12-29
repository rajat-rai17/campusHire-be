'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { OTPController } from '../controllers'
import { SendResponse } from '../../lib'

const { createOTP } = OTPController

const { sendResponse } = SendResponse
const OTPRouter = new Express.Router()


OTPRouter.get('/createOTP', watchTower(createOTP))

// Send Response
OTPRouter.use(sendResponse)

export { OTPRouter }
