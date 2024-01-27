import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'
import { Platform } from 'react-native'
import { useAuthenticationStore } from '../store/authenticationStore'

export const useLoadAccessToken = () => {
  const setTokens = useAuthenticationStore(state => state.setTokens)

  useEffect(() => {
    if (Platform.OS !== 'web') {
      SecureStore.getItemAsync('access_token').then(item =>
        setTokens({ accessToken: item ?? undefined })
      )
    }
  }, [])
}
