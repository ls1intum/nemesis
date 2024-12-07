import { ZodValidationError } from "@server/domain/value/zodValidationError";
import { SimpleValueSchema } from "@server/infrastructure/influx/models/simpleValueSchema";

export const validateNumberEndpointsSchema = (data: unknown): number => {
  const parsed = SimpleValueSchema.safeParse(data);
  if (!parsed.success) {
    throw new ZodValidationError(parsed.error);
  }
  return parsed.data;
};
