import bs58 from 'bs58';
// @ts-ignore
import promptSync from 'prompt-sync';
// ---- Converter Functions ----
const prompt = promptSync();

function base58ToWallet() {
  const base58 = prompt('Enter Base58 private key (Phantom): ');
  if (!base58) return;
  try {
    const wallet = bs58.decode(base58);
    console.log('Byte array format:', Array.from(wallet));
  } catch (e) {
    console.log('Error decoding:', e);
  }
}

function walletToBase58() {
  const input = prompt('Enter byte array (comma separated): ');
  if (!input) return;
  try {
    const wallet = Uint8Array.from(input.split(',').map(Number));
    const base58 = bs58.encode(wallet);
    console.log('Base58 format:', base58);
  } catch (e) {
    console.log('Error encoding:', e);
  }
}

console.log('Converter Menu:');
console.log('1. Base58 → Wallet (byte array)');
console.log('2. Wallet (byte array) → Base58');
const choice = prompt('Enter your option (1/2): ');

if (choice === '1') {
  base58ToWallet();
} else if (choice === '2') {
  walletToBase58();
} else {
  console.log('Invalid option!');
}