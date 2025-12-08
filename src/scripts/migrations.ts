import { readFileSync, readdirSync } from "fs";
import path from "path";
import { Client } from "pg";

// Helper: wait for Postgres
async function waitForPostgres(connectionString: string) {
  const client = new Client({ connectionString });

  for (let i = 0; i < 20; i++) {
    try {
      await client.connect();
      await client.end();
      console.log("Postgres is ready");
      return;
    } catch {
      console.log("Waiting for Postgres...");
      await new Promise(res => setTimeout(res, 1500));
    }
  }

  throw new Error("Postgres did not start in time");
}

// Run migrations
async function runMigrations(client: Client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      run_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const migrationsDir = path.resolve("./database/migrations");
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const exists = await client.query(
      "SELECT 1 FROM migrations WHERE name = $1",
      [file]
    );

    if (exists.rowCount > 0) {
      console.log(`Skipping migration: ${file}`);
      continue;
    }

    console.log(`Running migration: ${file}`);
    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    await client.query(sql);

    await client.query(
      "INSERT INTO migrations (name) VALUES ($1)",
      [file]
    );
  }

  console.log("Migrations completed.");
}

// Run seeders
async function runSeeders(client: Client) {
  const seedersDir = path.resolve("./database/seeders");
  const files = readdirSync(seedersDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Running seeder: ${file}`);
    const sql = readFileSync(path.join(seedersDir, file), "utf8");
    await client.query(sql);
  }

  console.log("Seeding completed.");
}

// Main
async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Missing DATABASE_URL env");

  await waitForPostgres(connectionString);

  const client = new Client({ connectionString });
  await client.connect();

  await runMigrations(client);

  // Optionally run seeders
  const runSeeds = process.argv.includes("--seed");
  if (runSeeds) {
    await runSeeders(client);
  }

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
