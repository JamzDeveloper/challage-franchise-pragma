import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { pool } from "../../infrastructure/db/mysql-connection";
import { UpdateStockProductFromBranchUseCase } from "../../application/use-cases/updateStockProduct";
import { DbProductRepository } from "../../infrastructure/driven-adapters/dbProduct.repostory";

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
    const { stock } = JSON.parse(event.body || "{}");
    if (!branchId || !productId || !stock || isNaN(stock)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing branchId or productId or stock" }),
      };
    }

    await updateStockProductUseCase.execute(branchId, productId,stock);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product update successfully" }),
    };
  } catch (err: any) {
    console.error("Error updated product", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
