import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/DbBranch.repository";
import { pool } from "../../infrastructure/db/mysql-connection";
import { DeleteProductFromBranchUseCase } from "../../application/use-cases/deleteProductFromBranch";

const branchRepo = new DbBranchRepository(pool);
const deleteUseCase = new DeleteProductFromBranchUseCase(branchRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
      console.log("Lambda delete-product-to-branch ejecutada con evento:", event);

    const branchId = Number(event.pathParameters?.branchId);
    const productId = Number(event.pathParameters?.productId);

    if (!branchId || !productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing branchId or productId" }),
      };
    }

    await deleteUseCase.execute(branchId, productId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product deleted successfully" }),
    };
  } catch (err: any) {
    console.error("Error deleting product", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
