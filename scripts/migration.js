// scripts/migrate.js
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true, 
  });

  const migrationsDir = path.join(__dirname, "../migrations");
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

  // Ejecutar cada archivo de migración en orden alfabético
  for (const file of files.sort()) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`Ejecutando migración: ${file}`);
    try {
      await connection.query(sql);
      console.log(`Migración ${file} aplicada con éxito.`);
    } catch (error) {
      console.error(`Error en migración ${file}:`, error);
      await connection.end();
      process.exit(1);
    }
  }

  await connection.end();
  console.log("Todas las migraciones se aplicaron correctamente.");
}

runMigrations();
