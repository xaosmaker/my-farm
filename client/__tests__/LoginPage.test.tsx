import LoginPage from "@/app/[locale]/(auth)/login/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { redirect } from "../__mocks__/next/navigation";
import { auth } from "@/lib/auth";
import { vi, type Mock } from "vitest";

vi.mock("next/navigation");
vi.mock("next-auth/react");
vi.mock("@/features/auth/forms/LoginForm", () => ({
  default: () => <div data-testid="login-form" />,
}));

describe("Login Page Tests", () => {
  it("Login Page Redirect on user", async () => {
    (auth as Mock).mockResolvedValue({ user: {} });
    const comp = await LoginPage();
    render(comp);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("Login Page Render form", async () => {
    (auth as Mock).mockResolvedValue({ user: undefined });
    const comp = await LoginPage();
    render(comp);
    expect(screen.getByTestId("login-form")).toBeDefined();
  });
});
