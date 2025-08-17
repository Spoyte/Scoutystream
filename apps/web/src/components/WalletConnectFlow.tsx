'use client'

import { useState, useEffect } from 'react'
import { login, logout, currentUser } from '@/lib/fcl'

interface FlowUser {
  addr?: string
  loggedIn?: boolean
}

export function WalletConnectFlow() {
  const [user, setUser] = useState<FlowUser>({ loggedIn: false })

  useEffect(() => {
    const unsubscribe = currentUser.subscribe(setUser)
    return () => unsubscribe()
  }, [])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`
  }

  if (user.loggedIn && user.addr) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700">
          Flow: {truncateAddress(user.addr)}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Disconnect Flow
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={login}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Connect Flow Wallet
    </button>
  )
}
