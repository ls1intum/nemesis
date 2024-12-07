import { z } from "zod";
import type { ExternalClassUsageDAO } from "@server/domain/dao/externalClassUsage";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateExternalClassCount = (data: string): Record<string, ExternalClassUsageDAO> => {
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
      data: z
        .array(
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
        )
        .min(1),
    }),
  ),
});

const parsedSchema = rawSchema.transform((data) => {
  const result: Record<string, ExternalClassUsageDAO> = {};

  data.results[0].data.forEach((item) => {
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
});
