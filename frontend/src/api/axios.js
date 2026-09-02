// api/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.truxhubline.space/',
})

export default api
