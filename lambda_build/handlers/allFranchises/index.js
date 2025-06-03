"use strict";
// src/handlers/createFranchise.handler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const db_franchise_repository_js_1 = require("../../infrastructure/driven-adapters/db-franchise.repository.js");
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const allFranchises_js_1 = require("../../application/use-cases/allFranchises.js");
const franchiseRepo = new db_franchise_repository_js_1.DbFranchiseRepository(mysql_connection_js_1.pool);
const allFranchisesUseCase = new allFranchises_js_1.AllFranchisesUseCase(franchiseRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const franchise = await allFranchisesUseCase.execute();
        console.log("franchise 24", franchise);
        return {
            statusCode: 201,
            body: JSON.stringify(franchise),
        };
    }
    catch (err) {
        console.error("Error creating franchise", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.handler = handler;
