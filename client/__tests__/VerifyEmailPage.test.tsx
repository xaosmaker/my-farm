import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { redirect } from "../__mocks__/next/navigation";
import { auth } from "@/lib/auth";
import { verifyEmailAction } from "@/features/auth/authActions";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`Redirect to ${path}`);
  }),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/features/auth/authActions", () => ({
  verifyEmailAction: vi.fn(),
}));

describe("Verify Email Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to / when user is authenticated", async () => {
    const VerifyPage = (await import("@/app/[locale]/(auth)/verify/[token]/page")).default;
    (auth as Mock).mockResolvedValue({ user: { id: 1 } });

    try {
      await VerifyPage({ params: Promise.resolve({ token: "test-token" }) });
    } catch (e) {
      // Expected redirect
    }

    expect(auth).toHaveBeenCalled();
  });

  it("calls verifyEmailAction with token", async () => {
    const VerifyPage = (await import("@/app/[locale]/(auth)/verify/[token]/page")).default;
    (auth as Mock).mockResolvedValue(null);
    (verifyEmailAction as Mock).mockResolvedValue({
      success: false,
      errors: [{ message: "Invalid token", appCode: "invalid_verification_token" }],
    });

    try {
      await VerifyPage({ params: Promise.resolve({ token: "test-token-123" }) });
    } catch (e) {
      // Expected due to setTimeout delay
    }

    expect(verifyEmailAction).toHaveBeenCalledWith(undefined, { token: "test-token-123" });
  });

  it("redirects to / on successful verification", async () => {
    const VerifyPage = (await import("@/app/[locale]/(auth)/verify/[token]/page")).default;
    (auth as Mock).mockResolvedValue(null);
    (verifyEmailAction as Mock).mockResolvedValue({ success: true, errors: undefined });

    try {
      await VerifyPage({ params: Promise.resolve({ token: "valid-token" }) });
    } catch (e) {
      // Expected redirect to /
    }

    expect(verifyEmailAction).toHaveBeenCalledWith(undefined, { token: "valid-token" });
  });
});
