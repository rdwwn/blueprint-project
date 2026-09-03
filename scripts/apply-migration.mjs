// One-off runner: applies supabase/migrations/0001_init.sql to Supabase Postgres.
// Discovers the project's region by trying the pooler hosts. Not a build
// dependency; safe to delete after use.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ref = process.env.SUPABASE_PROJECT_REF;
const password = process.env.SUPABASE_DB_PASSWORD;
if (!ref || !password) {
  console.error("Set SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD");
  process.exit(1);
}

const REGIONS = [
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3",
  "ap-northeast-1", "ap-northeast-2", "ap-southeast-1", "ap-southeast-2",
  "ap-south-1", "sa-east-1", "ca-central-1", "us-central-1",
];

let client = null;

for (const region of REGIONS) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const c = new pg.Client({
    host,
    port: 5432,
    database: "postgres",
    user: `postgres.${ref}`,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 6000,
    statement_timeout: 90000,
  });
  try {
    await c.connect();
    console.log(`connected via ${host}`);
    client = c;
    break;
  } catch (err) {
    await c.end().catch(() => {});
    const msg = String(err.message).slice(0, 90);
    if (!msg.includes("not found")) console.log(`  ${region}: ${msg}`);
  }
}

if (!client) {
  console.error("Could not find the project region. Ask the user which region they picked.");
  process.exit(1);
}

try {
  const files = await readdir(path.join(__dirname, "..", "supabase", "migrations"));
  for (const file of files.filter((f) => f.endsWith(".sql")).sort()) {
    const sql = await readFile(path.join(__dirname, "..", "supabase", "migrations", file), "utf8");
    console.log(`Applying ${file}...`);
    await client.query(sql);
    console.log(`  done (${file})`);
  }
  console.log("All migrations applied.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
