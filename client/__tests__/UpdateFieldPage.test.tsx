import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getField } from "@/features/fields/fieldFetchers";
import { getSettings } from "@/features/settings/settingsFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/fields/fieldFetchers", () => ({
  getField: vi.fn(),
}));

vi.mock("@/features/settings/settingsFetchers", () => ({
  getSettings: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      updateField: "Update Field",
    };
    return translations[key] || key;
  }),
}));

vi.mock("@/features/fields/forms/CreateFieldForm", () => ({
  default: () => <div data-testid="update-field-form" />,
}));

describe("Update Field Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/fields/[fieldId]/update/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Update Field");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: UpdateFieldPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSettings as Mock).mockResolvedValue({});
    (getField as Mock).mockResolvedValue({});

    await UpdateFieldPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches field data and user settings", async () => {
    const { default: UpdateFieldPage } = await import("@/app/[locale]/(protected)/fields/[fieldId]/update/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
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
    const mockSettings = {
      id: 1,
      userId: 1,
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    (getField as Mock).mockResolvedValue(mockField);
    (getSettings as Mock).mockResolvedValue(mockSettings);

    await UpdateFieldPage({ params: Promise.resolve({ fieldId: "1" }) });

    expect(getField).toHaveBeenCalledWith("1");
    expect(getSettings).toHaveBeenCalled();
  });
});
