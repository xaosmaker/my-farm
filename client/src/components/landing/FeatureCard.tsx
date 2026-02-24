"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ScrollAnimation from "./ScrollAnimation";

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  index: number;
}

export default function FeatureCard({
  title,
  description,
  imageUrl,
  index,
}: FeatureCardProps) {
  return (
    <ScrollAnimation animation="fade-up" delay={index * 100}>
      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </ScrollAnimation>
  );
}
