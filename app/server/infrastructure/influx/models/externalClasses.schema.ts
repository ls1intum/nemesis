import { z } from "zod";
import { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";

export const validateExternalClassUsageSchema = (rows: unknown[]): ExternalClassUsageDAO => {
  const parsed = ExternalClassUsageDAOSchema.safeParse(rows);
  if (!parsed.success) {
    throw new Error(`Invalid data format in external_class_usage: ${parsed.error}`);
  }
  return parsed.data;
};

const InfluxRecordSchema = z.object({
  _measurement: z.string(),
  module: z.string(),
  semantic_class_type: z.enum(["services", "repository", "dtos", "resources", "entities"]),
  _field: z.string(),
  _value: z.string(),
});

const ExternalClassUsageDAOSchema = z.array(InfluxRecordSchema).transform((records) => {
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
