'use strict'

import { connectRedis, redisClient } from '../../Server'

// GET
const redisGET = async key => {
  if (redisClient.status === 'ready') return await redisClient.get(key)
  connectRedis()
  return null
}
// GET KEY with Pattern
const redisGETwithPattern = async key => {
  if (redisClient.status === 'ready') return await redisClient.keys(key)
  connectRedis()
  return null
}
// SET
const redisSET = async (key, value) => {
  if (redisClient.status === 'ready') return await redisClient.set(key, value)
  connectRedis()
  return null
}
// SET With Expiry
const redisSETWithExpiry = async (key, value, REDIS_EXPIRY) => {
  if (redisClient.status === 'ready') return await redisClient.set(key, value, 'EX', REDIS_EXPIRY)
  connectRedis()
  return null
}
// SET With Expiry and check whether key exists in DB
const redisSETWithExistsAndExpiry = async (key, value, REDIS_EXPIRY) => {
  if (redisClient.status === 'ready') return await redisClient.set(key, value, 'NX', 'EX', REDIS_EXPIRY)
  connectRedis()
  return null
}
// REMOVE the key
const redisREMOVEKey = async (key) => {
  if (redisClient.status === 'ready') return await redisClient.del(key)
  connectRedis()
  return null
}

export const REDIS = { redisGET, redisGETwithPattern, redisSET, redisSETWithExpiry, redisSETWithExistsAndExpiry, redisREMOVEKey }
