import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import RegForm from "@/features/auth/forms/RegForm";
import { createUserAction } from "@/features/auth/actions/authActions";
import { regErrors } from "./errorMessages/RegisterErrors";
import { toResponseError } from "@/lib/responseError";

jest.mock("@/features/auth/actions/authActions", () => ({
  createUserAction: jest.fn(),
}));

describe("Reg Form Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );
    const register = en.Register;
    for (const key in register) {
      const k = key as keyof typeof register;
      const val = register[k] as string;

      if (
        [
          register.showPassword,
          register.successDesc,
          register.successTitle,
        ].includes(val)
      ) {
        continue;
      }

      expect(screen.getByText(val)).toBeDefined();
    }

    expect(screen.getByRole("link", { name: "Login" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Register" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDefined();
    expect(screen.getAllByTitle(register.showPassword).length).toBe(2);
  });

  it("check email Error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "hello");

    expect(screen.getByText(en.Errors.invalid_email)).toBeDefined();

    await userEvent.type(emailInput, "test@test.com");
    expect(screen.queryByText(en.Errors.invalid_email)).toBeNull();
  });

  it("check password error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );
    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "x");
    expect(
      screen.getByText(en.Errors.invalid_password_cap_letter),
    ).toBeDefined();
    await userEvent.type(passwordInput, "T");

    expect(
      screen.queryByText(en.Errors.invalid_password_cap_letter),
    ).toBeNull();
    expect(screen.getByText(en.Errors.invalid_password_number)).toBeDefined();

    await userEvent.type(passwordInput, "Test1");

    expect(
      screen.queryByText(en.Errors.invalid_password_cap_letter),
    ).toBeNull();
    expect(screen.queryByText(en.Errors.invalid_password_number)).toBeNull();
    expect(
      screen.getByText("Password should be 8 chars and more"),
    ).toBeDefined();

    await userEvent.type(passwordInput, "Test1test");

    expect(
      screen.queryByText(en.Errors.invalid_password_cap_letter),
    ).toBeNull();
    expect(screen.queryByText(en.Errors.invalid_password_number)).toBeNull();
    expect(
      screen.queryByText("Password should be 8 chars and more"),
    ).toBeNull();
  });
  it("check password mismatch", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test");
    expect(screen.getByText(en.Errors.invalid_password_mismatch)).toBeDefined();
    await userEvent.type(confirmPasswordInput, "1test");

    expect(screen.queryByText(en.Errors.invalid_password_mismatch)).toBeNull();
  });
  it("check click empty form", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: "Register" });
    await userEvent.click(submitButton);
    expect(screen.getByText(en.Errors.invalid_email)).toBeDefined();
    expect(
      screen.getByText(en.Errors.invalid_password_cap_letter),
    ).toBeDefined();
  });

  it("check action is called with correct data", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@test.com");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test1test");
    const submitButton = screen.getByRole("button", { name: "Register" });
    await userEvent.click(submitButton);
    expect(createUserAction).toHaveBeenCalled();
    expect(createUserAction).toHaveBeenCalledWith(undefined, {
      confirmPassword: "Test1test",
      email: "test@test.com",
      password: "Test1test",
    });
  });

  it("CreateUserAction Success", async () => {
    //need to implement this and check all errors at once
    ////need to implement this and check all errors at once
    const mock = createUserAction as jest.Mock;
    mock.mockResolvedValue({
      success: true,

      errors: undefined,
    });
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@test.com");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test1test");
    const submitButton = screen.getByRole("button", { name: "Register" });
    await userEvent.click(submitButton);

    expect(await screen.findByText(en.Register.successTitle)).toBeDefined();
    expect(await screen.findByText(en.Register.successDesc)).toBeDefined();
  });

  it("CreateUserAction errors", async () => {
    const er = toResponseError(regErrors);
    const mock = createUserAction as jest.Mock;
    mock.mockResolvedValue({
      success: false,

      errors: er,
    });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <RegForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email");
    await userEvent.type(emailInput, "test@test.com");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    await userEvent.type(passwordInput, "Test1test");
    await userEvent.type(confirmPasswordInput, "Test1test");
    const submitButton = screen.getByRole("button", { name: "Register" });
    await userEvent.click(submitButton);

    for (const err of regErrors.errors) {
      const key = err.appCode as keyof typeof en.Errors;
      let msg = en.Errors[key];
      if (err.meta) {
        for (const m in err.meta) {
          const metaKey = m as keyof typeof err.meta;
          msg = msg.replace(`{${m}}`, err.meta[metaKey] || "");
        }
      }

      // sc.debug(await screen.findByTitle("helloDro"));
      expect(await screen.findByText(msg)).toBeDefined();
    }
  });
});
