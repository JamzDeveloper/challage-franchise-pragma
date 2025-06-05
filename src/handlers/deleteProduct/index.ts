import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository";
import { pool } from "../../infrastructure/db/mysql-connection";
import { DeleteProductFromBranchUseCase } from "../../application/use-cases/deleteProductFromBranch";
import { ResponseHandler } from "../../application/response/responseHandler";

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
      return ResponseHandler.formatError("Missing branchId or productId" );
      // return {
      //   statusCode: 400,
      //   body: JSON.stringify({ message: "Missing branchId or productId" }),
      // };
    }

    await deleteUseCase.execute(branchId, productId);

    return ResponseHandler.formatSuccess(null, "Product delete successfully");
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: "Product deleted successfully" }),
    // };
  } catch (err: any) {
    console.error("Error deleting product", err);
    return ResponseHandler.formatError(err);
  }
};
