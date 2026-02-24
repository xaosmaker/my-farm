import { TFnError } from "@/types/TFnError";
import { z } from "zod/v4";

export const registerSchema = (t: TFnError) =>
  z
    .object({
      email: z.email(t("invalid_email")),
      password: z
        .string()
        .refine((data) => /[A-Z]/.test(data), t("invalid_password_cap_letter"))
        .refine((data) => /[1-9]/.test(data), t("invalid_password_number"))
        .min(8, { error: t("invalid_password_length") }),

      confirmPassword: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.password != data.confirmPassword) {
        ctx.addIssue({
          path: ["confirmPassword"],
          message: t("password_mismatch_error"),
          code: "custom",
        });
      }
    });

export type RegisterSchema = z.infer<ReturnType<typeof registerSchema>>;
