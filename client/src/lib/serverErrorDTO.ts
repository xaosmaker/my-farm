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
        const meta = error.meta as { [x: string]: string | number | Date };
        if (meta) {
          for (const key of Object.keys(meta)) {
            if (
              typeof meta[key] === "string" &&
              t.has(
                `Meta.${meta[key] as keyof Messages["Global"]["Error"]["Meta"]}`,
              )
            ) {
              meta[key] = t(
                `Meta.${meta[key] as keyof Messages["Global"]["Error"]["Meta"]}`,
              );
            }
          }
        }
        return {
          message: t(
            error.appCode as Exclude<keyof Messages["Global"]["Error"], "Meta">,
            {
              ...meta,
            },
          ),
        };
      }
    }
  });
  return errorMessages;
}
