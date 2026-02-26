import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { updateFieldAction } from "@/features/fields/fieldActions";
import { UserSettings } from "@/types/globalTypes";
import { Field } from "@/features/fields/fieldTypes";

vi.mock("@/features/fields/fieldActions", () => ({
  updateFieldAction: vi.fn(),
}));
vi.mock("next/navigation");

const mockUserSettings: UserSettings = {
  id: 1,
  userId: 1,
  landUnit: "stremata",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const mockUserField: Field = {
  id: 1,
  name: "Test Field",
  fieldLocation: "Test Location",
  areaInMeters: 100,
  isOwned: "true",
  landUnit: "stremata",
  epsg2100Boundary: undefined,
  epsg4326Boundary: undefined,
  mapLocation: undefined,
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

afterEach(() => {
  cleanup();
});

describe("UpdateFieldForm Tests", () => {
  it("Text Render Correct with Update translations", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Fields.Update.title })).toBeDefined();
    expect(screen.getByText(en.Fields.Update.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Fields.Update.submitButton })).toBeDefined();
    expect(screen.getByLabelText(en.Fields.Update.name + " *")).toBeDefined();
    expect(screen.getByDisplayValue("Test Field")).toBeDefined();
    expect(screen.getByDisplayValue("Test Location")).toBeDefined();
    expect(screen.getByDisplayValue("100")).toBeDefined();
  });

  it("Pre-populated values from userField", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByDisplayValue("Test Field")).toBeDefined();
    expect(screen.getByDisplayValue("Test Location")).toBeDefined();
    expect(screen.getByDisplayValue("100")).toBeDefined();
  });

  it("Area invalid number error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Update.areaInMeters));
    await userEvent.clear(areaInput);
    await userEvent.type(areaInput, "abc");

    expect(screen.getByText(en.Global.Error.invalid_number)).toBeDefined();
  });

  it("Valid form passes validation", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Update.name + " *");
    await userEvent.type(nameInput, "Updated Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Update.areaInMeters));
    await userEvent.clear(areaInput);
    await userEvent.type(areaInput, "50");

    expect(screen.queryByText(en.Global.Error.invalid_number)).toBeNull();
    expect(screen.queryByText(en.Global.Error.invalid_min)).toBeNull();
  });

  it("Update action is called with correct data", async () => {
    const mock = updateFieldAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Update.name + " *");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Update.areaInMeters));
    await userEvent.clear(areaInput);
    await userEvent.type(areaInput, "50");

    const submitButton = screen.getByRole("button", { name: en.Fields.Update.submitButton });
    await userEvent.click(submitButton);

    expect(updateFieldAction).toHaveBeenCalled();
    expect(updateFieldAction).toHaveBeenCalledWith(mockUserField, undefined, {
      name: "Updated Field",
      areaInMeters: "50",
      fieldLocation: "Test Location",
      isOwned: true,
      landUnit: "stremata",
      govPDF: null,
    });
  });

  it("Location field can be updated", async () => {
    const mock = updateFieldAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    const locationInput = screen.getByLabelText(en.Fields.Update.fieldLocation);
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, "New Location");

    const submitButton = screen.getByRole("button", { name: en.Fields.Update.submitButton });
    await userEvent.click(submitButton);

    expect(updateFieldAction).toHaveBeenCalledWith(
      mockUserField,
      undefined,
      expect.objectContaining({
        fieldLocation: "New Location",
      }),
    );
  });

  it("isOwned switch value is sent correctly", async () => {
    const mock = updateFieldAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} userField={mockUserField} />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: en.Fields.Update.submitButton });
    await userEvent.click(submitButton);

    expect(updateFieldAction).toHaveBeenCalledWith(
      mockUserField,
      undefined,
      expect.objectContaining({
        isOwned: true,
      }),
    );
  });
});
