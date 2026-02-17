import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function loginSchema(te: TFnError) {
  return z.object({
    email: z.email(te("invalid_email")),
    password: z.string().min(1, { error: te("required_generic") }),
  });
}
export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;
