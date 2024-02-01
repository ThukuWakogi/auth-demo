import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  Form,
  H1,
  Paragraph,
  PasswordField,
  ScrollView,
  Spinner,
  TextField,
  YStack,
} from '@my/ui'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { FormProvider, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { useLink, useRouter } from 'solito/navigation'
import { z } from 'zod'
import { login } from '../api'
import { useAuthenticationStore } from '../store/authenticationStore'

const loginSchema = z.object({
  username: z.string().trim().min(1, { message: 'This field is required' }),
  password: z.string().trim().min(1, { message: 'This field is required' }),
})

export function Login() {
  const { push } = useRouter()
  const setTokens = useAuthenticationStore(state => state.setTokens)
  const registerLink = useLink({ href: '/register' })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => login(values),
    onSuccess: ({ data }) => {
      if (Platform.OS !== 'web') {
        SecureStore.setItemAsync('access_token', data.access)
        SecureStore.setItemAsync('refresh_token', data.refresh)
      }

      setTokens({ accessToken: data.access, refreshToken: data.refresh })
      push('/')
    },
    onError: (
      error: AxiosError<
        { non_field_errors?: string[] } & Record<keyof z.infer<typeof loginSchema>, string[]>
      >
    ) => {
      if (error.response?.data)
        Object.entries(error.response.data).forEach(([key, value]) =>
          form.setError(key as keyof z.infer<typeof loginSchema>, { message: value.toString() })
        )
    },
  })

  const form = useForm({
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    disabled: isPending,
  })

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}>
      <YStack f={1} jc="center" ai="center">
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(values => mutate(values))}>
            <Card padded maw={400} style={{ minWidth: 350 }}>
              <Card.Header>
                <H1>Log in</H1>
                {isError ? (
                  error.response?.data.non_field_errors ? (
                    error.response?.data.non_field_errors.map(error => (
                      <Paragraph key={error} col="$red10">
                        {error}
                      </Paragraph>
                    ))
                  ) : (
                    <Paragraph col="$red10">Something went wrong, please try again</Paragraph>
                  )
                ) : null}
              </Card.Header>
              <TextField label="Username or Email" name="username" autoCapitalize="none" />
              <PasswordField />
              <Card.Footer pt={16}>
                <Form.Trigger asChild disabled={isPending}>
                  <Button
                    theme="active"
                    icon={isPending ? <Spinner /> : undefined}
                    disabled={isPending}
                  >
                    {isPending ? 'Logging in...' : 'Log in'}
                  </Button>
                </Form.Trigger>
              </Card.Footer>
              <Paragraph ta="center" mt="$3.5">
                Don't have an account?{' '}
                <Paragraph col="$blue10" {...registerLink}>
                  Register
                </Paragraph>
              </Paragraph>
            </Card>
          </Form>
        </FormProvider>
      </YStack>
    </ScrollView>
  )
}
