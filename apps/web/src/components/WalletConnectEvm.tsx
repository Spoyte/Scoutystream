'use client'

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { chilizSpicy } from '@/lib/chains/chilizSpicy'
import { useEffect } from 'react'

export function WalletConnectEvm() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chain?.id !== chilizSpicy.id

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected')
    if (injectedConnector) {
      connect({ connector: injectedConnector })
    }
  }

  const handleSwitchNetwork = () => {
    switchChain({ chainId: chilizSpicy.id })
  }

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        {isWrongNetwork && (
          <button
            onClick={handleSwitchNetwork}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Switch to Chiliz Spicy
          </button>
        )}
        <div className="text-sm text-gray-700">
          {truncateAddress(address!)}
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      {isPending ? 'Connecting...' : 'Connect EVM Wallet'}
    </button>
  )
}
