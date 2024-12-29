import axios from 'axios'

export class HttpClient {
  constructor (url, headers = {}) {
    this.url = url
    this.headers = headers
  }

  // hit post request client
  async POST (data) {
    const clientData = await axios({
      method: 'POST',
      url: this.url,
      data,
      headers: this.headers
    })
    return clientData.data
  }

  // hit get request client
  async GET () {
    const clientData = await axios({
      method: 'GET',
      url: this.url,
      headers: this.headers
    })
    return clientData.data
  }
}
