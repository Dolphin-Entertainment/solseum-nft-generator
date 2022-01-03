import { program } from "commander";
import {
  Keypair,
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";
import { programs } from "@metaplex/js";

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const wait = (delayMS: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMS));

function programCommand(name: string) {
  return program
    .command(name)
    .option(
      "-e, --env <string>",
      "Solana cluster env name",
      "devnet" //mainnet-beta, testnet, devnet
    )
    .option(
      "-k, --keypair <path>",
      `Solana wallet location`,
      "--keypair not provided"
    );
}

programCommand("transfer")
  .argument(
    "<string>",
    "The public key to transfer the NFTs to",
    (val) => new PublicKey(val)
  )
  .option("-s, --symbol <string>", "Symbol to filter NFTs for transfer", "CC")
  .action(async (toKey, options, cmd) => {
    const { keypair, env, symbol } = cmd.opts();

    // Load wallet keypair
    const payer = Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          require("fs").readFileSync(keypair, {
            encoding: "utf-8",
          })
        )
      )
    );

    // Create connection to RPC cluster
    const rpcUrl = clusterApiUrl(env);
    const connection = new Connection(rpcUrl);

    // Get all tokens from the wallet
    console.log(`Getting all tokens for wallet: ${payer.publicKey}`);
    const resp = await connection.getTokenAccountsByOwner(payer.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    const tokenAccounts = await Promise.all(
      resp.value.map(async ({ account, pubkey }, index) => {
        // Avoid RPC rate limites
        await wait(index * 1_500);

        const decoded = AccountLayout.decode(account.data);
        const tokenAccount = {
          address: pubkey,
          mint: new PublicKey(decoded.mint),
          owner: new PublicKey(decoded.owner),
          amount: new u64(decoded.amount),
          delegate: new PublicKey(decoded.delegate),
          isInitialized: decoded.state === 1,
          isNative: decoded.isNativeOption === 1,
          delegatedAmount: new u64(decoded.delegatedAmount),
          closeAuthority: new PublicKey(decoded.closeAuthority),
        };
        // Look up Metadata account with memcmp filter based on the token mint
        console.log(`Looking up program accounts for index: ${index}`);
        const res = await connection.getProgramAccounts(METADATA_PROGRAM_ID, {
          filters: [
            {
              memcmp: {
                offset:
                  1 + // key
                  32, // update auth
                // 32 + // mint
                bytes: tokenAccount.mint.toBase58(),
              },
            },
          ],
        });
        // If there is a Metadata account, load and deserialize the data
        const metadataAccount = res[0];
        let metaData = undefined;
        if (metadataAccount) {
          metaData = await programs.metadata.Metadata.load(
            connection,
            metadataAccount.pubkey
          );
        }
        return { tokenAccount, metaData };
      })
    );

    // Filter all owned NFTs by symbol
    const nftAccounts = tokenAccounts.filter(
      (x) => x.metaData && x.metaData.data.data.symbol === symbol
    );

    // Initiate the transfer for each NFT
    console.log(
      `Starting transfer of ${
        nftAccounts.length
      } NFTs with symbol ${symbol} to ${toKey.toString()}`
    );

    const starterPromise = Promise.resolve(null);
    await nftAccounts.reduce(async (accumulator, nftAccount) => {
      await accumulator;
      // Avoid RPC node limits
      await wait(1000);
      const tokenAccount = nftAccount.tokenAccount;
      const transaction = new Transaction();
      // Create the Associated Token Account for the toKey
      const associatedAddress = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        tokenAccount.mint,
        toKey
      );
      transaction.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          tokenAccount.mint,
          associatedAddress,
          toKey,
          payer.publicKey
        )
      );
      // Transfer the NFT to the new account
      transaction.add(
        Token.createTransferCheckedInstruction(
          TOKEN_PROGRAM_ID,
          tokenAccount.address,
          tokenAccount.mint,
          associatedAddress,
          payer.publicKey,
          [],
          1,
          0
        )
      );

      // Close out the old account to get the rent back
      transaction.add(
        Token.createCloseAccountInstruction(
          TOKEN_PROGRAM_ID,
          tokenAccount.address,
          payer.publicKey,
          payer.publicKey,
          []
        )
      );

      // Send the transaction
      await sendAndConfirmTransaction(connection, transaction, [payer], {
        commitment: "confirmed",
      });
      
      return null;
    }, starterPromise);
  });

program.parse(process.argv);
