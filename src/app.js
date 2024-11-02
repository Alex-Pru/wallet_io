import startServer from "./server.js";
import { connection } from "./db/connection.js";

async function testDbConnection(dbInstance) {
  try {
    await dbInstance.raw("SELECT 1+1 AS result");
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
}

async function startApp() {
  console.log("Initializing database connection...");
  await testDbConnection(connection);

  startServer();
}

startApp();
