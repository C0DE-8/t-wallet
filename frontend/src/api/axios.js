import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jack-the-reaper.vercel.app/api',
})

export default api
