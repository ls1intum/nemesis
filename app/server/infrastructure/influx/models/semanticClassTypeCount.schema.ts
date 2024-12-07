import { z } from "zod";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateSemanticClassTypeSchema = (data: unknown): SemanticClassTypeCountDAO => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }
  return parsed.data;
};

const rawSchema = z.array(
  z.object({
    type: z.enum(["controller", "service", "repository", "entity", "dto"]),
    _value: z.number(),
  }),
);

const parsedSchema = rawSchema.transform((data) => {
  const semanticCounts: SemanticClassTypeCountDAO = {
    controller: 0,
    service: 0,
    repository: 0,
    entity: 0,
    dto: 0,
  };

  data.forEach((row) => {
    semanticCounts[row.type] += row._value;
  });

  return semanticCounts;
});
