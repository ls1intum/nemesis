import { z } from "zod";
import {
  ExternalServicesRepositoriesCountDAO,
  ExternalServicesRepositoriesCountEntryDAO,
} from "@server/domain/dao/externalServicesRepositoriesCount";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateExternalServicesRepositoriesCount = (
  data: string,
): Record<string, ExternalServicesRepositoriesCountDAO> => {
  const jsonData = JSON.parse(data);

  const parsed = parsedSchema.safeParse(jsonData);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const rawSchema = z.object({
  results: z.array(
    z.object({
      columns: z.array(z.string()),
      data: z.array(
        z.object({
          row: z.tuple([
            z.string(), // moduleName
            z.array(
              z.object({
                externalClass: z.string(),
                externalModule: z.string(),
                count: z.number(),
              }),
            ),
          ]),
        }),
      ),
    }),
  ),
});

const parsedSchema = rawSchema.transform((data) => {
  return data.results.reduce(
    (record, result) => {
      result.data.forEach((item) => {
        const [moduleName, mappings] = item.row;
        record[moduleName] = mappings;
      });
      return record;
    },
    {} as Record<string, ExternalServicesRepositoriesCountEntryDAO[]>,
  );
});
