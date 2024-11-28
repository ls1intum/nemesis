import { z } from "zod";
import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";

export const validateMethodLengthBucketsSchema = (data: unknown[]): MethodLengthBucketDAO[] => {
  return data.map((row, index) => {
    const parsed = MethodLengthBucketRowSchema.safeParse(row);

    if (!parsed.success) {
      throw new Error(`Invalid data format in method_length_buckets row ${index}: ${parsed.error}`);
    }

    const { loc_start_inclusive, loc_end_inclusive, _value } = parsed.data;

    return {
      locStartInclusive: Number(loc_start_inclusive),
      locEndInclusive: Number(loc_end_inclusive),
      count: _value,
    };
  });
};

const MethodLengthBucketRowSchema = z.object({
  loc_start_inclusive: z.string(),
  loc_end_inclusive: z.string(),

  _value: z.number(),
});
