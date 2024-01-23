import {
  CustomToast,
  TamaguiProvider as OGTamaguiProvider,
  TamaguiProviderProps,
  Theme,
  ToastProvider,
  config,
} from '@my/ui'
import { useColorScheme } from 'react-native'
import { ToastViewport } from './ToastViewport'

export function TamaguiProvider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const scheme = useColorScheme()

  return (
    <OGTamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
      {...rest}
    >
      <Theme name="blue">
        <ToastProvider swipeDirection="horizontal" duration={6000} native={['mobile']}>
          {children}
          <CustomToast />
          <ToastViewport />
        </ToastProvider>
      </Theme>
    </OGTamaguiProvider>
  )
}
