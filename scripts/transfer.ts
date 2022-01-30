import { program } from "commander";
import {
  Keypair,
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  RpcResponseAndContext,
  AccountInfo,
} from "@solana/web3.js";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";
import { programs } from "@metaplex/js";
import {
  MasterEdition,
} from "@metaplex-foundation/mpl-token-metadata";
import athleteMints1 from "./athletes_mints_1.json"

const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const dolphinMasterEditions = [
  "BW9VmiCrAxVKpS2dLC6SBfMMfrQVcxAirSUeDhLeMbYk",
  "AQ5TxUP5LyJkjumpCAwrPgHB6tCn4Keod5cm5wDkchDL",
  "G6PbhuSw2xBc3X58Q2aAXYBb8Qvhw9enPK6gGsGmFtXJ",
  "4hpF7F2R6pMh12JSJSN5G67ZWNzPrmRCA27KhemhzKqf",
  "JA6C1WiiZXwVkCMZBQ9D4yrwvDs5GijoMhDw9gHhafgD",
  "C7Fy9P58ghbBJ5Ju9LuhAXsFASpsQc7N9ir2bb8D11bi",
  "J83FXmA92ie678ZEVX6iVjBGUJD364fVi5MTGLgzBujT",
  "3H4L2sFD7GHP4M1HMU4uKWn3B2fcQauRhLgSEGgP7fnW",
  "EuMR5FdBu98GJUafwC6HbrXgFCeCxxJ3WaaicNxTZvJG",
  "4mdiB6WWTS7GvtVVJaL1LQz2oCpuf46Xo6ZqAkCL4fnE",
  "AaLDu4nHiJSWgfgKeTryznyzT3UPsfBgibNPtfSwH65G",
  "3fPCenYgC3P2N1Bs8TssmCs6EXwUCAaSR7GqCToka12X",
  "9i62wU2xJCBznwDb5egMwBS7sehLYRUN9AoDG2XxvaK6",
  "8FgKiAahpZGLer9pR1ahsdnEEZiDXenXDaG1TbVUbqY2",
  "9tyChjFwd5Ejiyz7QaHz5WqTcNboCBqpyNnJnXhKLqVN",
  "Ahk8SCwZeUsjegXp8nSgkVHgnFgWN1Wu42Hb4ruK2vXV",
  "93J5T37EvVF3AFCh6yQVmioLmvQArDiw3vrqjoEodCVw",
  "8Jr6suAbTvJbZgaF6xEMJASJbTWeJ36we9X8nJY3xLX3",
  "oPyjr6j8bQ1cUUDWefAhbLSPfr96jnJwM36eMkTjrdM",
  "BxPwZbbcjJcjUDtKzX5PH9bKobVub6BZVzYpUU9pBds8",
  "jdaD9GPFnAKcryDBztdsrXjJgCgeEoj1QgTTK85y1AR",
  "E6sepfNwZ1vQi6jTvPQj2cC5dFqQvpEuN2ALCbYMBiC9",
  "EpdvjYJq3eKLbmAJdZgPF2X3prZ6kHL8ZS1AQf4iwUhc",
  "9iMYzusF5Mowmg6vpmkN4Vnsu6ajKsCoJL5XpnsgeLhF",
  "36zSzErJTPWnSN4RJWrM17RL4kU4Zz8QTNcPYTCUHQsd",
  "TcyUZA7C75fKQYwZNDKAwwYxJq58bWTtnorGnBRoxwD",
  "DypvcjuDYy94Z8YoveSLjZxZXchM7GE7BciEHxHNeNgW",
  "8Gq2JrxPno3cNBQEXFaJ46VmUjG36AuhDUt3fqzFvGKH",
  "DHQe2zv8CKacpSfHcsLaaL5DW77p9RJKyXhEit9wBD5B",
  "9AT1kQqV5Vxmd3o6PkMS5mWG8Y1f48baR1XBja4YFoGS",
  "7JChgL4qv97KBBi79DaDPMxs6y74BKb6n85mE1AcCbf9",
  "HVPEYk2DZTxm7f7ogksLjcLZiBgjJJKyQ96EJigcS7ax",
  "5oMXqr7Egs5zjxs7Qu9tq5XKb95KiRofJvAZdJjcEt6N",
  "DPegLgUjksN55uMZenKsNBX3M9nGSRaqGgzpzXpxKQBn",
  "FWju5hdeNnr7zXDss4jBPc3DKr8iMEHEAUjiybohTaEE",
  "8qpSSquZyUCA3ZGi1k1GhKCXhEzqyhRfcchVbSxg8eyR",
  "AYVeXHVmfNq8JWqV2R8eUzK5DrUAt9amFyUUk7i7pkd2",
  "J7qr8hMP8Mqjwx29q5dvzvuKrUXkoyNhuynjAR1QE8Ep",
  "qLgpECA6Es8iZhcFZWNuBQpCVTcsyAA7Z3owpeuXgbL",
  "BFDLLK5pQo9Ad9y72GAnZ4erNjWiZwtrSHQY1EALcAHk",
  "4KGBe5U5TqBiJ59ELVSqEyUrmAN4B6urt3mYv1mJx6Kx",
  "EnyNc4DXZ9gyhVBZzCyn59pAB21bM3Nfgm8u2bn4Rc9L",
  "9th2FBWRSg43CRAQqPrLDhzs89p9FQLqX9AzqYpmWnTF",
  "DJMDcxSDPWoMVpuUKjV5B97nJCkea1BFfd1iD7KNDDJP",
  "DRVGyd9pCJJVmpycK6hPyCQiyREa9spE6sceWuUV4UKR",
  "39ZMDc8LC3t19sbeJbMoJ7MFWo8kMLq7TLi4dTLFmYvZ",
  "7GrAc3jXGjPtFSi5WFYuZQhmtNy6Ys5GRrBm78VsczuD",
  "2UcTAnyu1g2AD6ZP87n6QZY4RXDyfykgSKEPRSJRY1KF",
  "3ahd183mRHikPwhw5NoMAjtMiP1dort54YhLW3Lnsfv3",
  "ED1HofA7tkgdgXRgAEj2FiYJ4QbyHig9HUnKzxbzwj3x",
  "GbcQ3ikM9i9Bdy3SLD7D2eqZ4EnJsGUbB2LrwHnoYRQT",
  "5tabjwrmtVr4dgmTvpzQBW6GWZFwV22KedJULD9f5DgL",
  "7nDYJp7tNxChFtPLL9VwLPmRgQpcRttJ1ZmPAA7TNBdk",
  "BXLJfFX7odpEwyQBets7MbLe4noS3FUC1nMAWndcn5Vs",
  "DRMbakKwiEF4Xb39BmvVUWYpCaJgzqYGJcLJET55TtmC",
  "9MkquRBbrNdanLvrNMiRNkUWqgLkfz3HYUEjLPymgPNX",
  "8NVMRsdhnWsRkFtxW2suwVss5tw7S19B7ZEhb56uKQFv",
  "Cxg4NP5EWHHJn9v8jwwLHiw8bGye9N6jfnf3FKcgjooE",
  "HMCt6n5enzqQcSX4StpF7fAmsR5KYijQ1kJAJp5N142Q",
  "BaDmgeqFk8p9mhw5vtATE8Sm7LmmydbTt2JK5yYTMzJT",
  "6UTf5EdmbpfFsm2yFNawAv8xGuwv7ymhpHSAWiC3W1Bi",
  "9hekr7nfMcmZkwYknYiQHquJkggaERJfj59TvTVx9cC3",
  "GDUrkZtPTEznvek5xhpq5wKYL9q6hZM9WSASYVXDFeRp",
  "7zqp8NSLqWoh5TMMHFqmE5YJtC4KcCYzg2z8rEGSEdcL",
  "GNtMnTfvqt6HWZYMhrnneeTECLg4NmTdbZsPCjb7n1tj",
  "GoZLTeSyeiz5GVAgWho6wcbbgCoomXdNKweJXhYChCzm",
  "8Vtx9CiuJRhhF5bgc4radBqmMf1iyHtwYej41vrvTmZh",
  "J5Vi8WirWuV4ZLqW693SFKa24tKmRkYB4DT7ZgGww8jB",
  "BFa5Lq6WYH1ZL22tjDLoB6simtNYhAeF4pkjwqjoUneU",
  "GjV1DWBRYP7GnkkQP1wvcfawE5o2cB1ephkY96nokjVr",
  "4FCbK5fqEYwUnpAXKeMYjmy8zAFm1DGLiQ8o51rzjLJ7",
  "Ce9cQiA4BN1Qd5U7nkRYuUpHPV5LHvnQknBZ76brefT2",
];

const wait = (delayMS: number) =>
  new Promise((resolve) => setTimeout(resolve, delayMS));

const filterTokenAccounts = async (
  connection: Connection,
  tokenAccountsResponse: RpcResponseAndContext<
    {
      pubkey: PublicKey;
      account: AccountInfo<Buffer>;
    }[]
  >,
  opts: { nftsOnly: boolean; symbol?: string } = { nftsOnly: false }
) => {
  const { nftsOnly, symbol } = opts;
  const accounts = await Promise.all(
    tokenAccountsResponse.value.map(async ({ account, pubkey }, index) => {
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
      let metaData = undefined;
      if (nftsOnly) {
        // Avoid RPC rate limites
        await wait(index * 2_500);
        // Look up Metadata account with memcmp filter based on the token mint
        console.log(`Looking up metadat program accounts for index: ${index}`);
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
        if (metadataAccount) {
          metaData = await programs.metadata.Metadata.load(
            connection,
            metadataAccount.pubkey
          );
        }
      }
      return { tokenAccount, metaData };
    })
  );

  let filteredAccounts = accounts;
  if (nftsOnly) {
    console.log("Filtering token accounts for metadata (i.e. only NFTs)");
    filteredAccounts = filteredAccounts.filter(
      (x) => x.metaData && x.metaData.data
    );
    if (symbol) {
      console.log(`Filtering accounts by metadta symbol: ${symbol}`);
      // Filter all owned NFTs by symbol
      filteredAccounts = filteredAccounts.filter(
        (x) => x.metaData && x.metaData.data.data.symbol === symbol
      );
    }
  }
  filteredAccounts = filteredAccounts.filter((x) => !dolphinMasterEditions.includes(x.tokenAccount.address.toString()) && !dolphinMasterEditions.includes(x.tokenAccount.mint.toString()))
  filteredAccounts = filteredAccounts.filter((x) => athleteMints1.includes(x.tokenAccount.mint.toString()))
  return filteredAccounts;
};

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
programCommand("list")
  .description("List all SPL Tokens in a wallet")
  .option("--nfts-only <nftsOnly>", "Flag to list only NFTs")
  .option("-s, --symbol <symbol>", "Symbol to filter NFTs on", "CC")
  .option(
    "-r, --rpc-url <rpcUrl>",
    "custom rpc url since this is a heavy command"
  )
  .action(async (options, cmd) => {
    const { keypair, env, symbol, rpcUrl: rpcUrlArg, nftsOnly } = options;

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
    const rpcUrl = rpcUrlArg || clusterApiUrl(env);
    const connection = new Connection(rpcUrl);

    // Get all tokens from the wallet
    console.log(`Getting all tokens for wallet: ${payer.publicKey}`);
    const resp = await connection.getTokenAccountsByOwner(payer.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    const tokenAccounts = await filterTokenAccounts(connection, resp, {
      nftsOnly,
      symbol,
    });

    console.log("Printing token mint addresses\n");
    tokenAccounts.forEach((account) => {
      console.log(account.tokenAccount.mint.toString());
    });
  });

programCommand("transfer")
  .argument(
    "<string>",
    "The public key to transfer the NFTs to",
    (val) => new PublicKey(val)
  )
  .option("--nfts-only <nftsOnly>", "Flag to list only NFTs")
  .option("-s, --symbol <string>", "Symbol to filter NFTs for transfer", "CC")
  .option(
    "-r, --rpc-url <string>",
    "custom rpc url since this is a heavy command"
  )
  .action(async (toKey, options, cmd) => {
    const { keypair, env, symbol, rpcUrl: rpcUrlArg, nftsOnly } = cmd.opts();

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
    const rpcUrl = rpcUrlArg || clusterApiUrl(env);
    const connection = new Connection(rpcUrl);

    // Get all tokens from the wallet
    console.log(`Getting all tokens for wallet: ${payer.publicKey}`);
    const resp = await connection.getTokenAccountsByOwner(payer.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    const tokenAccounts = await filterTokenAccounts(connection, resp, {
      nftsOnly,
      symbol,
    });

    // Initiate the transfer for each NFT
    console.log(
      `Starting transfer of ${
        tokenAccounts.length
      } NFTs with symbol ${symbol} to ${toKey.toString()}`
    );

    const starterPromise = Promise.resolve(null);
    await tokenAccounts.reduce(async (accumulator, nftAccount) => {
      try {
        // Avoid RPC node limits by running sequentially
        await accumulator;

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
        console.log(`${new Date().getTime()} - Transfering item`);
        // Send the transaction
        await sendAndConfirmTransaction(connection, transaction, [payer], {
          commitment: "confirmed",
        });
      } catch (error) {
        console.log("Error sending item: ", error);
      }

      return null;
    }, starterPromise);
  });

program
  .command("getEditionsFromMaster")
  .description("WORK IN PROGRESS DO NOT USE IN PRODUCTION")
  .option(
    "-e, --env <string>",
    "Solana cluster env name",
    "devnet" //mainnet-beta, testnet, devnet
  )
  .argument(
    "<masterEditionAddress>",
    "The address of the master edition that minted the Editions.",
    (val) => new PublicKey(val)
  )
  .option(
    "-r, --rpc-url <string>",
    "custom rpc url since this is a heavy command"
  )
  .action(async (masterEditionKey, options, cmd) => {
    const { env, rpcUrl: rpcUrlArg } = cmd.opts();
    const rpcUrl = rpcUrlArg || clusterApiUrl(env);
    const connection = new Connection(rpcUrl);
    const masterEditionPda = await MasterEdition.getPDA(masterEditionKey);

    // Load the master edition account info
    const masterEditionAccountInfo = await connection.getAccountInfo(
      masterEditionPda,
      "processed"
    );
    if (!masterEditionAccountInfo) {
      throw new Error(`MasterEdition not found for ${masterEditionKey}`);
    }

    // Create a MasterEdition instance
    const masterEdition = new MasterEdition(
      masterEditionPda,
      masterEditionAccountInfo
    );
    // TODO: load all of the editions
    const editions = await masterEdition.getEditions(connection);
    console.log("*** editions\n", editions);
  });

program.parse(process.argv);
