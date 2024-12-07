import { MetadataDAO } from "@server/domain/dao/metadata";
import { z } from "zod";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateMetadataSchema = (data: unknown): MetadataDAO | null => {
  const parsed = parsedSchema.safeParse(data);
  if (!parsed.success) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const rawSchema = z.array(
  z.object({
    commit_sha: z.string(),
    _time: z.string(),
  }),
);

const parsedSchema = rawSchema.transform((data) => {
  let newestMetadata = null;
  data.forEach((row) => {
    newestMetadata = {
      commitSHA: row.commit_sha,
      commitDate: new Date(row._time),
    };
  });

  return newestMetadata;
});
