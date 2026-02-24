import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export function resendVerCodeSchema(t: TFnError) {
  return z.object({
    email: z.email(t("invalid_email")),
  });
}

export type ResendVerCodeSchema = z.infer<ReturnType<typeof resendVerCodeSchema>>;
