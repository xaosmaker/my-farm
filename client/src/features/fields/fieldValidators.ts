import { z } from "zod/v4";

export const fieldValidator = z.object({
  landUnit: z.string(),
  name: z.string().nonempty("Required"),
  areaInMeters: z
    .string()
    .refine((value) => value.match(/^\d+(\.\d+)?$/), {
      error: "Required and use . for decimal",
    })
    .refine((value) => parseFloat(value) > 0, {
      error: "Should be greater than 0",
    }),
  fieldLocation: z.string(),
  isOwned: z.boolean(),
  govPDF: z.custom<FileList>().nullable(),
});

export type FieldFormData = z.infer<typeof fieldValidator>;
