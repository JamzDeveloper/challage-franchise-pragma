// src/handlers/createFranchise.handler.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { DbFranchiseRepository } from "../../infrastructure/driven-adapters/dbFranchise.repository.js";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { createFranchiseSchema } from "./validateCreateFranchiseDto.js";
import { CreateFranchiseUseCase } from "../../application/use-cases/createFranchise.js";
import {
  ResponseHandler,
  ValidationError,
} from "../../application/response/responseHandler.js";

const franchiseRepo = new DbFranchiseRepository(pool);
const createFranchiseUseCase = new CreateFranchiseUseCase(franchiseRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    console.log("bodyy 19", body);
    const validatedData = createFranchiseSchema.parse(body);

    const franchise = await createFranchiseUseCase.execute(validatedData);

    console.log("franchise 24", franchise);
    // return {
    //   statusCode: 201,
    //   body: JSON.stringify(franchise),
    // };
    return ResponseHandler.formatSuccess(
      franchise,
      "Franchise created successfully"
    );
  } catch (error) {
    return ResponseHandler.formatError(error);
  }
};
