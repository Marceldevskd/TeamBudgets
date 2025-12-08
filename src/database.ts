import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL || "postgres://username:password@localhost:5432/mydatabase";

const pool = new Pool({
  connectionString: DATABASE_URL
});

export default pool;