/***
 * Just use the following command from https://docs.metaplex.com/create-candy/upload-assets
 * ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts upload output/nfts/public_mint_assets --env devnet --keypair ~/.config/solana/id.json
 */


// TODO: figure out how to mint to the current address
// https://github.com/metaplex-foundation/metaplex/blob/59ab126e41e6d85b53c79ad7358964dadd12b5f4/js/packages/cli/src/commands/mint.ts#L19

// Maybe the simplest thing is to create a new candy machine and mint all through the candy machine
//  Then some could be left in the candy machine so others off FTX could mint by hooking it up to 
//  the frontend?
//    
//  Is there the ability to add a whitelist for the beginning to ensure NFTs cannot get sniped
//  by bots? Not sure if this is a major concern, just something to think about.
//    The authority can mint ahead of the candy machine start date && is not charged for minting. See here 
//     https://github.com/metaplex-foundation/metaplex/blob/master/rust/nft-candy-machine/src/lib.rs#L37-L50
//    If there is not go_live_date then only the authority can mint.


