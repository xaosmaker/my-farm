import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getField } from "@/features/fields/fieldFetchers";
import { getSeasons } from "@/features/seasons/seasonFetchers";
import { getSettings } from "@/features/settings/settingsFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/fields/fieldFetchers", () => ({
  getField: vi.fn(),
}));

vi.mock("@/features/seasons/seasonFetchers", () => ({
  getSeasons: vi.fn(),
}));

vi.mock("@/features/settings/settingsFetchers", () => ({
  getSettings: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      field: "Field",
    };
    return translations[key] || key;
  }),
}));

describe("Field Detail Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/[fieldId]/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Field");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: FieldPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    (getField as Mock).mockResolvedValue(null);
    (getSettings as Mock).mockResolvedValue(null);
    (getSeasons as Mock).mockResolvedValue([]);

    await FieldPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches field data by ID", async () => {
    const { default: FieldPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
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
    (getField as Mock).mockResolvedValue(mockField);
    (getSettings as Mock).mockResolvedValue(null);
    (getSeasons as Mock).mockResolvedValue([]);

    await FieldPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getField).toHaveBeenCalledWith("1", true, "Europe/Athens");
  });

  it("fetches user settings and seasons", async () => {
    const { default: FieldPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/page");
    (getAuth as Mock).mockResolvedValue({
      user: { id: 1, intl: "Europe/Athens" },
    });
    (getField as Mock).mockResolvedValue({});
    (getSettings as Mock).mockResolvedValue({});
    (getSeasons as Mock).mockResolvedValue([]);

    await FieldPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getSettings).toHaveBeenCalled();
    expect(getSeasons).toHaveBeenCalledWith("Europe/Athens");
  });
});
