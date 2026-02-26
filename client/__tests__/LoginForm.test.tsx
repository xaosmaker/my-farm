import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "@/features/auth/forms/LoginForm";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import en from "../messages/en.json";
import { signIn } from "../__mocks__/next-auth/react";
import { useRouter } from "../__mocks__/next/navigation";
import { afterEach } from "vitest";

vi.mock("next/navigation");
vi.mock("next-auth/react");

afterEach(() => {
  cleanup();
});
describe("Login Form Tests", () => {
  it("renders all form text elements", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const login = en.LoginForm;

    for (const key in login) {
      const k = key as keyof typeof login;
      const val = login[k] as string;

      expect(screen.getByText(val)).toBeDefined();
    }

    expect(screen.getByRole("link", { name: "Sign Up" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
    expect(screen.getByRole("button", { name: "show password" })).toBeDefined();
  });

  it("shows email validation error and hides after valid input", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email *") as HTMLInputElement;
    expect(emailInput.value).toBe("");
    await userEvent.type(emailInput, "test");
    expect(emailInput.value).toBe("test");
    expect(screen.getByText("Enter a valid email")).toBeDefined();
    await userEvent.type(emailInput, "test@test.com");
    expect(screen.queryByText("Enter a valid email")).toBeNull();
  });
  it("shows password required error when cleared", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email *") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password *") as HTMLInputElement;
    await userEvent.type(emailInput, "tes");
    await userEvent.type(passInput, "t");
    await userEvent.clear(passInput);

    expect(screen.getByText("Enter a valid email")).toBeDefined();
    expect(screen.getByText("This Field is required")).toBeDefined();
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passInput, "test");

    expect(screen.queryByText("Enter a valid Email")).toBeNull();
    expect(screen.queryByText("This Field is required")).toBeNull();
  });
  it("toggling password visibility shows and hides password", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    const passInput = screen.getByLabelText("Password *") as HTMLInputElement;
    await userEvent.type(passInput, "testX");
    expect(screen.queryByText("testX")).toBeNull();
    const showPass = screen.getByRole("button", {
      name: "show password",
    }) as HTMLButtonElement;
    await userEvent.click(showPass);
    expect(screen.queryByText("testX")).toBeDefined();
  });
  it("shows error on failed login", async () => {
    signIn.mockReturnValue({ error: true });
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    const emailInput = screen.getByLabelText("Email *") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password *") as HTMLInputElement;
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passInput, "test");

    const submit = screen.getByRole("button", { name: "Login" });

    await userEvent.click(submit);
    expect(screen.getByText("Email or password don't match")).toBeDefined();
  });

  it("redirects to /farm on successful login", async () => {
    signIn.mockReturnValue({});
    const router = useRouter();
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    const emailInput = screen.getByLabelText("Email *") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password *") as HTMLInputElement;
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passInput, "test");

    const submit = screen.getByRole("button", { name: "Login" });
    await userEvent.click(submit);
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "test@test.com",
      password: "test",
      redirect: false,
      intl: "Europe/Athens",
    });
    expect(router.push).toHaveBeenCalledWith("/farm");
  });
});
