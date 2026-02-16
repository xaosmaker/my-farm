import { z } from "zod/v4";

export const fieldValidator = z.object({
  landUnit: z.string(),
  name: z.string().nonempty("required_field"),
  areaInMeters: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "invalid_number",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "invalid_min_number",
    }),
  fieldLocation: z.string(),
  isOwned: z.boolean(),
  govPDF: z.custom<FileList>().nullable(),
});

export type FieldFormData = z.infer<typeof fieldValidator>;
