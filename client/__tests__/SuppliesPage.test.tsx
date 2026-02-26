import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSupplies } from "@/features/supplies/suppliesFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/supplies/suppliesFetchers", () => ({
  getSupplies: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      supplies: "Supplies",
    };
    return translations[key] || key;
  }),
}));

describe("Supplies Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/supplies/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Supplies");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: SuppliesPage } = await import("@/app/[locale]/(protected)/supplies/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSupplies as Mock).mockResolvedValue([]);

    await SuppliesPage();

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches supplies data", async () => {
    const { default: SuppliesPage } = await import("@/app/[locale]/(protected)/supplies/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSupplies as Mock).mockResolvedValue([
      {
        id: 1,
        name: "Test Seeds",
        nickname: "Seeds",
        supplyType: "seeds",
        measurementUnit: "KG",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ]);

    await SuppliesPage();

    expect(getSupplies).toHaveBeenCalled();
  });
});
