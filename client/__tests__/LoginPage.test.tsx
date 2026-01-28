import LoginPage from "@/app/[locale]/(auth)/login/page";
import { render, screen } from "@testing-library/react";
import { redirect } from "./__mocks__/next/navigation";
import { auth } from "@/lib/auth";
jest.mock("next/navigation");

jest.mock("@/features/auth/forms/LoginForm", () => ({
  __esModule: true,
  default: () => <div data-testid="login-form" />,
}));

describe("Login Page Tests", () => {
  it("Login Page Redirect on user", async () => {
    (auth as jest.Mock).mockResolvedValue({ user: {} });
    const comp = await LoginPage();
    render(comp);
    expect(redirect).toHaveBeenCalledWith("/");
  });
  it("Login Page Render form", async () => {
    const comp = await LoginPage();
    render(comp);
    expect(screen.getByTestId("login-form")).toBeDefined();
  });
});
