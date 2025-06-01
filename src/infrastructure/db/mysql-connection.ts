import mysql from "mysql2/promise";
import { databaseConfig } from "../../config/database";

export const pool = mysql.createPool(databaseConfig);
