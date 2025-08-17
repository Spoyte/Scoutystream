import ScoutCredential from 0x...  // Replace with deployed contract address
import NonFungibleToken from 0x631e88ae7f1d7c20

/// Transaction to mint a Scout Credential NFT
/// This transaction sets up a collection if needed and mints a new credential
transaction {
    prepare(acct: AuthAccount) {
        // Check if account already has a collection
        if acct.borrow<&ScoutCredential.Collection>(from: ScoutCredential.CollectionStoragePath) == nil {
            // Create a new empty collection
            let collection <- ScoutCredential.createEmptyCollection()
            
            // Store the collection in the account storage
            acct.save(<-collection, to: ScoutCredential.CollectionStoragePath)
            
            // Create a public capability for the collection
            acct.link<&ScoutCredential.Collection{NonFungibleToken.CollectionPublic, ScoutCredential.ScoutCredentialCollectionPublic}>(
                ScoutCredential.CollectionPublicPath,
                target: ScoutCredential.CollectionStoragePath
            )
        }

        // Get a reference to the collection
        let collectionRef = acct.borrow<&ScoutCredential.Collection>(from: ScoutCredential.CollectionStoragePath)!

        // Mint the NFT
        ScoutCredential.mintNFT(recipient: collectionRef)
    }

    execute {
        log("Scout Credential NFT minted successfully!")
    }
}
