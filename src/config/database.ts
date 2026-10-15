/**
 * Database Configuration for HealSmart Hospital Management System
 * Oracle Database Connection Settings (read from environment variables / .env)
 */

import 'dotenv/config';

export const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING || 'localhost/XEPDB1',
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2,
};

export default dbConfig;
