import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>My Farm Login</CardTitle>
        <CardDescription>Login to your My Farm account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field data-invalid={true}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input aria-invalid={true} name="email" id="email" />
              <FieldError errors={[{ message: "soem error" }]} />
            </Field>

            <Field data-invalid={true}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input aria-invalid={true} name="email" id="email" />
              <FieldError errors={[{ message: "soem error" }]} />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
