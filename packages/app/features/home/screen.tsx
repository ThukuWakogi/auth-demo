import {
  Adapt,
  Button,
  Dialog,
  H1,
  H3,
  Paragraph,
  Sheet,
  Spinner,
  View,
  XStack,
  YStack,
} from '@my/ui'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthenticationStore } from 'app/store/authenticationStore'
import { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useState } from 'react'
import { Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import { useShallow } from 'zustand/react/shallow'
import { logout, verifyTokenUser } from '../../api'

export function HomeScreen() {
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
    enabled: Platform.OS === 'web' ? true : !!accessToken,
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
        <NotAuthenticatedSection />
      ) : (
        <>
          <H3>You are authenticated</H3>
          <XStack gap="$2">
            <LogoutSection />
          </XStack>
        </>
      )}
    </YStack>
  )
}

function NotAuthenticatedSection() {
  const loginLink = useLink({ href: '/login' })
  const registerLink = useLink({ href: '/register' })

  return (
    <>
      <H3>You are not authenticated</H3>
      <XStack gap="$2">
        <Button {...loginLink}>Log in</Button>
        <Button {...registerLink}>Register</Button>
      </XStack>
    </>
  )
}

function LogoutSection() {
  const [open, setOpen] = useState(false)
  const setTokens = useAuthenticationStore(state => state.setTokens)
  const queryClient = useQueryClient()

  const { isPending, isError, mutate } = useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      if (Platform.OS !== 'web') {
        SecureStore.deleteItemAsync('access_token')
        SecureStore.deleteItemAsync('refresh_token')
      }

      setTokens({ accessToken: undefined, refreshToken: undefined })
      queryClient.invalidateQueries({ queryKey: ['authentication', 'verification'] })
    },
  })

  return (
    <Dialog modal onOpenChange={open => setOpen(open)}>
      <Dialog.Trigger asChild disabled={isPending}>
        <Button>Log out</Button>
      </Dialog.Trigger>
      <Adapt when="sm" platform="touch">
        <Sheet
          animation="medium"
          zIndex={100_000}
          modal
          dismissOnSnapToBottom
          snapPointsMode="fit"
          native
          forceRemoveScrollEnabled
          dismissOnOverlayPress={!isPending}
        >
          <Sheet.Overlay animation="lazy" enterStyle={{ o: 0 }} exitStyle={{ o: 0 }} />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
        </Sheet>
      </Adapt>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={['quick', { opacity: { overshootClamping: true } }]}
          enterStyle={{ x: 0, y: -20, o: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, o: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Log out</Dialog.Title>
          {isError ? (
            <Dialog.Description col="red">
              Something went wrong, please try again.
            </Dialog.Description>
          ) : (
            <Dialog.Description>Are you sure you want to log out?</Dialog.Description>
          )}
          <XStack als="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild disabled={isPending}>
              <Button disabled={isPending}>Cancel</Button>
            </Dialog.Close>
            <Button
              theme="active"
              icon={isPending ? <Spinner /> : undefined}
              onPress={() => mutate()}
            >
              {isPending ? 'Logging in...' : isError ? 'Try again' : 'Log out'}
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
