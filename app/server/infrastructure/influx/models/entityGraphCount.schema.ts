import { z } from "zod";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateEntityGraphCountSchema = (data: unknown): number => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }
  return parsed.data;
};

const rawSchema = z.object({
  _value: z.number(),
});

const parsedSchema = rawSchema.transform((data) => {
  return data._value;
});
