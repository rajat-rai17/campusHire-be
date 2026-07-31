'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import {  AuthController } from '../controllers'
import { SendResponse } from '../../lib'

const { verifyUser, forgotPassword, resetPassword } = AuthController

const { sendResponse } = SendResponse
const AuthRouter = new Express.Router()


AuthRouter.post('/verifyUser', watchTower(verifyUser))
AuthRouter.post('/forgotPassword', watchTower(forgotPassword))
AuthRouter.post('/resetPassword', watchTower(resetPassword))



// Send Response
AuthRouter.use(sendResponse)

export { AuthRouter }
