// src/utils/crypto.ts

// Simple helper to open/manage IndexedDB to store the Private Key securely on-device
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MeditCryptoDB", 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("keys");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// 1. Generate an E2EE Key Pair
export async function generateE2EEKeyPair(): Promise<{
  publicKeyJwk: JsonWebKey;
  privateKey: CryptoKey;
}> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable public key
    ["encrypt", "decrypt"],
  );

  const publicKeyJwk = await window.crypto.subtle.exportKey(
    "jwk",
    keyPair.publicKey,
  );

  // Store Private Key securely inside local IndexedDB
  const db = await openDB();
  const tx = db.transaction("keys", "readwrite");
  tx.objectStore("keys").put(keyPair.privateKey, "privateKey");

  return { publicKeyJwk, privateKey: keyPair.privateKey };
}

// 2. Retrieve local Private Key from IndexedDB
export async function getLocalPrivateKey(): Promise<CryptoKey | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction("keys", "readonly");
    const req = tx.objectStore("keys").get("privateKey");
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

// 3. Encrypt data using Receiver's Public Key
export async function encryptMessage(
  text: string,
  receiverPublicKeyJwk: JsonWebKey,
): Promise<string> {
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(text);

  // Import the receiver's public key
  const receiverPublicKey = await window.crypto.subtle.importKey(
    "jwk",
    receiverPublicKeyJwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"],
  );

  // Generate a temporary raw AES symmetric key for the bulk content
  const aesKey = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  // Encrypt the message text with the AES key
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedMessage,
  );

  // Export and encrypt the AES key using the receiver's RSA Public Key
  const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const encryptedAesKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    receiverPublicKey,
    exportedAesKey,
  );

  // Bundle everything cleanly into a transportable string
  const payload = {
    content: btoa(String.fromCharCode(...new Uint8Array(encryptedContent))),
    encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedAesKey))),
    iv: btoa(String.fromCharCode(...iv)),
  };

  return JSON.stringify(payload);
}

// 4. Decrypt data using Senders/Receivers own Private Key
export async function decryptMessage(
  encryptedPayloadString: string,
  privateKey: CryptoKey,
): Promise<string> {
  try {
    const payload = JSON.parse(encryptedPayloadString);

    const encryptedContent = new Uint8Array(
      atob(payload.content)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );
    const encryptedAesKey = new Uint8Array(
      atob(payload.encryptedKey)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );
    const iv = new Uint8Array(
      atob(payload.iv)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );

    // Decrypt the temporary AES content key using local Private Key
    const decryptedAesKeyRaw = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedAesKey,
    );

    // Import the raw AES key back
    const aesKey = await window.crypto.subtle.importKey(
      "raw",
      decryptedAesKeyRaw,
      { name: "AES-GCM" },
      true,
      ["decrypt"],
    );

    // Decrypt the raw payload text
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      encryptedContent,
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("E2EE Decryption Error:", error);
    return "🔐 [Unable to decrypt message on this device]";
  }
}
