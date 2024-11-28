import { z } from "zod";
import { EndpointTypeCountDAO } from "@server/domain/dao/endpointTypeCount";

const EndpointTypeCountRowSchema = z.object({
  method: z.enum(["get", "post", "put", "delete", "patch"]),
  _value: z.number(),
});

export const validateEndpointTypeCountSchema = (data: unknown[]): EndpointTypeCountDAO => {
  const endpointCounts: EndpointTypeCountDAO = {
    get: 0,
    post: 0,
    put: 0,
    delete: 0,
    patch: 0,
  };

  data.forEach((row, index) => {
    const parsed = EndpointTypeCountRowSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error(
        `Invalid data format when parsing endpoint type count row ${index}: ${parsed.error}`,
      );
    }
    const { method, _value } = parsed.data;
    endpointCounts[method] += _value;
  });

  return endpointCounts;
};
