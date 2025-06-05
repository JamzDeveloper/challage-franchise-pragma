import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { pool } from "../../infrastructure/db/mysql-connection";
import { UpdateStockProductFromBranchUseCase } from "../../application/use-cases/updateStockProduct";
import { DbProductRepository } from "../../infrastructure/driven-adapters/dbProduct.repostory";
import {
  ResponseHandler,
  ValidationError,
} from "../../application/response/responseHandler";
import { updateProductSchema } from "./validateUpdateDto";

const productRepository = new DbProductRepository(pool);
const updateStockProductUseCase = new UpdateStockProductFromBranchUseCase(
  productRepository
);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    console.log("Lambda update-product-to-branch ejecutada con evento:", event);

    const branchId = Number(event.pathParameters?.branchId);
    const productId = Number(event.pathParameters?.productId);
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const { stock } = updateProductSchema.parse(body);
    if (!branchId || !productId) {
      return ResponseHandler.formatError(
        new ValidationError("Missing branchId or productId")
      );
    }

    await updateStockProductUseCase.execute(branchId, productId, stock);

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ message: "Product update successfully" }),
    // };
    return ResponseHandler.formatSuccess(null, "Product update successfully");
  } catch (error) {
    return ResponseHandler.formatError(error);
  }
};
