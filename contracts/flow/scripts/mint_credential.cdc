import ScoutCredential from "../ScoutCredential.cdc"

// Script to mint a Scout Credential NFT
transaction(recipient: Address) {
    prepare(signer: AuthAccount) {
        // Check if recipient has a collection
        let recipientAccount = getAccount(recipient)
        let collectionRef = recipientAccount
            .getCapability(ScoutCredential.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()

        if collectionRef == nil {
            // Create collection for recipient if they don't have one
            let collection <- ScoutCredential.createEmptyCollection()
            recipientAccount.save(<-collection, to: ScoutCredential.CollectionStoragePath)
            
            recipientAccount.link<&ScoutCredential.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
                ScoutCredential.CollectionPublicPath,
                target: ScoutCredential.CollectionStoragePath
            )
        }
    }

    execute {
        let id = ScoutCredential.mintScoutCredential(recipient: recipient)
        log("Minted Scout Credential NFT with ID: ".concat(id.toString()))
    }
}
