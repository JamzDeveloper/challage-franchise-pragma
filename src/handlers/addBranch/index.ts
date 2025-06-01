// src/handlers/addBranch/index.ts

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { z } from "zod";

import { DbFranchiseRepository } from "../../infrastructure/driven-adapters/db-franchise.repository.js";
import { pool } from "../../infrastructure/db/mysql-connection.js";
import { AddBranchUseCase } from "../../application/use-cases/addBranch.js";

import { createBranchSchema } from "./validateAddBranchDto.js";

const franchiseRepo = new DbFranchiseRepository(pool);
const addBranchUseCase = new AddBranchUseCase(franchiseRepo);

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const validated = createBranchSchema.parse(body);

    await addBranchUseCase.execute(validated.franchiseId, {
      id: crypto.randomUUID(),
      name: validated.name,
      address: validated.address,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Branch added successfully" }),
    };
  } catch (err: any) {
    console.error("Error adding branch", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
