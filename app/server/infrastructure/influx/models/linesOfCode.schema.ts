import { z } from "zod";

export const validateLinesOfCodeSchema = (data: unknown): number => {
  const parsed = LinesOfCodeSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data._value;
  }
  throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
};

const LinesOfCodeSchema = z.object({
  _value: z.number(),
});
