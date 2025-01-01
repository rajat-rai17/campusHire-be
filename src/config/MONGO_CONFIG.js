'use strict'

const {
  MONGO_HOST_AUTH,
  MONGO_DBNAME_AUTH,
  MONGO_USERNAME_AUTH,
  MONGO_PASSWORD_AUTH
} = process.env

const OPTIONS = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}

let CONNECTION_URI = ''

CONNECTION_URI = `mongodb+srv://${MONGO_USERNAME_AUTH}:${MONGO_PASSWORD_AUTH}@${MONGO_HOST_AUTH}/${MONGO_DBNAME_AUTH}?retryWrites=true&writeConcern=majority`
const MONGO_CONFIG = {
  MONGO_DBNAME_AUTH,
  OPTIONS,
  CONNECTION_URI
}

const checkDbKeys = config => {
  Object.keys(config).forEach((key) => {
    if (!config[key]) {
      console.error('[Error] Missing MongoDB Config:', key)
      return process.exit(1)
    }
  })
}

// Terminate Server if any, DB Configuration is missing
checkDbKeys(MONGO_CONFIG)

export { MONGO_CONFIG }
