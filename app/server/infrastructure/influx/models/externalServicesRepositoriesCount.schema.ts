import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";
import { z } from "zod";

export const validateExternalServicesRepositoriesCountSchema = (
  data: unknown,
): ExternalServicesRepositoriesCountDAO => {
  const safeParsed = SaveExternalServicesRepositoriesCountSchema.safeParse(data);
  if (!safeParsed.success) {
    throw new Error(
      `Invalid data format in external_services_repositories_count: ${safeParsed.error}`,
    );
  }

  return safeParsed.data.sort((a, b) => b.count - a.count);
};

const ExternalServicesRepositoriesCountEntrySchema = z
  .object({
    externalClass: z.string(),
    externalModule: z.string(),
    _value: z.number(),
  })
  .transform((data) => {
    return {
      externalModule: data.externalModule,
      externalClass: data.externalClass,
      count: data._value,
    };
  });

const SaveExternalServicesRepositoriesCountSchema = z.array(
  ExternalServicesRepositoriesCountEntrySchema,
);
