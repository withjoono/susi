import { Injectable } from "@nestjs/common";
import { randomBytes } from "crypto";
import { sign, verify } from "jsonwebtoken";

@Injectable()
export class AuthTokenService {
  /**
   * Generates random token of 512 bits.
   */
  createRandomString(): string {
    return randomBytes(64).toString("base64url");
  }

  /**
   * Creates JWT token with given payload and expiry.
   *
   * It uses `HS512` algorithm.
   *
   * @param payload The payload to be encoded in the token.
   * @param expiry The expiry time of the token in seconds.
   * @param privateKey The private key to sign the token.
   */
  createJwtToken(
    payload: string | object | Buffer<ArrayBufferLike>,
    expiry: number,
    privateKey: string,
  ): string {
    return sign(payload, privateKey, {
      expiresIn: expiry,
      algorithm: "HS512",
    });
  }

  /**
   * Verifies JWT token with given public key.
   *
   * It only allows `HS512` algorithm.
   *
   * @param token The JWT token to verify.
   * @param publicKey The public key to verify the token.
   */
  verifyJwtToken(token: string, publicKey: string): any {
    return verify(token, publicKey, {
      algorithms: ["HS512"],
    });
  }
}
