"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollAnimation from "./ScrollAnimation";

export default function HeroSection() {
  const t = useTranslations("Landing");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollAnimation animation="fade-up">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
              My Farm
            </h1>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={150}>
            <h2 className="mb-4 text-2xl font-semibold text-white/90 md:text-4xl">
              {t("hero.headline")}
            </h2>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={300}>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
              {t("hero.subheadline")}
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={450}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                <Link href="/login">{t("hero.loginButton")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">{t("hero.signUpButton")}</Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
