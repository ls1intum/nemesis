import { z } from "zod";
import { SemanticClassTypeCountDAO } from "@server/domain/dao/semanticClassTypeCount";

export const validateSemanticClassTypeCount = (
  data: string,
): Record<string, SemanticClassTypeCountDAO> => {
  const jsonData = JSON.parse(data);
  const result = CompleteSchema.safeParse(jsonData);
  if (!result.success) {
    throw new Error("Invalid data format");
  }
  return result.data;
};

const DataRowSchema = z.object({
  row: z.tuple([
    z.string(), // Module name
    z.number(), // numberController
    z.number(), // numberService
    z.number(), // numberRepository
    z.number(), // numberEntities
    z.number(), // numberDTOs
  ]),
});

const ResultsSchema = z.object({
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
        data: z.array(DataRowSchema),
      }),
    )
    .min(1), // Ensure at least one result object
});

const CompleteSchema = ResultsSchema.transform((data) => {
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
