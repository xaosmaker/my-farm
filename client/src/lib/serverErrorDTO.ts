import { TFnError } from "@/types/TFnError";
import { Messages } from "next-intl";

export function serverErrorDTO(serverErrorRes: unknown, t: TFnError) {
  if (
    serverErrorRes &&
    typeof serverErrorRes === "object" &&
    "errors" in serverErrorRes &&
    Array.isArray(serverErrorRes.errors)
  ) {
    return errorMessageDTO(serverErrorRes.errors, t);
  }
  return undefined;
}

function errorMessageDTO(serverErrors: unknown[], t: TFnError) {
  const errorMessages = serverErrors.map((error) => {
    if (error && typeof error === "object") {
      if (
        "appCode" in error &&
        "meta" in error &&
        typeof error.meta === "object"
      ) {
        return {
          message: t(error.appCode as keyof Messages["Global"]["Error"], {
            ...error.meta,
          }),
        };
      }
    }
  });
  return errorMessages;
}
