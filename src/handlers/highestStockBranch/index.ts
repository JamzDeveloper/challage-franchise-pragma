import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { HighestStockPerBranch } from "../../application/use-cases/highestStockBranch.js";
import { DbFranchiseRepository } from "../../infrastructure/driven-adapters/dbFranchise.repository.js";

const franchiseRepository = new DbFranchiseRepository(pool);
const highestStockBranchUseCase = new HighestStockPerBranch(
  franchiseRepository
);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const franchiseID = Number(event.pathParameters?.franchiseId);

    const result = await highestStockBranchUseCase.execute(franchiseID);

    console.log("products 24", result);
    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (err: any) {
    console.error("Error list products", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
