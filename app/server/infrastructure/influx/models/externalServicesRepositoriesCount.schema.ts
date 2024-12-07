import { ExternalServicesRepositoriesCountDAO } from "@server/domain/dao/externalServicesRepositoriesCount";
import { z } from "zod";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateExternalServicesRepositoriesCountSchema = (
  data: unknown,
): ExternalServicesRepositoriesCountDAO => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const rawSchema = z.array(
  z
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
    }),
);

const parsedSchema = rawSchema.transform((data) => {
  return data.sort((a, b) => b.count - a.count);
});
