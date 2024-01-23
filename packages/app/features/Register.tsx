import { Button, Card, H1, Input, Label, Paragraph, YStack } from '@my/ui'
import { useLink } from 'solito/navigation'

export function Register() {
  return (
    <YStack f={1} jc="center" ai="center">
      <Card padded maw={400} style={{ minWidth: 350 }}>
        <Card.Header>
          <H1>Register</H1>
        </Card.Header>
        <>
          <Label htmlFor="username">Username</Label>
          <Input id="username" />
        </>
        <>
          <Label htmlFor="email">Email</Label>
          <Input id="email" />
        </>
        <>
          <Label htmlFor="password1">Password</Label>
          <Input id="password1" secureTextEntry />
        </>
        <>
          <Label htmlFor="password2">Confirm Password</Label>
          <Input id="password2" secureTextEntry />
        </>
        <Card.Footer pt={16}>
          <Button>Register</Button>
        </Card.Footer>
        <Paragraph ta="center">
          Do you have an account?{' '}
          <Paragraph col="$blue10" {...useLink({ href: '/login' })}>
            Log in
          </Paragraph>
        </Paragraph>
      </Card>
    </YStack>
  )
}
