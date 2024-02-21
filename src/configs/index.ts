require("dotenv").config();

export const config = {
  LOG_KEY: process.env.LOG_KEY,
  API_KEYS_SALT: process.env.API_KEYS_SALT,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI || "",
  DB_NAME: process.env.DB_NAME || "",
  RATE_KEYS: process.env.RATE_KEYS || { default: "keys" },
};
export const algorithm = "aes-256-ctr";
