import { describe, expect, it, Mock, vi, beforeEach } from "vitest";
import { getAuth } from "@/lib/getAuth";
import { getSettings } from "@/features/settings/settingsFetchers";

vi.mock("@/lib/getAuth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/features/settings/settingsFetchers", () => ({
  getSettings: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => {
    const translations: Record<string, string> = {
      settings: "Settings",
    };
    return translations[key] || key;
  }),
}));

describe("Settings Page Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct metadata", async () => {
    const { generateMetadata } = await import("@/app/[locale]/(protected)/settings/page");
    const metadata = await generateMetadata();
    expect(metadata.title).toBe("Settings");
  });

  it("calls getAuth to verify user is authenticated", async () => {
    const { default: SettingsPage } = await import("@/app/[locale]/(protected)/settings/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    (getSettings as Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    });

    await SettingsPage();

    expect(getAuth).toHaveBeenCalled();
  });

  it("fetches user settings", async () => {
    const { default: SettingsPage } = await import("@/app/[locale]/(protected)/settings/page");
    (getAuth as Mock).mockResolvedValue({ user: { id: 1 } });
    const mockSettings = {
      id: 1,
      userId: 1,
      landUnit: "stremata",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    (getSettings as Mock).mockResolvedValue(mockSettings);

    await SettingsPage();

    expect(getSettings).toHaveBeenCalled();
  });
});
