import Link from "next/link";

export default function LoginError() {
  return (
    <div>
      <div className="text-center">
        <h1 className="pt-5 text-3xl font-bold text-red-500">
          Login to continue
        </h1>
        <Link href={"/login"}>Login Page</Link>
      </div>
    </div>
  );
}
