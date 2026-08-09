import crypto from 'node:crypto'

/**
 * KMS-Compatible Envelope Encryption Engine (KEK / DEK Pattern).
 *
 * Architecture:
 * 1. Master Key (KEK - Key Encryption Key) encrypts per-record DEKs.
 * 2. Data Encryption Key (DEK) encrypts actual secret payload (tokens, keys).
 * 3. Payload stores: { kekVersion, keyVersion, encryptedDEK, iv, authTag, ciphertext }.
 */

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const DEK_LENGTH = 32

export interface EncryptedEnvelope {
  kekVersion: number
  keyVersion: number
  encryptedDEK: string
  iv: string
  authTag: string
  ciphertext: string
}

function getMasterKEK(version: number = 1): Buffer {
  const envVar = version === 1 ? 'MASTER_KEK' : `MASTER_KEK_V${version}`
  let kekHex = process.env[envVar]

  if (!kekHex) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`[envelope-crypto] Missing Master KEK environment variable ${envVar}`)
    }
    // Fallback 32-byte Master KEK for development
    kekHex = '8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f'
  }

  const kekBuffer = Buffer.from(kekHex, 'hex')
  if (kekBuffer.length !== 32) {
    throw new Error(`[envelope-crypto] Master KEK must be 64-character hex string (32 bytes).`)
  }

  return kekBuffer
}

/**
 * Encrypt a secret string using Envelope Encryption.
 */
export function encryptEnvelope(plaintext: string, kekVersion: number = 1): EncryptedEnvelope {
  if (!plaintext) {
    throw new Error('[envelope-crypto] Cannot encrypt empty plaintext')
  }

  const masterKEK = getMasterKEK(kekVersion)

  // 1. Generate unique per-record Data Encryption Key (DEK)
  const dek = crypto.randomBytes(DEK_LENGTH)

  // 2. Encrypt plaintext with DEK
  const ivPayload = crypto.randomBytes(IV_LENGTH)
  const cipherPayload = crypto.createCipheriv(ALGORITHM, dek, ivPayload)
  let ciphertext = cipherPayload.update(plaintext, 'utf8', 'hex')
  ciphertext += cipherPayload.final('hex')
  const authTagPayload = cipherPayload.getAuthTag().toString('hex')

  // 3. Encrypt DEK with Master KEK
  const ivDEK = crypto.randomBytes(IV_LENGTH)
  const cipherDEK = crypto.createCipheriv(ALGORITHM, masterKEK, ivDEK)
  let encryptedDEKHex = cipherDEK.update(dek.toString('hex'), 'utf8', 'hex')
  encryptedDEKHex += cipherDEK.final('hex')
  const authTagDEK = cipherDEK.getAuthTag().toString('hex')

  const fullEncryptedDEK = `${ivDEK.toString('hex')}:${authTagDEK}:${encryptedDEKHex}`

  return {
    kekVersion,
    keyVersion: 1,
    encryptedDEK: fullEncryptedDEK,
    iv: ivPayload.toString('hex'),
    authTag: authTagPayload,
    ciphertext,
  }
}

/**
 * Decrypt a secret string using Envelope Encryption.
 */
export function decryptEnvelope(envelope: EncryptedEnvelope): string {
  const masterKEK = getMasterKEK(envelope.kekVersion)

  // 1. Decrypt DEK using Master KEK
  const [ivDEKHex, authTagDEKHex, encryptedDEKHex] = envelope.encryptedDEK.split(':')
  const decipherDEK = crypto.createDecipheriv(ALGORITHM, masterKEK, Buffer.from(ivDEKHex, 'hex'))
  decipherDEK.setAuthTag(Buffer.from(authTagDEKHex, 'hex'))
  let dekHex = decipherDEK.update(encryptedDEKHex, 'hex', 'utf8')
  dekHex += decipherDEK.final('utf8')

  const dek = Buffer.from(dekHex, 'hex')

  // 2. Decrypt Payload using DEK
  const decipherPayload = crypto.createDecipheriv(ALGORITHM, dek, Buffer.from(envelope.iv, 'hex'))
  decipherPayload.setAuthTag(Buffer.from(envelope.authTag, 'hex'))
  let plaintext = decipherPayload.update(envelope.ciphertext, 'hex', 'utf8')
  plaintext += decipherPayload.final('utf8')

  return plaintext
}
