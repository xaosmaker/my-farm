"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "./ScrollAnimation";

export default function CtaSection() {
  const t = useTranslations("Landing.cta");

  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <ScrollAnimation animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("title")}
          </h2>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up" delay={150}>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t("description")}
          </p>
        </ScrollAnimation>

        <ScrollAnimation animation="fade-up" delay={300}>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">{t("button")}</Link>
          </Button>
        </ScrollAnimation>
      </div>
    </section>
  );
}
