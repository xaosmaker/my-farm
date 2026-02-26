import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getFields } from "@/features/fields/fieldFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/fields/fieldFetchers", () => ({
  getFields: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      field: "Field",
      fields: "Fields",
    };
    return translations[key] || key;
  }),
}));

describe("Fields Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Field");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: FieldsPage } = await import("@/app/[locale]/(protected)/fields/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getFields as Mock).mockResolvedValue([]);

    await FieldsPage();

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches fields data", async () => {
    const { default: FieldsPage } = await import("@/app/[locale]/(protected)/fields/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getFields as Mock).mockResolvedValue([
      {
        id: 1,
        name: "Test Field",
        fieldLocation: "Location A",
        areaInMeters: 100,
        isOwned: "true",
        landUnit: "stremata",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ]);

    await FieldsPage();

    expect(getFields).toHaveBeenCalled();
  });
});
