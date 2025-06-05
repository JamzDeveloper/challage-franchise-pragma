// src/handlers/addBranch/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { pool } from "../../infrastructure/db/mysql-connection.js";
import { addProductToBranchSchema } from "./validateAddProductDto.js";
import { AddProductToBranchUseCase } from "../../application/use-cases/addProductToBranch";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository";
import { ResponseHandler } from "../../application/response/responseHandler.js";

const branchRepo = new DbBranchRepository(pool);
const addBranchUseCase = new AddProductToBranchUseCase(branchRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const validated = addProductToBranchSchema.parse(body);

    const { branchId, ...rest } = validated;
    const product = await addBranchUseCase.execute(validated.branchId, {
      ...rest,
    });

    // return {
    //   statusCode: 201,
    //   body: JSON.stringify({ message: "Product added successfully" }),
    // };

    return ResponseHandler.formatSuccess(
      product,
      "Product created successfully"
    );
  } catch (err: any) {
      return ResponseHandler.formatError(err);

  }
};
