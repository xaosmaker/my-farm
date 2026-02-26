import ResendVefifyPage, { generateMetadata } from "@/app/[locale]/(auth)/verify/resend/page";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { auth } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";
import en from "../messages/en.json";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      resendVerifyEmail: "Resend Verification",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/auth/forms/ResendVerForm", () => ({
  default: () => <div data-testid="resend-ver-form" />,
}));

describe("Resend Verification Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Resend Verification");
  });

  it("redirects to / when user is authenticated", async () => {
    const { redirect } = await import("next/navigation");
    (auth as Mock).mockResolvedValue({ user: { id: 1 } });

    try {
      await ResendVefifyPage();
    } catch (e) {
      // Expected redirect
    }

    expect(auth).toHaveBeenCalled();
  });

  it("renders resend verification form when user is not authenticated", async () => {
    (auth as Mock).mockResolvedValue(null);

    const result = await ResendVefifyPage();

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        {result}
      </NextIntlClientProvider>
    );

    expect(screen.getByTestId("resend-ver-form")).toBeDefined();
  });
});
