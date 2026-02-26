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
      updateSupplies: "Update Supply",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/supplies/forms/CreateSupplyForm", () => ({
  default: () => <div data-testid="update-supply-form" />,
}));

describe("Update Supply Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/update/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Update Supply");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: UpdateSupplyPage } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSupply as Mock).mockResolvedValue({});

    await UpdateSupplyPage({ params: Promise.resolve({ supplyId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches supply data by ID", async () => {
    const { default: UpdateSupplyPage } = await import("@/app/[locale]/(protected)/supplies/[supplyId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
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

    await UpdateSupplyPage({ params: Promise.resolve({ supplyId: "1" }) });

    expect(getSupply).toHaveBeenCalledWith("1", false);
  });
});
