import NonFungibleToken from 0x631e88ae7f1d7c20
import ViewResolver from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

/// ScoutCredential is a simple NFT contract for verifying scout identities
/// on the ScoutyStream platform. Each scout can mint one credential NFT
/// to demonstrate their commitment to transparent and professional scouting.
///
pub contract ScoutCredential: NonFungibleToken {

    /// Total supply of Scout Credential NFTs
    pub var totalSupply: UInt64

    /// Events
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event CredentialMinted(id: UInt64, recipient: Address, timestamp: UFix64)

    /// Storage and Public Paths
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath

    /// Scout Credential NFT Resource
    ///
    pub resource NFT: NonFungibleToken.INFT, ViewResolver.Resolver {
        pub let id: UInt64
        pub let mintedAt: UFix64
        pub let mintedBy: Address

        init(id: UInt64, recipient: Address) {
            self.id = id
            self.mintedAt = getCurrentBlock().timestamp
            self.mintedBy = recipient
        }

        /// Get all supported views for this NFT
        pub fun getViews(): [Type] {
            return [
                Type<MetadataViews.Display>(),
                Type<MetadataViews.Serial>(),
                Type<MetadataViews.NFTCollectionData>(),
                Type<MetadataViews.NFTCollectionDisplay>(),
                Type<MetadataViews.ExternalURL>(),
                Type<MetadataViews.Traits>()
            ]
        }

        /// Resolve a specific view for this NFT
        pub fun resolveView(_ view: Type): AnyStruct? {
            switch view {
                case Type<MetadataViews.Display>():
                    return MetadataViews.Display(
                        name: "Scout Credential #".concat(self.id.toString()),
                        description: "Official Scout Credential NFT for ScoutyStream platform. This credential verifies the holder as a legitimate professional scout.",
                        thumbnail: MetadataViews.HTTPFile(
                            url: "https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Scout+".concat(self.id.toString())
                        )
                    )
                case Type<MetadataViews.Serial>():
                    return MetadataViews.Serial(self.id)
                case Type<MetadataViews.ExternalURL>():
                    return MetadataViews.ExternalURL("https://scoutystream.com/credentials/".concat(self.id.toString()))
                case Type<MetadataViews.NFTCollectionData>():
                    return MetadataViews.NFTCollectionData(
                        storagePath: ScoutCredential.CollectionStoragePath,
                        publicPath: ScoutCredential.CollectionPublicPath,
                        providerPath: /private/scoutCredentialCollection,
                        publicCollection: Type<&ScoutCredential.Collection{ScoutCredential.ScoutCredentialCollectionPublic}>(),
                        publicLinkedType: Type<&ScoutCredential.Collection{ScoutCredential.ScoutCredentialCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver,MetadataViews.ResolverCollection}>(),
                        providerLinkedType: Type<&ScoutCredential.Collection{ScoutCredential.ScoutCredentialCollectionPublic,NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,MetadataViews.ResolverCollection}>(),
                        createEmptyCollectionFunction: (fun (): @NonFungibleToken.Collection {
                            return <-ScoutCredential.createEmptyCollection()
                        })
                    )
                case Type<MetadataViews.NFTCollectionDisplay>():
                    let media = MetadataViews.Media(
                        file: MetadataViews.HTTPFile(
                            url: "https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=ScoutyStream"
                        ),
                        mediaType: "image/png"
                    )
                    return MetadataViews.NFTCollectionDisplay(
                        name: "Scout Credentials",
                        description: "Official Scout Credential NFTs for the ScoutyStream platform",
                        externalURL: MetadataViews.ExternalURL("https://scoutystream.com"),
                        squareImage: media,
                        bannerImage: media,
                        socials: {}
                    )
                case Type<MetadataViews.Traits>():
                    return MetadataViews.Traits([
                        MetadataViews.Trait(
                            name: "Minted At",
                            value: self.mintedAt,
                            displayType: "Date",
                            rarity: nil
                        ),
                        MetadataViews.Trait(
                            name: "Scout ID",
                            value: self.id,
                            displayType: "Number",
                            rarity: nil
                        )
                    ])
            }
            return nil
        }
    }

    /// Collection Resource Interface
    pub resource interface ScoutCredentialCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowScoutCredential(id: UInt64): &ScoutCredential.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow ScoutCredential reference: the ID of the returned reference is incorrect"
            }
        }
    }

    /// Collection Resource
    pub resource Collection: ScoutCredentialCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, ViewResolver.ResolverCollection {
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

        pub fun borrowViewResolver(id: UInt64): &AnyResource{ViewResolver.Resolver} {
            let nft = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            let scoutCredential = nft as! &ScoutCredential.NFT
            return scoutCredential as &AnyResource{ViewResolver.Resolver}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    /// Create an empty Collection resource
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    /// Mint a new Scout Credential NFT
    /// Anyone can mint their own credential (one per account recommended)
    pub fun mintNFT(recipient: &{NonFungibleToken.CollectionPublic}) {
        let currentId = self.totalSupply
        self.totalSupply = self.totalSupply + UInt64(1)

        let newNFT <- create NFT(
            id: currentId,
            recipient: recipient.owner!.address
        )

        emit CredentialMinted(
            id: currentId,
            recipient: recipient.owner!.address,
            timestamp: getCurrentBlock().timestamp
        )

        recipient.deposit(token: <-newNFT)
    }

    /// Get the total number of Scout Credentials minted
    pub fun getTotalSupply(): UInt64 {
        return self.totalSupply
    }

    /// Initialize the contract
    init() {
        self.totalSupply = 0

        self.CollectionStoragePath = /storage/scoutCredentialCollection
        self.CollectionPublicPath = /public/scoutCredentialCollection

        emit ContractInitialized()
    }
}
