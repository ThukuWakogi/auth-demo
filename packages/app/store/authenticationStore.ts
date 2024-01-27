import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface IState {
  accessToken: string | undefined
  refreshToken: string | undefined
}

interface IActions {
  setTokens: (state?: Partial<IState>) => void
}

export const authenticationStore = createStore<IState & IActions>(set => ({
  accessToken: undefined,
  refreshToken: undefined,
  setTokens: tokens => set(state => ({ ...state, ...tokens })),
}))

export function useAuthenticationStore(): IActions & IState
export function useAuthenticationStore<T>(selector: (state: IActions & IState) => T): T
export function useAuthenticationStore<T>(selector?: (state: IActions & IState) => T) {
  return useStore(authenticationStore, selector!)
}
