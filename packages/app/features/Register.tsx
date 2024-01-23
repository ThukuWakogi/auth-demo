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
import { FormProvider, useForm } from 'react-hook-form'
import { useLink } from 'solito/navigation'
import { z } from 'zod'
import { register } from '../api'

const registerSchema = z
  .object({
    username: z.string().trim().min(1, { message: 'This field is required.' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'This field is required.' })
      .email('Enter a valid email address.'),
    password1: z
      .string()
      .trim()
      .min(1, { message: 'This field is required.' })
      .min(7, 'The password is too short.'),
    password2: z.string().trim().min(1, { message: 'This field is required.' }),
  })
  .refine(({ password1, password2 }) => password1 === password2, {
    message: 'Passwords do not match.',
    path: ['password2'],
  })

export function Register() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (values: z.infer<typeof registerSchema>) => register(values),
    onSuccess: ({ data }) => console.log(JSON.stringify(data, null, 2)),
    onError: ({
      response,
    }: AxiosError<
      { non_field_errors?: string[] } & Record<keyof z.infer<typeof registerSchema>, string[]>
    >) => {
      console.log(response?.data)
      if (response?.data)
        Object.entries(response.data).forEach(([key, value]) =>
          form.setError(key as keyof z.infer<typeof registerSchema>, { message: value.toString() })
        )
    },
  })

  const form = useForm({
    defaultValues: { username: '', email: '', password1: '', password2: '' },
    resolver: zodResolver(registerSchema),
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
                <H1>Register</H1>
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
              <TextField label="Username" name="username" autoCapitalize="none" />
              <TextField label="Email" name="email" autoCapitalize="none" />
              <PasswordField name="password1" />
              <PasswordField label="Confirm password" name="password2" />
              <Card.Footer pt={16}>
                <Form.Trigger asChild disabled={isPending}>
                  <Button
                    theme="active"
                    icon={isPending ? <Spinner /> : undefined}
                    disabled={isPending}
                  >
                    {isPending ? 'Registering...' : 'Register'}
                  </Button>
                </Form.Trigger>
              </Card.Footer>
              <Paragraph ta="center" mt="$3.5">
                Do you have an account?{' '}
                <Paragraph col="$blue10" {...useLink({ href: '/login' })}>
                  Log in
                </Paragraph>
              </Paragraph>
            </Card>
          </Form>
        </FormProvider>
      </YStack>
    </ScrollView>
  )
}
