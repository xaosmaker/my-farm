import { FieldError } from "./ui/field";

export default function ServerErrors({
  errors,
}: {
  errors: Array<{ message?: string } | undefined>;
}) {
  return (
    <div>
      <p className="mt-5 text-red-600">server errors</p>
      <FieldError errors={errors} />
    </div>
  );
}
