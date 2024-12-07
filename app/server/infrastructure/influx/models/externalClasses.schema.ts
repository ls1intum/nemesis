import { z } from "zod";
import { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateExternalClassUsageSchema = (rows: unknown[]): ExternalClassUsageDAO => {
  const parsed = parsedSchema.safeParse(rows);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }
  return parsed.data;
};

const rawSchema = z.object({
  module: z.string(),
  semantic_class_type: z.enum(["services", "repository", "dtos", "resources", "entities"]),
  _value: z.string(),
});

const parsedSchema = z.array(rawSchema).transform((records) => {
  return records.reduce<ExternalClassUsageDAO>(
    (acc, record) => {
      const type = record.semantic_class_type;
      const value = record._value;
      const classes = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      acc[type] = acc[type].concat(classes);
      return acc;
    },
    {
      services: [],
      repository: [],
      dtos: [],
      resources: [],
      entities: [],
    },
  );
});
