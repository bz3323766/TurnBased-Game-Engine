import CryptoJS from 'crypto-js';

// Function to hash the server key using CryptoJS
export function generateHash(key: string): string {
    return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex);
}
