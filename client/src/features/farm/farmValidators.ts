import { z } from "zod/v4";

const alphanumspaceRegex = /^[A-Za-z0-9\u0370-\u03FF\u1F00-\u1FFF ]+$/;
export const farmValidators = z.object({
  name: z
    .string()
    .nonempty("required_field")
    .refine((val) => val.match(alphanumspaceRegex), {
      error: "invalid_str_num_space",
    }),
});

export type FarmFormData = z.infer<typeof farmValidators>;
