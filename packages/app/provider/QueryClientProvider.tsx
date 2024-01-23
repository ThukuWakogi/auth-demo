import {
  QueryClientProvider as OGQueryClientProvider,
  QueryClient,
  QueryClientProviderProps,
} from '@tanstack/react-query'
import { useState } from 'react'

export function QueryClientProvider(props: Omit<QueryClientProviderProps, 'client'>) {
  const [queryClient] = useState(() => new QueryClient())

  return <OGQueryClientProvider client={queryClient} {...props} />
}
