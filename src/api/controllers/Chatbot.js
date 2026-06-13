'use strict'

import { ResponseBody, HttpClient } from '../../lib'

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const ask = async (request, response, next) => {
  const { body } = request
  const message = (body && body.message ? String(body.message) : '').trim()

  if (!message) {
    response.body = new ResponseBody(400, 'message is required')
    return next()
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    response.body = new ResponseBody(500, 'Chatbot is not configured')
    return next()
  }

  try {
    const client = new HttpClient(`${GEMINI_BASE}/${GEMINI_MODEL}:generateContent`, {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    })

    const data = await client.POST({ contents: [{ parts: [{ text: message }] }] })

    const parts = (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || []
    const reply = parts
      .map((part) => (part.text || '').replace(/\*/g, '').trim())
      .filter(Boolean)
      .join('\n')

    if (!reply) {
      response.body = new ResponseBody(502, 'No response from assistant')
      return next()
    }

    response.body = new ResponseBody(200, 'Success', { reply })
    return next()
  } catch (error) {
    const statusCode = (error && error.response && error.response.status) || 502
    response.body = new ResponseBody(statusCode, 'Chatbot service unavailable')
    return next()
  }
}

export const ChatbotController = { ask }
