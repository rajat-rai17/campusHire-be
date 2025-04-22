'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { NoticeController } from '../controllers'
import { jwtExtractor,SendResponse } from '../../lib'

const { createNotice, updateNotice, removeNotice, listNotice, masterData } = NoticeController
const { sendResponse } = SendResponse
const NoticeRouter = new Express.Router()




NoticeRouter.post('/create', jwtExtractor, watchTower(createNotice))
NoticeRouter.post('/update', jwtExtractor, watchTower(updateNotice))
NoticeRouter.post('/remove', jwtExtractor, watchTower(removeNotice))
NoticeRouter.post('/list',jwtExtractor, watchTower(listNotice))
NoticeRouter.post('/studentNoticeList', watchTower(listNotice))
NoticeRouter.post('/masterData', watchTower(masterData))


// Send Response 
NoticeRouter.use(sendResponse)

export { NoticeRouter }
