#!/usr/bin/env node
import { Client } from "pg";
import { readFileSync } from "fs";

const sql = readFileSync(
  "C:\\Users\\Antoine\\3D Objects\\github\\page-acceuil\\nhost\\migrations\\20260916000000_catalog_core\\up.sql",
  "utf8"
);

const SUB = "pfrrujgbyxixhoejkwfo";
const PASS = process.env.PGPASSWORD;
if (!PASS) { console.log("PGPASSWORD=MANQUANT"); process.exit(1); }

const attempts = [
  { user: "postgres", host: `db.${SUB}.db.us-west-2.nhost.run` },
  { user: SUB, host: `db.${SUB}.db.us-west-2.nhost.run` },
  { user: "postgres", host: `${SUB}.db.us-west-2.nhost.run` },
];

let client = null;
for (const a of attempts) {
  try {
    client = new Client({
      host: a.host, port: 5432, database: SUB, user: a.user,
      password: PASS, ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    await client.query("SELECT 1");
    console.log("connecte=user=" + a.user + " host=" + a.host);
    break;
  } catch (e) {
    console.log("echec=" + a.user + "@" + a.host + " " + e.message.substring(0, 80));
    if (client) { try { await client.end(); } catch {} }
    client = null;
  }
}
if (!client) { console.log("AUCUNE_COMBINAISON_FONCTIONNE"); process.exit(1); }

async function main() {
  await client.query(sql);
  console.log("migration=OK");

  const tables = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'catalog%' ORDER BY tablename"
  );
  console.log("tables=" + tables.rows.map((r) => r.tablename).join(","));

  const views = await client.query(
    "SELECT viewname FROM pg_views WHERE schemaname = 'public' AND viewname LIKE 'public_catalog%'"
  );
  console.log("vues=" + views.rows.map((r) => r.viewname).join(","));

  const indexes = await client.query(
    "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'catalog%' ORDER BY indexname"
  );
  console.log("indexes=" + indexes.rows.map((r) => r.indexname).join(","));

  await client.end();
}

main().catch((e) => {
  console.log("migration=ERROR " + e.message.substring(0, 300));
  client.end();
});
