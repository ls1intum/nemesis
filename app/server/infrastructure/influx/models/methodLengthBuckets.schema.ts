import { z } from "zod";
import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateMethodLengthBucketsSchema = (data: unknown): MethodLengthBucketDAO[] => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const rawSchema = z.array(
  z.object({
    loc_start_inclusive: z.number(),
    loc_end_inclusive: z.number(),

    _value: z.number(),
  }),
);

const parsedSchema = rawSchema.transform((data) => {
  return data.map((row) => {
    return {
      locStartInclusive: row.loc_start_inclusive,
      locEndInclusive: row.loc_end_inclusive,
      count: row._value,
    };
  });
});
