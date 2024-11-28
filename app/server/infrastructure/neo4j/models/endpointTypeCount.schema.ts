import { z } from "zod";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";

export const validateEndpointTypeCount = (data: string): Record<string, EndpointTypeCountDAO> => {
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
    z.number(), // getMappings
    z.number(), // postMappings
    z.number(), // putMappings
    z.number(), // patchMappings
    z.number(), // deleteMappings
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
              "getMappings",
              "postMappings",
              "putMappings",
              "patchMappings",
              "deleteMappings",
            ]),
          )
          .length(6),
        data: z.array(DataRowSchema),
      }),
    )
    .min(1),
});

const CompleteSchema = ResultsSchema.transform((data) => {
  const result = data.results[0];
  const { columns, data: rows } = result;

  const columnIndices: Record<string, number> = {};
  columns.forEach((col, index) => {
    columnIndices[col] = index;
  });

  const record: Record<string, EndpointTypeCountDAO> = {};

  rows.forEach((item) => {
    const row = item.row;

    const [moduleName, get, post, put, patch, del] = row;

    record[moduleName] = {
      get,
      post,
      put,
      patch,
      delete: del,
    };
  });

  return record;
});
