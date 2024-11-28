import { z } from "zod";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";

const SemanticClassTypeRowSchema = z.object({
  type: z.enum(["controller", "service", "repository", "entity", "dto"]),
  _value: z.number(),
});

export const validateSemanticClassTypeSchema = (data: unknown[]): SemanticClassTypeCountDAO => {
  const semanticCounts: SemanticClassTypeCountDAO = {
    controller: 0,
    service: 0,
    repository: 0,
    entity: 0,
    dto: 0,
  };

  data.forEach((row, index) => {
    const parsed = SemanticClassTypeRowSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error(`Invalid data format in semantic_class_type row ${index}: ${parsed.error}`);
    }
    const { type, _value } = parsed.data;
    semanticCounts[type] += _value;
  });

  return semanticCounts;
};
