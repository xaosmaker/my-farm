import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSettings } from "@/features/settings/settingsFetchers";
import { getSupplies } from "@/features/supplies/suppliesFetchers";
import { getSeason } from "@/features/seasons/seasonFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/settings/settingsFetchers", () => ({
  getSettings: vi.fn(),
}));

vi.mock("@/features/supplies/suppliesFetchers", () => ({
  getSupplies: vi.fn(),
}));

vi.mock("@/features/seasons/seasonFetchers", () => ({
  getSeason: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      updateSeason: "Update Season",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/seasons/forms/CreateSeasonForm", () => ({
  default: () => <div data-testid="update-season-form" />,
}));

describe("Update Season Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/[seasonId]/update/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Update Season");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: UpdateSeasonPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/[seasonId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1, intl: "Europe/Athens" } });
    (getSettings as Mock).mockResolvedValue({});
    (getSupplies as Mock).mockResolvedValue([]);
    (getSeason as Mock).mockResolvedValue({});

    await UpdateSeasonPage({ params: Promise.resolve({ fieldId: "1", seasonId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches season data, user settings and supplies", async () => {
    const { default: UpdateSeasonPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/[seasonId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1, intl: "Europe/Athens" } });
    const mockSeason = {
      id: 1,
      name: "Spring 2024",
      startSeason: "2024-01-01",
      finishSeason: "2024-06-01",
      areaInMeters: 100,
      crop: 1,
      cropName: "Tomatoes",
      fieldName: "Field 1",
      fieldAreaInMeters: 100,
      fieldId: 1,
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    (getSeason as Mock).mockResolvedValue(mockSeason);
    (getSettings as Mock).mockResolvedValue({});
    (getSupplies as Mock).mockResolvedValue([]);

    await UpdateSeasonPage({ params: Promise.resolve({ fieldId: "1", seasonId: "1" }) });

    expect(getSeason).toHaveBeenCalledWith("1", "Europe/Athens");
    expect(getSettings).toHaveBeenCalled();
    expect(getSupplies).toHaveBeenCalled();
  });
});
