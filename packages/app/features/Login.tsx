import { Button, Card, H1, Input, Label, Paragraph, YStack } from '@my/ui'
import { useLink } from 'solito/navigation'

export function Login() {
  return (
    <YStack f={1} jc="center" ai="center">
      <Card padded maw={400} style={{ minWidth: 350 }}>
        <Card.Header>
          <H1>Log in</H1>
        </Card.Header>
        <>
          <Label htmlFor="username_email">Username or Email</Label>
          <Input id="username_email" />
        </>
        <>
          <Label htmlFor="password">Password</Label>
          <Input id="password" secureTextEntry />
        </>
        <Card.Footer pt={16}>
          <Button>Log in</Button>
        </Card.Footer>
        <Paragraph ta="center">
          Don't have an account?{' '}
          <Paragraph col="$blue10" {...useLink({ href: '/register' })}>
            Register
          </Paragraph>
        </Paragraph>
      </Card>
    </YStack>
  )
}
