import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getSupplies } from "@/features/supplies/suppliesFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/settings/settingsFetchers", () => ({
  getSettings: vi.fn(),
}));

vi.mock("@/features/supplies/suppliesFetchers", () => ({
  getSupplies: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      createSeason: "Create Season",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/seasons/forms/CreateSeasonForm", () => ({
  default: () => <div data-testid="create-season-form" />,
}));

describe("Create Season Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/create/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Create Season");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: CreateSeasonPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/create/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSettings as Mock).mockResolvedValue({});
    (getSupplies as Mock).mockResolvedValue([]);

    await CreateSeasonPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches user settings and supplies", async () => {
    const { default: CreateSeasonPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/create/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    const mockSettings = {
      id: 1,
      userId: 1,
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    const mockSupplies = [
      {
        id: 1,
        name: "Test Seeds",
        nickname: "Seeds",
        supplyType: "seeds",
        measurementUnit: "KG",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    (getSettings as Mock).mockResolvedValue(mockSettings);
    (getSupplies as Mock).mockResolvedValue(mockSupplies);

    await CreateSeasonPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getSettings).toHaveBeenCalled();
    expect(getSupplies).toHaveBeenCalled();
  });
});
