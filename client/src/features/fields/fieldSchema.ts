import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function fieldSchema(t: TFnError, fieldName: string) {
  return z.object({
    landUnit: z.string(),
    name: z.string().nonempty(t("required_field", { name: fieldName })),
    areaInMeters: z
      .string()
      .refine((value) => value.match(/^\d+(\.\d+)?$/), {
        error: t("invalid_number"),
      })
      .refine((value) => parseFloat(value) > 0, {
        error: t("invalid_min", { min: 0 }),
      }),
    fieldLocation: z.string(),
    isOwned: z.boolean(),
    govPDF: z.custom<FileList>().nullable(),
  });
}

export type FieldSchema = z.infer<ReturnType<typeof fieldSchema>>;
