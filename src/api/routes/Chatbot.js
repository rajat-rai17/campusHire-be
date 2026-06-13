'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { ChatbotController } from '../controllers'
import { SendResponse } from '../../lib'

const { ask } = ChatbotController
const { sendResponse } = SendResponse

const ChatbotRouter = new Express.Router()

ChatbotRouter.post('/ask', watchTower(ask))

// Send Response
ChatbotRouter.use(sendResponse)

export { ChatbotRouter }
