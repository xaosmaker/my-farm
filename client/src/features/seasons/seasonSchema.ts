import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function seasonSchema(t: TFnError, fieldName: string) {
  return z.object({
    name: z.string().min(1, t("required_field", { name: fieldName })),
    startSeason: z.date(t("required_generic")),
    finishSeason: z.date().optional(),
    areaInMeters: z
      .string()
      .refine((value) => value.match(/^(\d+)(\.\d+)?$/), {
        error: t("invalid_number"),
      })
      .refine((value) => parseFloat(value) > 0, {
        error: t("invalid_min", { min: 0 }),
      }),
    fieldId: z.number(),
    crop: z.string(t("required_generic")).refine((item) => parseInt(item) > 0, {
      error: t("required_generic"),
    }),
  });
}

export type SeasonSchema = z.infer<ReturnType<typeof seasonSchema>>;
