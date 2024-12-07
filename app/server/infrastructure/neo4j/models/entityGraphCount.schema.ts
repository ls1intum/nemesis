import { z } from "zod";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateEntityGraphCountPerModule = (data: string): Record<string, number> => {
  const jsonData = JSON.parse(data);

  const parsed = parsedSchema.safeParse(jsonData);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const inputSchema = z.object({
  results: z.array(
    z.object({
      columns: z.array(z.string()),
      data: z.array(
        z.object({
          row: z.tuple([z.string(), z.number()]),
        }),
      ),
    }),
  ),
});

const parsedSchema = inputSchema.transform((data) => {
  return data.results[0].data.reduce(
    (acc, item) => {
      const [moduleName, numberEntityGraphs] = item.row;
      acc[moduleName] = numberEntityGraphs;
      return acc;
    },
    {} as Record<string, number>,
  );
});
