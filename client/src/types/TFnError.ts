import { useTranslations } from "next-intl";

export type TFnError = ReturnType<typeof useTranslations<"Global.Error">>;
