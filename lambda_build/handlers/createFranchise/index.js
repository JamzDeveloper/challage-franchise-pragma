"use strict";
// src/handlers/createFranchise.handler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dbFranchise_repository_js_1 = require("../../infrastructure/driven-adapters/dbFranchise.repository.js");
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const validateCreateFranchiseDto_js_1 = require("./validateCreateFranchiseDto.js");
const createFranchise_js_1 = require("../../application/use-cases/createFranchise.js");
const franchiseRepo = new dbFranchise_repository_js_1.DbFranchiseRepository(mysql_connection_js_1.pool);
const createFranchiseUseCase = new createFranchise_js_1.CreateFranchiseUseCase(franchiseRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        console.log("bodyy 19", body);
        const validatedData = validateCreateFranchiseDto_js_1.createFranchiseSchema.parse(body);
        const franchise = await createFranchiseUseCase.execute(validatedData);
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
