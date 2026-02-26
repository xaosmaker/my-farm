import LoginPage, { generateMetadata } from "@/app/[locale]/(auth)/login/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { redirect } from "../__mocks__/next/navigation";
import { auth } from "@/lib/auth";
import { vi, type Mock } from "vitest";

vi.mock("next/navigation");
vi.mock("next-auth/react");
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      login: "Login",
      verifyEmail: "Verify Email",
      resendVerifyEmail: "Resend Verification",
      createField: "Create Field",
      updateField: "Update Field",
      createSeason: "Create Season",
      updateSeason: "Update Season",
      createSupplies: "Create Supply",
      updateSupplies: "Update Supply",
      createFarm: "Create Farm",
      dashboard: "Dashboard",
      field: "Field",
      fields: "Fields",
      seasons: "Seasons",
      supplies: "Supplies",
      settings: "Settings",
    };
    return translations[key] || key;
  }),
}));
vi.mock("@/features/auth/forms/LoginForm", () => ({
  default: () => <div data-testid="login-form" />,
}));

describe("Login Page Tests", () => {
  it("generates correct metadata", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Login");
  });

  it("redirects to /farm when user is authenticated", async () => {
    (auth as Mock).mockResolvedValue({ user: {} });
    const comp = await LoginPage();
    render(comp);
    expect(redirect).toHaveBeenCalledWith("/farm");
  });

  it("renders login form when user is not authenticated", async () => {
    (auth as Mock).mockResolvedValue({ user: undefined });
    const comp = await LoginPage();
    render(comp);
    expect(screen.getByTestId("login-form")).toBeDefined();
  });
});
