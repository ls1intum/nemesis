import { z } from "zod";
import type { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";

export const validateExternalClassCount = (data: string): Record<string, ExternalClassUsageDAO> => {
  const jsonData = JSON.parse(data);
  const parsed = InputSchema.safeParse(jsonData);
  if (!parsed.success) {
    throw new Error(`Invalid data format in external_class_count: ${parsed.error}`);
  }

  const result: Record<string, ExternalClassUsageDAO> = {};

  parsed.data.results[0].data.forEach((item) => {
    const [moduleName, services, dtos, repository, resources, entities] = item.row;
    result[moduleName] = {
      services,
      dtos,
      repository,
      resources,
      entities,
    };
  });

  return result;
};

const InputSchema = z.object({
  results: z.array(
    z.object({
      columns: z.array(z.string()),
      data: z.array(
        z.object({
          row: z.tuple([
            z.string(), // Module
            z.array(z.string()), // ExternalServicesUsed
            z.array(z.string()), // ExternalDTOsUsed
            z.array(z.string()), // ExternalRepositoriesUsed
            z.array(z.string()), // ExternalResourcesUsed
            z.array(z.string()), // ExternalEntitiesUsed
          ]),
        }),
      ),
    }),
  ),
});
