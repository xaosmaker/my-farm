"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";

export default function BaseForm({
  children,
  buttonChildren,
  cardTitle,
  cardDescription,
}: {
  children: React.ReactNode;
  buttonChildren: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
}) {
  return (
    <Card className="mx-auto w-1/3 min-w-80">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Field orientation="horizontal">{buttonChildren}</Field>
      </CardFooter>
    </Card>
  );
}
