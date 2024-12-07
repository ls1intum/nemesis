import { z } from "zod";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateEndpointTypeCount = (data: string): Record<string, EndpointTypeCountDAO> => {
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
              "getMappings",
              "postMappings",
              "putMappings",
              "patchMappings",
              "deleteMappings",
            ]),
          )
          .length(6),
        data: z.array(
          z.object({
            row: z.tuple([
              z.string(), // Module name
              z.number(), // getMappings
              z.number(), // postMappings
              z.number(), // putMappings
              z.number(), // patchMappings
              z.number(), // deleteMappings
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
