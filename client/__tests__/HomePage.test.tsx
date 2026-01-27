jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn(),
  //   redirect: jest.fn(),
  //   permanentRedirect: jest.fn(),
}));
import { render, screen } from "@testing-library/react";
import LoginForm from "@/features/auth/forms/LoginForm";
import { NextIntlClientProvider } from "next-intl";
import en from "../messages/en.json";

describe("Homepage test 5", () => {
  it("Title exists", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    expect(screen.getAllByRole("button")).toBeDefined();
  });
});
