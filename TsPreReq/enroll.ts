import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

const PROGRAM_ID = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");
const MINT_COLLECTION = new PublicKey("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2");
const SYSTEM_PROGRAM_ID = SystemProgram.programId;

const keypair = Keypair.fromSecretKey(Uint8Array.from(wallet as number[]));
const userPublicKey = keypair.publicKey;

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });

const program  = new Program(IDL, provider);

// PDA for the prereq account
const account_seeds = [
  Buffer.from("prereqs"),
  userPublicKey.toBuffer(),
];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(account_seeds, program.programId);

// Mint account for the new asset
const mintTs = Keypair.generate();

// Authority PDA for submitTs (see IDL: seeds = ["collection", collection pubkey])
const authoritySeeds = [
  Buffer.from("collection"),
  MINT_COLLECTION.toBuffer(),
];
const [authorityPda, _authorityBump] = PublicKey.findProgramAddressSync(authoritySeeds, program.programId);

// --------- 1. Initialize Transaction ---------
// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("TanzimHossainSafin") // 
//       .accounts({
//         user: userPublicKey,
//         account: account_key,
//         system_program: SYSTEM_PROGRAM_ID,
//       })
//       .signers([keypair])
//       .rpc();
//     console.log(`Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//   } catch (e) {
//     console.error(`Oops, something went wrong (initialize): ${e}`);
//   }
// })();

// --------- 2. SubmitTs Transaction ---------


// Execute the submitTs transaction
(async () => {
  try {
    const txhash = await program.methods
      .submitTs() // 
      .accounts({
        user: keypair.publicKey,
        account: account_key, 
        mint: mintTs.publicKey,
        collection: MINT_COLLECTION,
        authority: authorityPda, 
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID 
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`Success! Check out your TX here:\nhttps://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
