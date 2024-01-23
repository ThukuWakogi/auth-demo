import { axiosInstance } from './axiosInstance'

export const login = (body: { username: string; password: string }) =>
  axiosInstance.post('/api/auth/login/', body)
