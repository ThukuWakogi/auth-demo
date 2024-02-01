import axios, { AxiosError } from 'axios'
import { Platform } from 'react-native'

const axiosInstance = axios.create({
  baseURL: Platform.OS === 'web' ? 'https://192.168.100.6:8000' : 'http://192.168.100.6:8001',
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  response => {
    console.log({ response })

    return response
  },
  async (error: AxiosError) => {
    console.log('lol', { error })
    console.log(error.response?.config.url)
    console.log(error.response?.config.url === '/api/auth/token/verify/')

    if (error.response?.config.url === '/api/auth/token/verify/') {
      try {
        const res = await axios<{ access: string; access_expiration: string }>({
          method: 'post',
          withCredentials: true,
          url: 'https://192.168.100.6:8000/api/auth/token/refresh/',
        })

        console.log({ res })

        return await axios({ ...error.config })
      } catch (e) {
        console.log({ e })
      }
    }

    return Promise.reject(error)
  }
)

export { axiosInstance }
