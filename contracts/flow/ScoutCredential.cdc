// ScoutCredential.cdc
// A minimal NFT contract for Scout Credentials on Flow

import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

pub contract ScoutCredential: NonFungibleToken {
    
    // Events
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, recipient: Address)

    // Named Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // Total supply of Scout Credentials
    pub var totalSupply: UInt64

    // Scout Credential NFT
    pub resource NFT: NonFungibleToken.INFT, MetadataViews.Resolver {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        pub let mintedAt: UFix64

        init(
            id: UInt64,
            name: String,
            description: String,
            thumbnail: String,
        ) {
            self.id = id
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.mintedAt = getCurrentBlock().timestamp
        }

        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>()
            ]
        }

        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: self.name,
                        description: self.description,
                        thumbnail: MetadataViews.HTTPFile(
                            url: self.thumbnail
                        )
                    )
            }
            return nil
        }
    }

    // Collection
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @ScoutCredential.NFT

            let id: UInt64 = token.id

            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowScoutCredential(id: UInt64): &ScoutCredential.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &ScoutCredential.NFT
            }
            return nil
        }

        pub fun borrowViewResolver(id: UInt64): &AnyResource{MetadataViews.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let scoutCredential = nft as! &ScoutCredential.NFT
            return scoutCredential as &AnyResource{MetadataViews.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // Public function to create empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    // Minter resource
    pub resource NFTMinter {
        pub fun mintNFT(
            recipient: &{NonFungibleToken.CollectionPublic},
            name: String,
            description: String,
            thumbnail: String,
        ): UInt64 {
            let newNFT <- create NFT(
                id: ScoutCredential.totalSupply,
                name: name,
                description: description,
                thumbnail: thumbnail,
            )

            let id = newNFT.id

            emit Minted(id: id, recipient: recipient.owner?.address!)

            recipient.deposit(token: <-newNFT)

            ScoutCredential.totalSupply = ScoutCredential.totalSupply + UInt64(1)

            return id
        }
    }

    // Public minting function (anyone can mint)
    pub fun mintScoutCredential(recipient: Address): UInt64 {
        let recipientAccount = getAccount(recipient)
        let recipientCollection = recipientAccount
            .getCapability(ScoutCredential.CollectionPublicPath)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        let minter = self.account.borrow<&NFTMinter>(from: self.MinterStoragePath)
            ?? panic("Could not borrow a reference to the NFT minter")

        let id = minter.mintNFT(
            recipient: recipientCollection,
            name: "Scout Credential #".concat(self.totalSupply.toString()),
            description: "Official Scout Credential for ScoutyStream platform",
            thumbnail: "https://scoutystream.com/images/scout-credential.png",
        )

        return id
    }

    init() {
        self.totalSupply = 0

        self.CollectionStoragePath = /storage/scoutCredentialCollection
        self.CollectionPublicPath = /public/scoutCredentialCollection
        self.MinterStoragePath = /storage/scoutCredentialMinter

        // Create a Collection resource and save it to storage
        let collection <- create Collection()
        self.account.save(<-collection, to: self.CollectionStoragePath)

        // Create a public capability for the collection
        self.account.link<&ScoutCredential.Collection{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
            self.CollectionPublicPath,
            target: self.CollectionStoragePath
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}
