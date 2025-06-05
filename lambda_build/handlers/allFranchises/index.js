"use strict";
// src/handlers/createFranchise.handler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dbFranchise_repository_js_1 = require("../../infrastructure/driven-adapters/dbFranchise.repository.js");
const mysql_connection_js_1 = require("../../infrastructure/db/mysql-connection.js");
const allFranchises_js_1 = require("../../application/use-cases/allFranchises.js");
const responseHandler_js_1 = require("../../application/response/responseHandler.js");
const franchiseRepo = new dbFranchise_repository_js_1.DbFranchiseRepository(mysql_connection_js_1.pool);
const allFranchisesUseCase = new allFranchises_js_1.AllFranchisesUseCase(franchiseRepo);
const handler = async (event) => {
    try {
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const franchises = await allFranchisesUseCase.execute();
        console.log("franchise 24", franchises);
        return responseHandler_js_1.ResponseHandler.formatSuccess(franchises);
    }
    catch (err) {
        return responseHandler_js_1.ResponseHandler.formatError(err);
    }
};
exports.handler = handler;
