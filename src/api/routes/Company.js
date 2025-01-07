'use strict'

import Express from 'express'
import { watchTower } from '../helpers'
import { CompanyController } from '../controllers'
import { SendResponse } from '../../lib'
const { createCompany  , updateCompany , removeCompany, listCompany } = CompanyController

const { sendResponse } = SendResponse
const CompanyRouter = new Express.Router()


CompanyRouter.post('/create', watchTower(createCompany))
CompanyRouter.post('/update', watchTower(updateCompany))
CompanyRouter.post('/remove', watchTower(removeCompany))
CompanyRouter.post('/list', watchTower(listCompany))



// Send Response
CompanyRouter.use(sendResponse)

export { CompanyRouter }
