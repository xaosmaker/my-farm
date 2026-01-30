import { render, screen } from "@testing-library/react";
import LoginForm from "@/features/auth/forms/LoginForm";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import en from "../messages/en.json";
import { signIn } from "./__mocks__/next-auth/react";
import { useRouter } from "./__mocks__/next/navigation";

describe("Login Form Tests", () => {
  it("Text render correct", () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const login = en.Login;

    for (const key in login) {
      const k = key as keyof typeof login;
      const val = login[k] as string;

      if (val === login.showPassword) {
        continue;
      }

      expect(screen.getByText(val)).toBeDefined();
    }

    expect(screen.getByRole("link", { name: "Register" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
    expect(screen.getByTitle("Show Password")).toBeDefined();
  });

  it("Email error render correct and hide after", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    expect(emailInput.value).toBe("");
    await userEvent.type(emailInput, "test");
    expect(emailInput.value).toBe("test");
    expect(screen.getByText("Enter a valid Email")).toBeDefined();
    await userEvent.type(emailInput, "test@test.com");
    expect(screen.queryByText("Enter a valid Email")).toBeNull();
  });
  it("Password Error render Correctly", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );

    const submit = screen.getByRole("button", { name: "Login" });
    await userEvent.click(submit);
    expect(screen.getByText("Enter a valid Email")).toBeDefined();
    expect(screen.getByText("Password is required")).toBeDefined();
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password") as HTMLInputElement;
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passInput, "test");

    expect(screen.queryByText("Enter a valid Email")).toBeNull();
    expect(screen.queryByText("Password is required")).toBeNull();
  });
  it("Show Password on screen", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    const passInput = screen.getByLabelText("Password") as HTMLInputElement;
    await userEvent.type(passInput, "testX");
    expect(screen.queryByText("testX")).toBeNull();
    const showPass = screen.getByTitle("Show Password") as HTMLButtonElement;
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
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password") as HTMLInputElement;
    await userEvent.type(emailInput, "test@test.com");
    await userEvent.type(passInput, "test");

    const submit = screen.getByRole("button", { name: "Login" });
    await userEvent.click(submit);
    expect(screen.getByText("Invalid Credentials")).toBeDefined();
  });
  it("Login success", async () => {
    signIn.mockReturnValue({});
    const router = useRouter();
    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <LoginForm />
      </NextIntlClientProvider>,
    );
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passInput = screen.getByLabelText("Password") as HTMLInputElement;
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
