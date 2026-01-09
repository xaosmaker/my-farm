import { MEASUREMENT_UNITS, SUPPLIES_TYPES } from "@/types/sharedTypes";
import { z } from "zod/v4";

export const suppliesValidator = z.object({
  nickname: z.string(),
  name: z.string().nonempty(),
  supplyType: z.string().refine((val) => SUPPLIES_TYPES.includes(val), {
    error: `Supply type should contain one of "${SUPPLIES_TYPES.join(", ")}"`,
  }),
  measurementUnit: z
    .string()

    .refine((val) => MEASUREMENT_UNITS.includes(val), {
      error: `measurement unit should contain one of "${MEASUREMENT_UNITS.join(", ")}"`,
    }),
});

export type SuppliesRequest = z.infer<typeof suppliesValidator>;
