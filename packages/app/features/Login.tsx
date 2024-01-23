import { Button, Card, Form, H1, Paragraph, PasswordField, TextField, YStack } from '@my/ui'
import { FormProvider, useForm } from 'react-hook-form'
import { useLink } from 'solito/navigation'

export function Login() {
  const form = useForm({ defaultValues: { username_email: '', password: '' } })

  console.log('watch', form.watch())

  return (
    <YStack f={1} jc="center" ai="center">
      <FormProvider {...form}>
        <Form onSubmit={() => console.log('submitting')}>
          <Card padded maw={400} style={{ minWidth: 350 }}>
            <Card.Header>
              <H1>Log in</H1>
            </Card.Header>
            <TextField label="Username or Email" name="username_email" />
            <PasswordField />
            <Card.Footer pt={16}>
              <Form.Trigger asChild>
                <Button theme="active">Log in</Button>
              </Form.Trigger>
            </Card.Footer>
            <Paragraph ta="center" mt="$3.5">
              Don't have an account?{' '}
              <Paragraph col="$blue10" {...useLink({ href: '/register' })}>
                Register
              </Paragraph>
            </Paragraph>
          </Card>
        </Form>
      </FormProvider>
    </YStack>
  )
}
