import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "chatuser",
  host: "localhost",
  database: "chatapp",
  password: "chatpass",
  port: 5433, // 👈 must match your docker-compose mapping
});

pool.connect()
  .then(() => console.log("✅ Connected to Postgres!"))
  .catch(err => console.error("❌ Connection error", err));

export default pool;