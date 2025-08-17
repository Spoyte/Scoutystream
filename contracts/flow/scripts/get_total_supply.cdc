import ScoutCredential from 0x...  // Replace with deployed contract address

/// Script to get the total supply of Scout Credential NFTs
pub fun main(): UInt64 {
    return ScoutCredential.getTotalSupply()
}
