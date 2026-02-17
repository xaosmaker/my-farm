import { FieldError } from "./ui/field";

export default function ServerError({
  errors,
}: {
  errors?: Array<{ message?: string } | undefined>;
}) {
  if (!errors) {
    return;
  }
  return <FieldError className="mt-10" errors={errors} />;
}
