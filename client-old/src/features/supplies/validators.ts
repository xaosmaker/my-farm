import { MEASUREMENT_UNITS, SUPPLIES_TYPES } from "@/types/sharedTypes";
import { z } from "zod/v4";

export const suppliesValidator = z.object({
  nickname: z.string(),
  name: z.string().nonempty("required_field"),
  supplyType: z.string().refine((val) => SUPPLIES_TYPES.includes(val), {
    error: "invalid_supply_type",
  }),
  measurementUnit: z
    .string()

    .refine((val) => MEASUREMENT_UNITS.includes(val), {
      error: "invalid_measurement_unit",
    }),
});

export type SuppliesRequest = z.infer<typeof suppliesValidator>;
