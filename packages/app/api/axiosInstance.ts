import axios from 'axios'
import { Platform } from 'react-native'

export const axiosInstance = axios.create({
  baseURL: Platform.OS === 'web' ? 'https://192.168.100.6:8000' : 'http://192.168.100.6:8001',
  withCredentials: true,
})
