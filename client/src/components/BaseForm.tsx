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
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export default function BaseForm({
  children,
  buttonChildren,
  cardTitle,
  cardDescription,
  cardAction,
}: {
  children: React.ReactNode;
  buttonChildren: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  cardAction?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Card className="mx-auto w-1/3 min-w-80">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
        {cardAction}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
          {buttonChildren}
        </Field>
      </CardFooter>
    </Card>
  );
}
