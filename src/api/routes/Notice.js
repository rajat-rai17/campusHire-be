'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { NoticeController } from '../controllers'
import { jwtExtractor,SendResponse } from '../../lib'

const { createNotice, updateNotice, removeNotice, listNotice, masterData } = NoticeController
const { sendResponse } = SendResponse
const NoticeRouter = new Express.Router()

NoticeRouter.use(jwtExtractor)


NoticeRouter.post('/create', watchTower(createNotice))
NoticeRouter.post('/update', watchTower(updateNotice))
NoticeRouter.post('/remove', watchTower(removeNotice))
NoticeRouter.post('/list', watchTower(listNotice))
NoticeRouter.post('/masterData', watchTower(masterData))


// Send Response 
NoticeRouter.use(sendResponse)

export { NoticeRouter }
