import { Button, H1, H3, XStack, YStack } from '@my/ui'
import { useLink } from 'solito/navigation'

export function HomeScreen() {
  const linkProps = useLink({ href: '/user/nate' })

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <H1>This is home</H1>
      <H3>You are not authenticated</H3>
      <XStack gap="$2">
        <Button variant="outlined" theme="active">
          Log in
        </Button>
        <Button variant="outlined">Register</Button>
      </XStack>
    </YStack>
  )
}
