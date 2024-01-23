import { config } from '@my/config'

export type Conf = typeof config

declare module '@my/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export interface User {
  pk: number
  username: string
  email: string
  first_name: string
  last_name: string
}

export interface IAuthResponseData {
  access: string
  refresh: string
  user: User
}
