export namespace Authenticate {
  export interface Body {
    /**
     * The email of the user.
     */
    email: string;

    /**
     * The password of the user.
     */
    password: string;
  }

  export interface Response {
    /**
     * The token of the user.
     *
     * The caller must hold this token securely.
     * To authenticate the user after the token is acquired, pass the token to the
     * `Authorization` header with the `Bearer` prefix.
     *
     * Example:
     * ```
     * Authorization: Bearer <token>
     * ```
     */
    token: string;

    /**
     * The expiry time of the token.
     */
    expiresAt: Date;
  }
}
