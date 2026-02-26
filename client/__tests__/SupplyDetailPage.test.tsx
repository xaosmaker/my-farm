import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSupply } from "@/features/supplies/suppliesFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/supplies/suppliesFetchers", () => ({
  getSupply: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      supplies: "Supplies",
    };
    return translations[key] || key;
  }),
}));

describe("Supply Detail Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Supplies");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: SupplyPage } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    (getSupply as Mock).mockResolvedValue(null);

    await SupplyPage({ params: Promise.resolve({ supplyId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches supply data by ID with timezone", async () => {
    const { default: SupplyPage } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    const mockSupply = {
      id: 1,
      name: "Test Seeds",
      nickname: "Seeds",
      supplyType: "seeds",
      measurementUnit: "KG",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    (getSupply as Mock).mockResolvedValue(mockSupply);

    await SupplyPage({ params: Promise.resolve({ supplyId: "1" }) });

    expect(getSupply).toHaveBeenCalledWith("1", true, "Europe/Athens");
  });
});
