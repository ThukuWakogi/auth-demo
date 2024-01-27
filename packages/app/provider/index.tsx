import { TamaguiProviderProps } from '@my/ui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StatusBar } from 'expo-status-bar'
import { Platform, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useLoadAccessToken } from '../hooks/useLoadAccessToken'
import { NavigationProvider } from './NavigationProvider'
import { QueryClientProvider } from './QueryClientProvider'
import { TamaguiProvider } from './TamaguiProvider'

export function Provider({ children, ...props }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()
  useLoadAccessToken()

  return (
    <>
      <SafeAreaProvider>
        <NavigationProvider>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <TamaguiProvider {...props}>
              <QueryClientProvider>
                {children}
                {Platform.OS === 'web' ? <ReactQueryDevtools /> : null}
              </QueryClientProvider>
            </TamaguiProvider>
          </ThemeProvider>
        </NavigationProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  )
}
