import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { updateSeasonAction } from "@/features/seasons/seasonActions";
import { UserSettings, Supply, Season } from "@/types/globalTypes";

vi.mock("@/features/seasons/seasonActions", () => ({
  updateSeasonAction: vi.fn(),
}));
vi.mock("next/navigation");

const mockUserSettings: UserSettings = {
  id: 1,
  userId: 1,
  landUnit: "stremata",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const mockSupplies: Supply[] = [
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

const mockSeason: Season = {
  id: 1,
  name: "Test Season",
  startSeason: "2024-01-01",
  finishSeason: "2024-06-01",
  areaInMeters: 100,
  crop: 1,
  cropName: "Test Seeds",
  fieldName: "Test Field",
  fieldAreaInMeters: 100,
  fieldId: 1,
  landUnit: "stremata",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  boundary: undefined,
};

afterEach(() => {
  cleanup();
});

describe("UpdateSeasonForm Tests", () => {
  it("Text Render Correct with Update translations", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" season={mockSeason} userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Seasons.Update.title })).toBeDefined();
    expect(screen.getByText(en.Seasons.Update.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Seasons.Update.submitButton })).toBeDefined();
  });

  it("Pre-populated values from season", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" season={mockSeason} userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByDisplayValue("Test Season")).toBeDefined();
  });

  it("Name field can be updated", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" season={mockSeason} userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByDisplayValue("Test Season");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Season");

    expect(screen.getByDisplayValue("Updated Season")).toBeDefined();
  });

  it("Name required error - clear name field", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" season={mockSeason} userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByDisplayValue("Test Season");
    await userEvent.clear(nameInput);

    await waitFor(() => {
      expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    });
    expect(screen.getByText(en.Seasons.Update.name + " is required")).toBeDefined();
  });
});
