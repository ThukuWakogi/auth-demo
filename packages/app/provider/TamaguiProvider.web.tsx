'use client'

import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { CustomToast, TamaguiProvider as TamaguiProviderOG, ToastProvider, config } from '@my/ui'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import { StyleSheet } from 'react-native'
import { ToastViewport } from './ToastViewport'

export function TamaguiProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet()

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProviderOG config={config} themeClassNameOnRoot defaultTheme={theme}>
        <ToastProvider swipeDirection="horizontal" duration={6000} native={['mobile']}>
          {children}
          <CustomToast />
          <ToastViewport />
        </ToastProvider>
      </TamaguiProviderOG>
    </NextThemeProvider>
  )
}
