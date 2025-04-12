import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const host = process.env["DB_HOST"];
const user = process.env["DB_USER"];
const password = process.env["DB_PASSWORD"];
const database = process.env["DB_DATABASE"];

if (!host || !user || !password || !database) {
  throw new Error('Missing required environment variables');
}

const db = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 20
});

export default db;