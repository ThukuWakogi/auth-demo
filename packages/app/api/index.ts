import { axiosInstance } from './axiosInstance'

export const login = () => axiosInstance.post('/api/auth/login/')
