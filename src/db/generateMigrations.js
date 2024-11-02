import { connection as db } from "./connection.js";

const name = process.argv[2];
console.log(name);

if (!name) {
  console.log("Forneça um nome para a migration.");
  process.exit(1);
}

await db.migrate.make(name);
try {
  console.log(`Migrations ${name} criada com sucesso.`);
  process.exit(0);
} catch (err) {
  console.error("Ocorreu um erro ao gerar as migrations: " + err);
  process.exit(1)`;`;
}
