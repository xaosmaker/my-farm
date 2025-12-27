import { z } from "zod/v4";

const supplyTypes = ["chemicals", "fertilizers"];
const measurementUnits = ["KG", "L"];
export const suppliesValidator = z.object({
  nickname: z.string(),
  name: z.string().nonempty(),
  supplyType: z.string().refine((val) => supplyTypes.includes(val), {
    error: `Supply type should contain one of "${supplyTypes.join(", ")}"`,
  }),
  measurementUnit: z
    .string()

    .refine((val) => measurementUnits.includes(val), {
      error: `measurement unit should contain one of "${measurementUnits.join(", ")}"`,
    }),
});

export type SuppliesRequest = z.infer<typeof suppliesValidator>;
