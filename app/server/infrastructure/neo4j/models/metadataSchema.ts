import { z } from "zod";
import { MetadataDAO } from "@server/domain/dao/metadata";

export const parseMetadata = (data: string): MetadataDAO => {
  const query = validateMetadata(JSON.parse(data));
  if (!query.success) {
    throw new Error(query.error.message);
  }

  return query.data;
};

const validateMetadata = (data: unknown) => {
  return metadataSchema.safeParse(data);
};

const metadataSchema = z.object({
  commitSHA: z.string().min(1, "commitSHA cannot be empty"),
  commitDate: z.string().transform((dateString, ctx) => {
    const parsedDate = new Date(dateString);

    if (isNaN(parsedDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date format, expected 'YYYY-MM-DD HH:MM:SS ±ZZZZ'",
      });
      return z.NEVER;
    }

    return parsedDate;
  }),
});
