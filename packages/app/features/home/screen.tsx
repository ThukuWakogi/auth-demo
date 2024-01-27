import { Button, H1, H3, Paragraph, Spinner, View, XStack, YStack } from '@my/ui'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAuthenticationStore } from 'app/store/authenticationStore'
import { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import { useShallow } from 'zustand/react/shallow'
import { verifyTokenUser } from '../../api'

export function HomeScreen() {
  const loginLink = useLink({ href: '/login' })
  const registerLink = useLink({ href: '/register' })

  const { accessToken, setTokens } = useAuthenticationStore(
    useShallow(state => ({ accessToken: state.accessToken, setTokens: state.setTokens }))
  )

  const { isError, isLoading, data } = useQuery({
    queryKey: ['authentication', 'verification'],
    queryFn: () =>
      verifyTokenUser()
        .then(res => res.data)
        .catch((err: AxiosError) => {
          console.log({ err })
          console.log(err.response?.data)

          if (err.response?.status === 401) {
            setTokens({ accessToken: undefined })

            if (Platform.OS !== 'web') SecureStore.deleteItemAsync('access_token')

            return null
          }

          return Promise.reject(err)
        }),
    placeholderData: keepPreviousData,
    retry: (_failureCount, error: AxiosError) => error.response?.status !== 400,
    enabled: !!accessToken,
  })

  return (
    <YStack f={1} jc="center" ai="center" p="$4" gap="$2">
      <View>
        <H1>This is home</H1>
        <Paragraph ta="center">The platform is {Platform.OS}</Paragraph>
      </View>
      {isLoading ? (
        <>
          <H3>Loading...</H3>
          <Spinner />
        </>
      ) : isError || !data ? (
        <>
          <H3>You are not authenticated</H3>
          <XStack gap="$2">
            <Button {...loginLink}>Log in</Button>
            <Button {...registerLink}>Register</Button>
          </XStack>
        </>
      ) : (
        <>
          <H3>You are authenticated</H3>
          <XStack gap="$2">
            <Button>Log out</Button>
          </XStack>
        </>
      )}
    </YStack>
  )
}
