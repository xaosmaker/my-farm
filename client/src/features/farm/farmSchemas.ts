import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

const alphanumspaceRegex = /^[A-Za-z0-9\u0370-\u03FF\u1F00-\u1FFF ]+$/;

export function createFarmSchema(t: TFnError, fieldName: string) {
  return z.object({
    name: z
      .string()
      .nonempty(t("required_generic"))
      .refine((val) => val.match(alphanumspaceRegex), {
        error: t("invalid_num_space_char", { name: fieldName }),
      }),
  });
}

export type CreateFarmSchema = z.infer<ReturnType<typeof createFarmSchema>>;
