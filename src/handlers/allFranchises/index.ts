// src/handlers/createFranchise.handler.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { DbFranchiseRepository } from "../../infrastructure/driven-adapters/dbFranchise.repository.js";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { AllFranchisesUseCase } from "../../application/use-cases/allFranchises.js";
import { ResponseHandler } from "../../application/response/responseHandler.js";

const franchiseRepo = new DbFranchiseRepository(pool);
const allFranchisesUseCase = new AllFranchisesUseCase(franchiseRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    const franchises = await allFranchisesUseCase.execute();

    console.log("franchise 24", franchises);

    return ResponseHandler.formatSuccess(franchises);
  } catch (err: any) {
    return ResponseHandler.formatError(err);
  }
};
