import { z } from "zod";

export const validateEntityCountSchema = (data: unknown): number => {
  const parsed = EntityCountSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data._value;
  }
  throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
};

const EntityCountSchema = z.object({
  _value: z.number(),
});
