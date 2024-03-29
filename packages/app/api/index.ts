import { Platform } from 'react-native'
import { authenticationStore } from '../store/authenticationStore'
import { IAuthResponseData } from '../types'
import { axiosInstance } from './axiosInstance'

export const login = (body: { username: string; password: string }) =>
  axiosInstance.post<IAuthResponseData>('/api/auth/login/', body)

interface IRegisterBody {
  username: string
  email: string
  password1: string
  password2: string
}

export const register = (body: IRegisterBody) =>
  axiosInstance.post<IAuthResponseData>('/api/auth/', body)

export const verifyTokenUser = () =>
  axiosInstance.post<{}>(
    '/api/auth/token/verify/',
    Platform.OS === 'web'
      ? undefined
      : {
          token: authenticationStore.getState().accessToken,
        }
  )

export const logout = () => axiosInstance.post('/api/auth/logout/')
