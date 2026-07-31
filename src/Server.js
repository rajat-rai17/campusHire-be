'use strict'

import { MongoClient } from 'mongodb'
import { SERVER_CONFIG, MONGO_CONFIG } from './config'
// const { MongoClient } = require('mongodb')

const { PORT } = SERVER_CONFIG
const { CONNECTION_URI, MONGO_DBNAME_AUTH } = MONGO_CONFIG

export let mongoClientDB



const Server = async App => {
  try {
    if (!mongoClientDB) {
      const mongoClientUse = new MongoClient(CONNECTION_URI)
      await mongoClientUse.connect()

      mongoClientDB = mongoClientUse.db(MONGO_DBNAME_AUTH)
      console.log(`[Info] MongoDB Connection to Database ' ${MONGO_DBNAME_AUTH} ' Successful!`)
    }
    
    if (!process.env.VERCEL) {
      await App.listen(PORT)
      console.log(`[Info] Server Started Successfully! Listening on Port: ${PORT}`)
    }
  } catch (error) {
    console.log("🚀 ~ error:", error);
    // Logger.pinoLoggerShowAlways.error(error)
    throw error
  }
}

export default Server
