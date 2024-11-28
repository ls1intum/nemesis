import { z } from "zod";

export const validateNumberEndpointsSchema = (data: unknown): number => {
  const parsed = NumberEndpointsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid data format for Number Endpoints.");
  }
  return parsed.data._value;
};

const NumberEndpointsSchema = z.object({
  _value: z.number(),
});
