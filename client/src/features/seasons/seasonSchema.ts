import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function seasonSchema(t: TFnError) {
  return z.object({
    name: z.string().nullable(),
    startSeason: z.date(t("required_generic")),
    finishSeason: z.date().optional(),
    // boundary: z.any(),
    areaInMeters: z
      .string()
      .refine((value) => value.match(/^\d+(\.\d+)?$/), {
        error: t("invalid_number"),
      })
      .refine((value) => parseFloat(value) > 0, {
        error: t("invalid_min", { min: 8 }),
      }),
    fieldId: z.number(),
    crop: z.string(t("required_field")).refine((item) => parseInt(item) > 0, {
      error: t("required_field"),
    }),
  });
}

export type seasonSchema = z.infer<ReturnType<typeof seasonSchema>>;
