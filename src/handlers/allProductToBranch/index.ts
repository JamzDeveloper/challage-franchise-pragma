import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { AllProductsToBranch } from "../../application/use-cases/allProductsToBranch";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository";
import { ResponseHandler } from "../../application/response/responseHandler.js";

const branchRepository = new DbBranchRepository(pool);
const allProductsUseCase = new AllProductsToBranch(branchRepository);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const branchId = Number(event.pathParameters?.branchId);

    const products = await allProductsUseCase.execute(branchId);

    console.log("result allProductToBranch", products);
    return ResponseHandler.formatSuccess(products);
  } catch (err: any) {
    return ResponseHandler.formatError(err);
  }
};
