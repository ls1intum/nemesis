import { z } from "zod";
import { MetadataDAO } from "@server/domain/dao/metadata";
import {ZodValidationError} from "@server/domain/value/zodValidationError";

export const parseMetadata = (data: string): MetadataDAO => {
  const jsonData = JSON.parse(data);

  const query = validateMetadata(jsonData);
  if (query.error) {
    throw new ZodValidationError(query.error);
  }

  return query.data;
};

const validateMetadata = (data: unknown) => {
  return parsedSchema.safeParse(data);
};

const parsedSchema = z.object({
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
