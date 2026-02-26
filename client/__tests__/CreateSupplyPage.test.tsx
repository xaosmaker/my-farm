import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      createSupplies: "Create Supply",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/supplies/forms/CreateSupplyForm", () => ({
  default: () => <div data-testid="create-supply-form" />,
}));

describe("Create Supply Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/supplies/create/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Create Supply");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: CreateSupplyPage } = await import("@/app/[locale]/(protected)/supplies/create/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });

    await CreateSupplyPage();

    expect(getAuth).toHaveBeenCalled();
  });
});
