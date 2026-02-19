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
  it("Text render correct", () => {
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

  it("Email error render correct and hide after", async () => {
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
  it("Password Error render Correctly", async () => {
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
  it("Show Password on screen", async () => {
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
  it("Login wrong credentials", async () => {
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

  it("Login success", async () => {
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
    });
    expect(router.push).toHaveBeenCalledWith("/");
  });
});
