import * as fcl from '@onflow/fcl'

const FLOW_ACCESS_NODE = process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE || 'https://rest-testnet.onflow.org'
const FLOW_WALLET_URL = process.env.NEXT_PUBLIC_FLOW_WALLET_URL || 'https://fcl-discovery.onflow.org/testnet/authn'

// Configure FCL for Flow Testnet
fcl.config({
  'accessNode.api': FLOW_ACCESS_NODE,
  'discovery.wallet': FLOW_WALLET_URL,
  'app.detail.title': 'ScoutyStream',
  'app.detail.icon': 'https://fcl-discovery.onflow.org/images/blocto.png',
})

export const login = fcl.authenticate
export const logout = fcl.unauthenticate
export const currentUser = fcl.currentUser
export const authz = fcl.authz
export const mutate = fcl.mutate
export const query = fcl.query

export default fcl
