
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { AllProductsToBranch } from "../../application/use-cases/allProductsToBranch";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository";

const branchRepository = new DbBranchRepository(pool);
const allProductsUseCase = new AllProductsToBranch(branchRepository);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const branchId = Number(event.pathParameters?.branchId);

    const products = await allProductsUseCase.execute(branchId);

    console.log("products 24", products);
    return {
      statusCode: 201,
      body: JSON.stringify(products),
    };
  } catch (err: any) {
    console.error("Error list products", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
