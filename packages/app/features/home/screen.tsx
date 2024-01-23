import { Button, H1, H3, XStack, YStack } from '@my/ui'
import { useLink } from 'solito/navigation'

export function HomeScreen() {
  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <H1>This is home</H1>
      <H3>You are not authenticated</H3>
      <XStack gap="$2">
        <Button {...useLink({ href: '/login' })}>Log in</Button>
        <Button {...useLink({ href: '/register' })}>Register</Button>
      </XStack>
    </YStack>
  )
}
