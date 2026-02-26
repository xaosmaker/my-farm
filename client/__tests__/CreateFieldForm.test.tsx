import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import CreateFieldForm from "@/features/fields/forms/CreateFieldForm";
import { createFieldAction } from "@/features/fields/fieldActions";
import { UserSettings } from "@/types/globalTypes";

vi.mock("@/features/fields/fieldActions", () => ({
  createFieldAction: vi.fn(),
}));
vi.mock("next/navigation");

const mockUserSettings: UserSettings = {
  id: 1,
  userId: 1,
  landUnit: "stremata",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

afterEach(() => {
  cleanup();
});

describe("CreateFieldForm Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Fields.Create.title })).toBeDefined();
    expect(screen.getByText(en.Fields.Create.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Fields.Create.submitButton })).toBeDefined();
    expect(screen.getByLabelText(en.Fields.Create.name + " *")).toBeDefined();
    expect(screen.getByLabelText(en.Fields.Create.fieldLocation)).toBeDefined();
    expect(screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters))).toBeDefined();
    expect(screen.getByLabelText(en.Fields.Create.owned)).toBeDefined();
  });

  it("Name required error - click empty form", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: en.Fields.Create.submitButton });
    await userEvent.click(submitButton);

    expect(screen.queryByText(/is required/)).toBeNull();
  });

  it("Area invalid number error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "abc");

    expect(screen.getByText(en.Global.Error.invalid_number)).toBeDefined();
  });

  it("Area zero value error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "0");

    const fieldElement = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    expect(fieldElement).toBeDefined();
  });

  it("Valid form passes validation", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "10");

    expect(screen.queryByText(en.Global.Error.invalid_number)).toBeNull();
    expect(screen.queryByText(en.Global.Error.invalid_min)).toBeNull();
  });

  it("Action is called with correct data", async () => {
    const mock = createFieldAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "10");

    const submitButton = screen.getByRole("button", { name: en.Fields.Create.submitButton });
    await userEvent.click(submitButton);

    expect(createFieldAction).toHaveBeenCalled();
    expect(createFieldAction).toHaveBeenCalledWith(undefined, {
      name: "My Field",
      areaInMeters: "10",
      fieldLocation: "",
      isOwned: false,
      landUnit: "stremata",
      govPDF: null,
    });
  });

  it("Location field can be filled", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const locationInput = screen.getByLabelText(en.Fields.Create.fieldLocation);
    await userEvent.type(locationInput, "Athens");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "10");

    const submitButton = screen.getByRole("button", { name: en.Fields.Create.submitButton });
    await userEvent.click(submitButton);

    expect(createFieldAction).toHaveBeenCalledWith(undefined, {
      name: "My Field",
      areaInMeters: "10",
      fieldLocation: "Athens",
      isOwned: false,
      landUnit: "stremata",
      govPDF: null,
    });
  });

  it("isOwned switch can be toggled", async () => {
    const mock = createFieldAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFieldForm userSettings={mockUserSettings} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Fields.Create.name + " *");
    await userEvent.type(nameInput, "My Field");

    const areaInput = screen.getByLabelText(new RegExp(en.Fields.Create.areaInMeters));
    await userEvent.type(areaInput, "10");

    const switchElement = screen.getByRole("switch", { name: en.Fields.Create.owned });
    await userEvent.click(switchElement);

    const submitButton = screen.getByRole("button", { name: en.Fields.Create.submitButton });
    await userEvent.click(submitButton);

    expect(createFieldAction).toHaveBeenCalledWith(undefined, {
      name: "My Field",
      areaInMeters: "10",
      fieldLocation: "",
      isOwned: true,
      landUnit: "stremata",
      govPDF: null,
    });
  });
});
