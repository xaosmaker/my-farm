import { MEASUREMENT_UNITS, SUPPLIES_TYPES } from "@/lib/globalData";
import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function suppliesSchema(t: TFnError, fieldName: string) {
  return z.object({
    nickname: z.string(),
    name: z.string().nonempty(t("required_field", { name: fieldName })),
    supplyType: z
      .string()
      .refine((val) => (SUPPLIES_TYPES as readonly string[]).includes(val), {
        error: t("invalid_supply_type", { oneof: SUPPLIES_TYPES.join(", ") }),
      }),
    measurementUnit: z
      .string()
      .refine((val) => (MEASUREMENT_UNITS as readonly string[]).includes(val), {
        error: t("invalid_measurement_unit", { oneof: MEASUREMENT_UNITS.join(", ") }),
      }),
  });
}

export type SuppliesSchema = z.infer<ReturnType<typeof suppliesSchema>>;
