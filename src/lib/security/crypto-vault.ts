import crypto from "crypto";

// Key derivation from environment secret (Must be 32 bytes for AES-256-GCM)
function getDerivedKey(): Buffer {
  const secret = process.env.DGI_ENCRYPTION_SECRET || "default_development_secret_32bytes_!";
  return crypto.createHash("sha256").update(secret).digest();
}

export interface EncryptedPayload {
  encryptedDataHex: string;
  ivHex: string;
  authTagHex: string;
}

/**
 * Cifra datos de facturas fiscales DGI usando AES-256-GCM (Grado Bancario Zero-Trust).
 */
export function encryptDgiData(plainText: string): EncryptedPayload {
  const key = getDerivedKey();
  const iv = crypto.randomBytes(12); // Standard 96-bit IV for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encryptedDataHex: encrypted,
    ivHex: iv.toString("hex"),
    authTagHex: authTag.toString("hex"),
  };
}

/**
 * Descifra datos fiscales verificando autenticidad con Auth Tag en GCM.
 */
export function decryptDgiData(
  encryptedDataHex: string,
  ivHex: string,
  authTagHex: string
): string {
  const key = getDerivedKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedDataHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Sanitizador de inyección de prompts para proteger a Gemini 3.8 Flash.
 * Neutraliza intentos de jailbreak en pliegos de PanamáCompra o textos externos.
 */
export function sanitizePromptInput(input: string): string {
  if (!input) return "";

  // Remove potential system prompt override tokens & delimiter manipulations
  return input
    .replace(/<system>[\s\S]*?<\/system>/gi, "")
    .replace(/<instructions>[\s\S]*?<\/instructions>/gi, "")
    .replace(/ignore (all )?(previous|above) instructions/gi, "[REMOVED_OVERRIDE_ATTEMPT]")
    .replace(/disregard (all )?(previous|above) instructions/gi, "[REMOVED_OVERRIDE_ATTEMPT]")
    .replace(/system:\s*you are now/gi, "[REMOVED_ROLE_HIJACK]")
    .trim();
}
