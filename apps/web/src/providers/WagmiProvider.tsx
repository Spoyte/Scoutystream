'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { chilizSpicy } from '@/lib/chains/chilizSpicy'
import { ReactNode, useState } from 'react'

const config = createConfig({
  chains: [chilizSpicy],
  connectors: [
    injected(),
  ],
  transports: {
    [chilizSpicy.id]: http(),
  },
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
