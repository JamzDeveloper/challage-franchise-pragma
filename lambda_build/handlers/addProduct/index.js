"use strict";
// src/handlers/addBranch/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const validateAddProductDto_js_1 = require("./validateAddProductDto.js");
const addProductToBranch_1 = require("../../application/use-cases/addProductToBranch");
const dbBranch_repository_1 = require("../../infrastructure/driven-adapters/dbBranch.repository");
const branchRepo = new dbBranch_repository_1.DbBranchRepository(mysql_connection_js_1.pool);
const addBranchUseCase = new addProductToBranch_1.AddProductToBranchUseCase(branchRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const validated = validateAddProductDto_js_1.addProductToBranchSchema.parse(body);
        const { branchId, ...rest } = validated;
        await addBranchUseCase.execute(validated.branchId, {
            ...rest,
        });
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Product added successfully" }),
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
