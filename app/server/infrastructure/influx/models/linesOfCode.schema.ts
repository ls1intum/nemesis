import { z } from "zod";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateLinesOfCodeSchema = (data: unknown): number => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }
  return parsed.data;
};

const rawSchema = z
  .array(
    z.object({
      _value: z.number(),
    }),
  )
  .length(1);

const parsedSchema = rawSchema.transform((data) => {
  return data[0]._value;
});
