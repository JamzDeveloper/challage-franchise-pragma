// src/handlers/addBranch/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { z } from "zod";

import { DbFranchiseRepository } from "../../infrastructure/driven-adapters/dbFranchise.repository.js";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { AddBranchUseCase } from "../../application/use-cases/addBranch.js";

import { createBranchSchema } from "./validateAddBranchDto.js";
import {
  ResponseHandler,
  ValidationError,
} from "../../application/response/responseHandler.js";

const franchiseRepo = new DbFranchiseRepository(pool);
const addBranchUseCase = new AddBranchUseCase(franchiseRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const validated = createBranchSchema.parse(body);
    const franchiseId = Number(event.pathParameters?.franchiseId);

    console.log("franchiseId", franchiseId);
    if (!franchiseId) {
      return ResponseHandler.formatError(
        new ValidationError("FranchiseId is required")
      );
    }

    const branch = await addBranchUseCase.execute(franchiseId, {
      name: validated.name,
      address: validated.address,
      phone: validated.phone,
    });

    // return {
    //   statusCode: 201,
    //   body: JSON.stringify({ message: "Branch added successfully" }),
    // };

    return ResponseHandler.formatSuccess(branch, "branch created successfully");
  } catch (error: any) {
    console.error("Error adding branch", error);
    // return {
    //   statusCode: 500,
    //   body: JSON.stringify({ message: "Internal server error" }),
    // };
    return ResponseHandler.formatError(error);
  }
};
