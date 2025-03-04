'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { NoticeController } from '../controllers'
import { SendResponse } from '../../lib'

const { createNotice, updateNotice, removeNotice, listNotice } = NoticeController
const { sendResponse } = SendResponse
const NoticeRouter = new Express.Router()

NoticeRouter.post('/create', watchTower(createNotice))
NoticeRouter.post('/update', watchTower(updateNotice))
NoticeRouter.post('/remove', watchTower(removeNotice))
NoticeRouter.post('/list', watchTower(listNotice))

// Send Response 
NoticeRouter.use(sendResponse)

export { NoticeRouter }
