import { ZodError } from "zod";

export class ZodValidationError extends Error {
  constructor(error: ZodError) {
    super(`Failed to validate schema: ${error.message}`, { cause: error.cause });
    this.name = "ZodValidationError";
  }
}
