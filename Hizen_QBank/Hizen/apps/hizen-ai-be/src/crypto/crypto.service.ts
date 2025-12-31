import { Injectable, Logger } from "@nestjs/common";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

import { GlobalConfig } from "@app/global/global";

export interface Encrypted {
  data: string;
  iv: string;
  authTag: string;
}

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;
  private readonly keyLength = 32;

  constructor() {
    this.key = Buffer.from(
      GlobalConfig.Instance.DatabaseEncryptionKey,
      "base64url",
    );

    if (this.key.length != this.keyLength) {
      this.logger.fatal(
        `invalid key length; expected ${this.keyLength} bytes, got ${this.key.length}. this will break the encryption/decryption process.`,
      );
    }
  }

  encrypt(data: string | Buffer): Encrypted {
    const iv = randomBytes(12);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted: string;

    if (typeof data == "string") {
      encrypted = cipher.update(data, "utf8", "base64url");
    } else {
      encrypted = cipher.update(data, undefined, "base64url");
    }

    encrypted += cipher.final("base64url");
    const authTag = cipher.getAuthTag().toString("base64url");

    return {
      data: encrypted,
      iv: iv.toString("base64url"),
      authTag,
    };
  }

  decrypt(encrypted: Encrypted): Buffer | null {
    const decipher = createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encrypted.iv, "base64url"),
    );

    decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64url"));

    let decrypted = decipher.update(encrypted.data, "base64url");

    try {
      decrypted = Buffer.concat([decrypted, decipher.final()]);
    } catch (error: unknown) {
      this.logger.warn("failed to decrypt data", {
        error,
      });
      return null;
    }

    return decrypted;
  }
}
