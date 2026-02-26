import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getField } from "@/features/fields/fieldFetchers";
import { getSeasonsByFieldId } from "@/features/seasons/seasonFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/fields/fieldFetchers", () => ({
  getField: vi.fn(),
}));

vi.mock("@/features/seasons/seasonFetchers", () => ({
  getSeasonsByFieldId: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      seasons: "Seasons",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/seasons/SeasonsTable", () => ({
  default: () => <div data-testid="seasons-table" />,
}));

describe("Field Seasons Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/page");
    (getField as Mock).mockResolvedValue({ name: "Test Field" });
    const metadata = await generateMetadata({ params: Promise.resolve({ fieldId: "1" }) });
    expect(metadata.title).toBe("Seasons Test Field");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: FieldSeasonsPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1, intl: "Europe/Athens" } });
    (getField as Mock).mockResolvedValue({});
    (getSeasonsByFieldId as Mock).mockResolvedValue([]);

    await FieldSeasonsPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches field and seasons data", async () => {
    const { default: FieldSeasonsPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/seasons/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1, intl: "Europe/Athens" } });
    const mockField = {
      id: 1,
      name: "Test Field",
      fieldLocation: "Location A",
      areaInMeters: 100,
      isOwned: "true",
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    const mockSeasons = [
      {
        id: 1,
        name: "Spring 2024",
        startSeason: "2024-01-01",
        finishSeason: "2024-06-01",
        areaInMeters: 100,
        crop: 1,
        cropName: "Tomatoes",
        fieldName: "Test Field",
        fieldAreaInMeters: 100,
        fieldId: 1,
        landUnit: "stremata",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    (getField as Mock).mockResolvedValue(mockField);
    (getSeasonsByFieldId as Mock).mockResolvedValue(mockSeasons);

    await FieldSeasonsPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getField).toHaveBeenCalledWith("1");
    expect(getSeasonsByFieldId).toHaveBeenCalledWith("1", "Europe/Athens");
  });
});
