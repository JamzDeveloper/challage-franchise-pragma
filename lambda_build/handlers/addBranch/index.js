"use strict";
// src/handlers/addBranch/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dbFranchise_repository_js_1 = require("../../infrastructure/driven-adapters/dbFranchise.repository.js");
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const addBranch_js_1 = require("../../application/use-cases/addBranch.js");
const validateAddBranchDto_js_1 = require("./validateAddBranchDto.js");
const responseHandler_js_1 = require("../../application/response/responseHandler.js");
const franchiseRepo = new dbFranchise_repository_js_1.DbFranchiseRepository(mysql_connection_js_1.pool);
const addBranchUseCase = new addBranch_js_1.AddBranchUseCase(franchiseRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const validated = validateAddBranchDto_js_1.createBranchSchema.parse(body);
        const franchiseId = Number(event.pathParameters?.franchiseId);
        console.log("franchiseId", franchiseId);
        if (!franchiseId) {
            return responseHandler_js_1.ResponseHandler.formatError(new responseHandler_js_1.ValidationError("FranchiseId is required"));
        }
        const branch = await addBranchUseCase.execute(franchiseId, {
            name: validated.name,
            address: validated.address,
            phone: validated.phone,
        });
        // return {
        //   statusCode: 201,
        //   body: JSON.stringify({ message: "Branch added successfully" }),
        // };
        return responseHandler_js_1.ResponseHandler.formatSuccess(branch, "branch created successfully");
    }
    catch (error) {
        console.error("Error adding branch", error);
        // return {
        //   statusCode: 500,
        //   body: JSON.stringify({ message: "Internal server error" }),
        // };
        return responseHandler_js_1.ResponseHandler.formatError(error);
    }
};
exports.handler = handler;
