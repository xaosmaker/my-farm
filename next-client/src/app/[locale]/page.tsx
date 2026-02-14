import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("test");
  return (
    <main>
      <p>{t("t")}</p>
    </main>
  );
}
