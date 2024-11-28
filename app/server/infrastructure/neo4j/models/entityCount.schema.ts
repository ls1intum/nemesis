import { z } from "zod";

export const validateEntityCountPerModule = (data: string): Record<string, number> => {
  const jsonData = JSON.parse(data);

  const parsed = inputSchema.safeParse(jsonData);
  if (!parsed.success) {
    throw new Error(`Invalid data format in entity_count: ${parsed.error}`);
  }

  return parsed.data.results[0].data.reduce(
    (acc, item) => {
      const [moduleName, numberEntity] = item.row;
      acc[moduleName] = numberEntity;
      return acc;
    },
    {} as Record<string, number>,
  );
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
