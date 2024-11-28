import { z } from "zod";

export const validateClassCountSchema = (data: unknown): number => {
  const parsed = ClassCountSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data._value;
  }
  throw new Error(parsed.error.errors.map((e) => e.message).join(", "));
};

const ClassCountSchema = z.object({
  _value: z.number(),
});
