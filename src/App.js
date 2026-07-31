'use strict'
import dotenv from 'dotenv'
dotenv.config()

import Express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import Routes from './api/routes'
import server from './Server'
import helmet from 'helmet'
import { SERVER_CONFIG } from './config'

const { BODY_LIMIT, CORS_ORIGIN, CORS_METHODS, PARAMETER_LIMIT } = SERVER_CONFIG

const App = new Express()
const corsOptions = { origin: CORS_ORIGIN, methods: CORS_METHODS }
// Middleware Initializations

App.use(helmet())
App.disable('etag')
App.use(cors(corsOptions))
App.use(Express.json({ limit: BODY_LIMIT }))
App.use(Express.urlencoded({ limit: BODY_LIMIT, extended: true, parameterLimit: PARAMETER_LIMIT }))
// ✅ File upload middleware (must come before routes)
// ✅ Parse JSON bodies
App.use(fileUpload())
// data sanitization against NOSql query injection
// App.use(Logger.pinoHttpLogger)
App.use(mongoSanitize())
// Initialize Routes
Routes.init(App)
// Start Server
if (!process.env.VERCEL) {
  server(App)
}

export default App
