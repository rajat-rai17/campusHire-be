'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import {  AuthController } from '../controllers'
import { SendResponse } from '../../lib'

const { verifyUser } = AuthController

const { sendResponse } = SendResponse
const AuthRouter = new Express.Router()


AuthRouter.post('/verifyUser', watchTower(verifyUser))
// AuthRouter.get('/resetPassword', watchTower(resetPassword))
// AuthRouter.get('/forgotPassword', watchTower(forgotPassword))



// Send Response
AuthRouter.use(sendResponse)

export { AuthRouter }
