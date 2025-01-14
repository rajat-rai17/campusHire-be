'use strict'

import axios from 'axios'

import { SERVER_CONFIG } from '../../config'

const { CRASH_URL = '', CRASH_KEY = '' } = SERVER_CONFIG

export const AxiosHelper = {
  notifyCrash: async data => {
    const OPTIONS = {
      method: 'POST',
      headers: { 'app-key': CRASH_KEY },
      url: `${CRASH_URL}/report`,
      data
    }

    try {
      await axios(OPTIONS)
    } catch (error) {
    }
  }
}
