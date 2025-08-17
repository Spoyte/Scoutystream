import { defineChain } from 'viem'

export const chilizSpicy = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_CHILIZ_CHAIN_ID || '88882'),
  name: 'Chiliz Spicy Testnet',
  nativeCurrency: {
    name: 'CHZ',
    symbol: 'CHZ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_CHILIZ_RPC_URL || 'https://spicy-rpc.chiliz.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://testnet.chiliscan.com',
    },
  },
  testnet: true,
})
