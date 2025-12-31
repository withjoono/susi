const crypto = require("crypto");

const key = crypto.randomBytes(32).toString("base64url");

console.log(`a new key has been generated: ${key}`);
