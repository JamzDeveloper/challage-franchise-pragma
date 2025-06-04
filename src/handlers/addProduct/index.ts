// src/handlers/addBranch/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { pool } from "../../infrastructure/db/mysql-connection.js";
import { addProductToBranchSchema } from "./validateAddProductDto.js";
import { AddProductToBranchUseCase } from "../../application/use-cases/addProductToBranch";
import { DbBranchRepository } from "../../infrastructure/driven-adapters/dbBranch.repository";

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
    await addBranchUseCase.execute(validated.branchId, {
      ...rest,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Product added successfully" }),
    };
  } catch (err: any) {
    console.error("Error adding branch", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
