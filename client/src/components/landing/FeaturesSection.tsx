"use client";

import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";
import ScrollAnimation from "./ScrollAnimation";

export default function FeaturesSection() {
  const t = useTranslations("Landing.features");

  const featureList = [
    {
      title: t("farms.title"),
      description: t("farms.description"),
      imageUrl:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    },
    {
      title: t("fields.title"),
      description: t("fields.description"),
      imageUrl:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80",
    },
    {
      title: t("seasons.title"),
      description: t("seasons.description"),
      imageUrl:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80",
    },
    {
      title: t("supplies.title"),
      description: t("supplies.description"),
      imageUrl:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <ScrollAnimation animation="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t("title")}
          </h2>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {featureList.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
