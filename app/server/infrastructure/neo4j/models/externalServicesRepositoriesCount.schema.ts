import { z } from "zod";
import {
  ExternalServicesRepositoriesCountDAO,
  ExternalServicesRepositoriesCountEntryDAO,
} from "@server/domain/dao/externalServicesRepositoriesCount";

export const validateExternalServicesRepositoriesCount = (
  data: string,
): Record<string, ExternalServicesRepositoriesCountDAO> => {
  const jsonData = JSON.parse(data);
  return transformToRecord(jsonData);
};

const ExternalServicesRepositoriesCountEntrySchema = z.object({
  externalClass: z.string(),
  externalModule: z.string(),
  count: z.number(),
});

const ResponseSchema = z.object({
  results: z.array(
    z.object({
      columns: z.array(z.string()),
      data: z.array(
        z.object({
          row: z.tuple([
            z.string(), // moduleName
            z.array(ExternalServicesRepositoriesCountEntrySchema),
          ]),
        }),
      ),
    }),
  ),
});

const transformToRecord = (data: string) => {
  const safeParsed = ResponseSchema.safeParse(data);
  if (!safeParsed.success) {
    throw new Error(
      `Invalid data format in external_services_repositories_count: ${safeParsed.error}`,
    );
  }

  return safeParsed.data.results.reduce(
    (record, result) => {
      result.data.forEach((item) => {
        const [moduleName, mappings] = item.row;
        record[moduleName] = mappings;
      });
      return record;
    },
    {} as Record<string, ExternalServicesRepositoriesCountEntryDAO[]>,
  );
};
