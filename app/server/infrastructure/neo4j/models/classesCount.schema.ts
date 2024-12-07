import { z } from "zod";
import {ZodValidationError} from "@server/domain/value/zodValidationError";

export const validateClassesCountPerModule = (data: string): Record<string, number> => {
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
          row: z.tuple([z.string(), z.number()]),
        }),
      ),
    }),
  ).length(1),
});

const parsedSchema = rawSchema.transform((data) => {
    return data.results[0].data.reduce(
        (acc, item) => {
            const [moduleName, classCount] = item.row;
            acc[moduleName] = classCount;
            return acc;
        },
        {} as Record<string, number>,
    );
});
