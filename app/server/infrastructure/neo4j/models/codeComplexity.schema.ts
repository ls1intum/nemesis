import { z } from "zod";
import { CodeComplexityMetricsDAO } from "@server/domain/dao/codeComplexityMetrics";
import { MethodLengthBucketDAO } from "@server/domain/dao/methodLengthBucket";

export const validateCodeComplexityMetrics = (
  data: string,
): Record<string, CodeComplexityMetricsDAO> => {
  const jsonData = JSON.parse(data);
  const result = CodeComplexityMetricsDAOSchema.safeParse(jsonData);
  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }
  return result.data;
};

const CodeComplexityMetricsDAOSchema = z
  .object({
    results: z
      .array(
        z.object({
          columns: z
            .array(
              z.enum([
                "Module",
                "repositoryMethodLengths",
                "serviceMethodLengths",
                "resourceMethodLengths",
              ]),
            )
            .length(4), // Ensure exactly 4 columns
          data: z.array(
            z.object({
              row: z.tuple([
                z.string(), // Module name
                z.array(z.number()),
                z.array(z.number()),
                z.array(z.number()),
              ]),
            }),
          ),
        }),
      )
      .min(1),
  })
  .transform((data) => {
    const result = data.results[0];
    const { data: rows } = result;

    const record: Record<string, CodeComplexityMetricsDAO> = {};

    const splitIntoBuckets = (arr: number[]): MethodLengthBucketDAO[] => {
      const buckets: MethodLengthBucketDAO[] = [];
      const bucketSize = 5;
      const countByLocStart = new Map<number, number>();

      for (const loc of arr) {
        const locStart = Math.floor(loc / bucketSize) * bucketSize + 1;
        countByLocStart.set(locStart, (countByLocStart.get(locStart) || 0) + 1);
      }

      countByLocStart.forEach((count, locStart) => {
        buckets.push({
          locStartInclusive: locStart,
          locEndInclusive: locStart + bucketSize - 1,
          count,
        });
      });

      return buckets;
    };

    rows.forEach((item) => {
      const row = item.row;

      const [
        moduleName,
        repositoryMethodLengthsArray,
        serviceMethodLengthsArray,
        resourceMethodLengthsArray,
      ] = row;

      const repositoryMethodLengths = splitIntoBuckets(repositoryMethodLengthsArray);

      const serviceMethodLengths = splitIntoBuckets(serviceMethodLengthsArray);

      const controllerMethodLengths = splitIntoBuckets(resourceMethodLengthsArray); // Mapping 'resourceMethodLengths' to 'controllerMethodLengths'

      record[moduleName] = {
        repositoryMethodLengths,
        serviceMethodLengths,
        controllerMethodLengths,
      };
    });

    return record;
  });
