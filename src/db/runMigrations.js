import { connection as db } from "./connection.js";

db.migrate
  .latest()
  .then(() => {
    console.log("Migrations executadas com sucesso.");
  })
  .catch((err) => {
    console.error("Erro ao executar migrations:", err);
  })
  .finally(() => {
    db.destroy();
  });
