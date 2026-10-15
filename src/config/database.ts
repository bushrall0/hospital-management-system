/**
 * Database Configuration for HealSmart Hospital Management System
 * Oracle Database Connection Settings (read from environment variables / .env)
 */

import 'dotenv/config';

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING || 'localhost/XEPDB1',
  // Oracle Autonomous Database wallet (folder with tnsnames.ora + ewallet.pem)
  walletDir: process.env.DB_WALLET_DIR,
  walletPassword: process.env.DB_WALLET_PASSWORD,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
};

export default dbConfig;
