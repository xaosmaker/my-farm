import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateSeasonForm from "@/features/seasons/forms/CreateSeasonForm";
import { UserSettings, Supply } from "@/types/globalTypes";

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

afterEach(() => {
  cleanup();
});

describe("CreateSeasonForm Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Seasons.Create.title })).toBeDefined();
    expect(screen.getByText(en.Seasons.Create.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Seasons.Create.submitButton })).toBeDefined();
    expect(screen.getByLabelText(en.Seasons.Create.name + " *")).toBeDefined();
    expect(screen.getByLabelText(en.Units.stremata + " *")).toBeDefined();
  });

  it("Name required error - click empty form", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSeasonForm fieldId="1" userSettings={mockUserSettings} supplies={mockSupplies} />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: en.Seasons.Create.submitButton });
    await userEvent.click(submitButton);

    expect(screen.queryByText(/is required/)).toBeNull();
  });
});
