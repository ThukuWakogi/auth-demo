import axios, { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

const axiosInstance = axios.create({
  baseURL: Platform.OS === 'web' ? 'https://192.168.100.6:8000' : 'http://192.168.100.6:8001',
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.config.url === '/api/auth/token/verify/') {
      try {
        let refresh: string | null = null

        if (Platform.OS !== 'web') refresh = await SecureStore.getItemAsync('refresh_token')

        const res = await axios<{ access: string; access_expiration: string }>({
          method: 'post',
          withCredentials: true,
          url: 'https://192.168.100.6:8000/api/auth/token/refresh/',
          data: Platform.OS === 'web' ? undefined : { refresh },
        })

        return await axios({ ...error.config })
      } catch (e) {
        console.log({ e })

        if (e instanceof AxiosError && Platform.OS !== 'web') {
          await SecureStore.deleteItemAsync('refresh_token')
          e.response?.status === 401
        }
      }
    }

    return Promise.reject(error)
  }
)

export { axiosInstance }
