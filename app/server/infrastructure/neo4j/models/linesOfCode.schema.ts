import { z } from "zod";

export const validateLinesOfCode = (data: string): Record<string, number> => {
  const parsedData = JSON.parse(data);
  const result = CompleteSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(`Failed to validate data: ${result.error.message}`);
  }

  return result.data;
};

const LinesOfCodeSchema = z.object({
  results: z
    .array(
      z.object({
        columns: z.array(z.enum(["Module", "TotalLinesOfCode"])).length(2), // Ensure exactly 2 columns
        data: z.array(
          z.object({
            row: z.tuple([
              z.string(), // Module name
              z.number(), // TotalLinesOfCode
            ]),
          }),
        ),
      }),
    )
    .min(1),
});

const TransformSchema = LinesOfCodeSchema.transform((data) => {
  const result = data.results[0]; // Assuming we're interested in the first result
  const { columns, data: rows } = result;

  const columnIndices: Record<string, number> = {};
  columns.forEach((col, index) => {
    columnIndices[col] = index;
  });

  const record: Record<string, number> = {};

  rows.forEach((item) => {
    const row = item.row;

    const [moduleName, totalLinesOfCode] = row;

    record[moduleName] = totalLinesOfCode;
  });

  return record;
});

const CompleteSchema = TransformSchema;
