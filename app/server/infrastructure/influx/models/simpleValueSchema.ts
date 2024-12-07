import { z } from "zod";

const rawSimpleValueSchema = z.array(
  z.object({
    _value: z.number(),
  }),
);

export const SimpleValueSchema = rawSimpleValueSchema.transform((data) => {
  return data[0]._value;
});
