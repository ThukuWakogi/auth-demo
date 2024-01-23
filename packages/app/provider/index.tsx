import { TamaguiProviderProps } from '@my/ui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationProvider } from './NavigationProvider'
import { QueryClientProvider } from './QueryClientProvider'
import { TamaguiProvider } from './TamaguiProvider'

export function Provider({ children, ...props }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()

  return (
    <>
      <SafeAreaProvider>
        <NavigationProvider>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <TamaguiProvider {...props}>
              <QueryClientProvider>{children}</QueryClientProvider>
            </TamaguiProvider>
          </ThemeProvider>
        </NavigationProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  )
}
