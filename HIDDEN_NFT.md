## How to create a hidden NFT

1. Change images/hidden.png to the appropriate image
2. Update input/template.json to contain the correct information
3. Generate X NFTs by running `ts-node scripts/generateHiddenNfts.ts X`
4. Validate the NFT Assets, [see docs](https://docs.metaplex.com/create-candy/validate-assets)
5. Upload the NFT Assets to a Candy Machine `ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts upload ./output/nfts/public_mint_assets --env devnet --keypair ~/.config/solana/id.json`
    * [Metaplex Docs](https://docs.metaplex.com/create-candy/upload-assets)
6. Initialize the Candy Machine `ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts create_candy_machine --env devnet --keypair ~/.config/solana/id.json -p 1.5`
7.  Update the Candy Machine 
````
ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts \
update_candy_machine \
--env devnet \
--keypair ~/.config/solana/id.json \
-p 1.5 \
--date "13 Dec 2021 17:00:00 GMT"
````
8. Mint tokens to wallet address (for transfer to centralized exchange like FTX market place) `ts-node ~/metaplex-foundation/metaplex/js/packages/cli/src/candy-machine-cli.ts mint_multiple_tokens -k ~/.config/solana/id.json --number Y`
9. Transfer all NFTs with symbol to another address `ts-node scripts/transfer.ts transfer --symbol CC --env devnet --keypair ~/.config/solana/id.json 6zQVq2wM1fMuMTBuizGFChQjujorpdTEot5CVCTjRjGG`

