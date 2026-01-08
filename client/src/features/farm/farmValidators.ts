import { z } from "zod/v4";

const alphanumspaceRegex = /^[A-Za-z0-9\u0370-\u03FF\u1F00-\u1FFF ]+$/;
export const farmValidators = z.object({
  name: z
    .string()
    .nonempty("Αυτό το πεδίο είναι υποχρεωτικό")
    .refine((val) => val.match(alphanumspaceRegex), {
      error: "Το πεδίο μπορεί να περιέχει μόνο γράμματα αριθμούς και κενά",
    }),
});

export type FarmFormData = z.infer<typeof farmValidators>;
