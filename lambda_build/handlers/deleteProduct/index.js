"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const dbBranch_repository_1 = require("../../infrastructure/driven-adapters/dbBranch.repository");
const mysql_connection_1 = require("../../infrastructure/db/mysql-connection");
const deleteProductFromBranch_1 = require("../../application/use-cases/deleteProductFromBranch");
const responseHandler_1 = require("../../application/response/responseHandler");
const branchRepo = new dbBranch_repository_1.DbBranchRepository(mysql_connection_1.pool);
const deleteUseCase = new deleteProductFromBranch_1.DeleteProductFromBranchUseCase(branchRepo);
const handler = async (event) => {
    try {
        console.log("Lambda delete-product-to-branch ejecutada con evento:", event);
        const branchId = Number(event.pathParameters?.branchId);
        const productId = Number(event.pathParameters?.productId);
        if (!branchId || !productId) {
            return responseHandler_1.ResponseHandler.formatError("Missing branchId or productId");
            // return {
            //   statusCode: 400,
            //   body: JSON.stringify({ message: "Missing branchId or productId" }),
            // };
        }
        await deleteUseCase.execute(branchId, productId);
        return responseHandler_1.ResponseHandler.formatSuccess(null, "Product delete successfully");
        // return {
        //   statusCode: 200,
        //   body: JSON.stringify({ message: "Product deleted successfully" }),
        // };
    }
    catch (err) {
        console.error("Error deleting product", err);
        return responseHandler_1.ResponseHandler.formatError(err);
    }
};
exports.handler = handler;
