import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSeasons } from "@/features/seasons/seasonFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/seasons/seasonFetchers", () => ({
  getSeasons: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      seasons: "Seasons",
    };
    return translations[key] || key;
  }),
}));

describe("Seasons Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/seasons/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Seasons");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: SeasonPage } = await import("@/app/[locale]/(protected)/seasons/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    (getSeasons as Mock).mockResolvedValue([]);

    await SeasonPage();

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches seasons with user timezone", async () => {
    const { default: SeasonPage } = await import("@/app/[locale]/(protected)/seasons/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    (getSeasons as Mock).mockResolvedValue([
      {
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
      },
    ]);

    await SeasonPage();

    expect(getSeasons).toHaveBeenCalledWith("Europe/Athens");
  });
});
