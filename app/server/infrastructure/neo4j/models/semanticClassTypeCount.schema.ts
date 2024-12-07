import { z } from "zod";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateSemanticClassTypeCount = (
  data: string,
): Record<string, SemanticClassTypeCountDAO> => {
  const jsonData = JSON.parse(data);
  const result = parsedSchema.safeParse(jsonData);
  if (result.error) {
    throw new ZodValidationError(result.error);
  }
  return result.data;
};

const rawSchema = z.object({
  results: z
    .array(
      z.object({
        columns: z
          .array(
            z.enum([
              "Module",
              "numberController",
              "numberService",
              "numberRepository",
              "numberEntities",
              "numberDTOs",
            ]),
          )
          .length(6),
        data: z.array(
          z.object({
            row: z.tuple([
              z.string(), // Module name
              z.number(), // numberController
              z.number(), // numberService
              z.number(), // numberRepository
              z.number(), // numberEntities
              z.number(), // numberDTOs
            ]),
          }),
        ),
      }),
    )
    .length(1),
});

const parsedSchema = rawSchema.transform((data) => {
  const result = data.results[0];
  const { columns, data: rows } = result;

  const columnIndices: Record<string, number> = {};
  columns.forEach((col, index) => {
    columnIndices[col] = index;
  });

  const record: Record<string, SemanticClassTypeCountDAO> = {};

  rows.forEach((item) => {
    const row = item.row;

    const [
      moduleName,
      numberController,
      numberService,
      numberRepository,
      numberEntities,
      numberDTOs,
    ] = row;

    record[moduleName] = {
      controller: numberController,
      service: numberService,
      repository: numberRepository,
      entity: numberEntities,
      dto: numberDTOs,
    };
  });

  return record;
});
