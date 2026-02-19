import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import RegisterForm from "@/features/auth/forms/RegisterForm";
import { registerAction } from "@/features/auth/authActions";

vi.mock("@/features/auth/authActions", () => ({
  registerAction: vi.fn(),
}));
vi.mock("next/navigation");

afterEach(() => {
  cleanup();
});

describe("Reg Form Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );
    const register = en.RegisterForm;
    for (const key in register) {
      const k = key as keyof typeof register;
      const val = register[k] as string;

      if ([register.successDesc, register.successTitle].includes(val)) {
        continue;
      }

      expect(screen.getByText(val)).toBeDefined();
    }

    expect(screen.getByRole("link", { name: "Login" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Refresh form" })).toBeDefined();
    expect(
      screen.getAllByRole("button", { name: "show password" }).length,
    ).toBe(2);
  });

  it("check email Error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email *");
    await userEvent.type(emailInput, "hello");

    expect(screen.getByText(en.Global.Error.invalid_email)).toBeDefined();

    await userEvent.type(emailInput, "test@test.com");
    expect(screen.queryByText(en.Global.Error.invalid_email)).toBeNull();
  });

  it("check password error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );
    const passwordInput = screen.getByLabelText("Password *");
    await userEvent.type(passwordInput, "x");
    expect(
      screen.getByText(en.Global.Error.invalid_password_cap_letter),
    ).toBeDefined();
    await userEvent.type(passwordInput, "T");

    expect(
      screen.queryByText(en.Global.Error.invalid_password_cap_letter),
    ).toBeNull();
    expect(
      screen.getByText(en.Global.Error.invalid_password_number),
    ).toBeDefined();

    await userEvent.type(passwordInput, "Test1");

    expect(
      screen.queryByText(en.Global.Error.invalid_password_cap_letter),
    ).toBeNull();
    expect(
      screen.queryByText(en.Global.Error.invalid_password_number),
    ).toBeNull();
    expect(
      screen.getByText("Password should be 8 chars and more"),
    ).toBeDefined();

    await userEvent.type(passwordInput, "Test1test");

    expect(
      screen.queryByText(en.Global.Error.invalid_password_cap_letter),
    ).toBeNull();
    expect(
      screen.queryByText(en.Global.Error.invalid_password_number),
    ).toBeNull();
    expect(
      screen.queryByText("Password should be 8 chars and more"),
    ).toBeNull();
  });
  it("check password mismatch", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );
    const passwordInput = screen.getByLabelText("Password *");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password *");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test");
    expect(
      screen.getByText(en.Global.Error.password_mismatch_error),
    ).toBeDefined();
    await userEvent.type(confirmPasswordInput, "1test");

    expect(
      screen.queryByText(en.Global.Error.password_mismatch_error),
    ).toBeNull();
  });
  it("check click empty form", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    await userEvent.click(submitButton);
    // we wait null because of the native browser validation
    expect(screen.queryByText(en.Global.Error.invalid_email)).toBeNull();
    expect(
      screen.queryByText(en.Global.Error.invalid_password_cap_letter),
    ).toBeNull();
  });

  it("check action is called with correct data", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email *");
    await userEvent.type(emailInput, "test@test.com");
    const passwordInput = screen.getByLabelText("Password *");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password *");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test1test");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    await userEvent.click(submitButton);
    expect(registerAction).toHaveBeenCalled();
    expect(registerAction).toHaveBeenCalledWith(undefined, {
      confirmPassword: "Test1test",
      email: "test@test.com",
      password: "Test1test",
    });
  });

  it("CreateUserAction Success", async () => {
    //need to implement this and check all errors at once
    ////need to implement this and check all errors at once
    const mock = registerAction as Mock;
    mock.mockResolvedValue({
      success: true,

      errors: undefined,
    });
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegisterForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email *");
    await userEvent.type(emailInput, "test@test.com");
    const passwordInput = screen.getByLabelText("Password *");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password *");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test1test");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });
    await userEvent.click(submitButton);

    expect(await screen.findByText(en.RegisterForm.successTitle)).toBeDefined();
    expect(await screen.findByText(en.RegisterForm.successDesc)).toBeDefined();
  });
});
