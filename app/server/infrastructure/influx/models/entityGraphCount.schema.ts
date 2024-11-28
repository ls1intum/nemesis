import { z } from "zod";

export const validateEntityGraphCountSchema = (data: unknown): number => {
  const parsed = EntityGraphCountSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data._value;
  }
  throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
};

const EntityGraphCountSchema = z.object({
  _value: z.number(),
});
