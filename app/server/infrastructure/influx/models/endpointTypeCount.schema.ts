import { z } from "zod";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";
import { ZodValidationError } from "@server/domain/value/zodValidationError";

export const validateEndpointTypeCountSchema = (data: unknown[]): EndpointTypeCountDAO => {
  const parsed = parsedSchema.safeParse(data);
  if (parsed.error) {
    throw new ZodValidationError(parsed.error);
  }

  return parsed.data;
};

const rawSchema = z.array(
  z.object({
    method: z.enum(["get", "post", "put", "delete", "patch"]),
    _value: z.number(),
  }),
);

const parsedSchema = rawSchema.transform((data) => {
  const endpointCounts: EndpointTypeCountDAO = {
    get: 0,
    post: 0,
    put: 0,
    delete: 0,
    patch: 0,
  };

  data.forEach((row) => {
    endpointCounts[row.method] += row._value;
  });

  return endpointCounts;
});
