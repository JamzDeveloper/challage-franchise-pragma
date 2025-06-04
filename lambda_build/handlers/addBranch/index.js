"use strict";
// src/handlers/addBranch/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dbFranchise_repository_js_1 = require("../../infrastructure/driven-adapters/dbFranchise.repository.js");
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const addBranch_js_1 = require("../../application/use-cases/addBranch.js");
const validateAddBranchDto_js_1 = require("./validateAddBranchDto.js");
const franchiseRepo = new dbFranchise_repository_js_1.DbFranchiseRepository(mysql_connection_js_1.pool);
const addBranchUseCase = new addBranch_js_1.AddBranchUseCase(franchiseRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const validated = validateAddBranchDto_js_1.createBranchSchema.parse(body);
        await addBranchUseCase.execute(validated.franchiseId, {
            name: validated.name,
            address: validated.address,
            phone: validated.phone,
        });
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Branch added successfully" }),
        };
    }
    catch (err) {
        console.error("Error adding branch", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error" }),
        };
    }
};
exports.handler = handler;
