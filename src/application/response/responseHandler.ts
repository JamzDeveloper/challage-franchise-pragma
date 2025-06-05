export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    // Verifica si está disponible en el entorno actual (Node.js)
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
// src/application/response/ResponseHandler.ts

import { ZodError } from "zod";

export class ResponseHandler {
  static formatSuccess(data: any, message = "Success") {
    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        status: "success",
        message,
        data,
      }),
    };
  }

  static formatError(error: unknown) {
    // Zod Error (Validación fallida)
    if (error instanceof ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          statusCode: 400,
          status: "error",
          message: "Validation failed",
          data: null,
          errors: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        }),
      };
    }

    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          statusCode: error.statusCode,
          status: "error",
          message: error.message,
          data: null,
        }),
      };
    }

    console.error("Unexpected error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        statusCode: 500,
        status: "error",
        message: "Internal server error",
        data: null,
      }),
    };
  }
}
