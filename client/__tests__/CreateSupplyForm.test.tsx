import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateSupplyForm from "@/features/supplies/forms/CreateSupplyForm";

vi.mock("next/navigation");

afterEach(() => {
  cleanup();
});

describe("CreateSupplyForm Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Supplies.Create.title })).toBeDefined();
    expect(screen.getByText(en.Supplies.Create.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Supplies.Create.submitButton })).toBeDefined();
    expect(screen.getByLabelText(en.Supplies.Create.name + " *")).toBeDefined();
    expect(screen.getByLabelText(en.Supplies.Create.nickname)).toBeDefined();
    expect(screen.getByLabelText(en.Supplies.Create.supplyType + " *")).toBeDefined();
    expect(screen.getByLabelText(en.Supplies.Create.measurementUnit + " *")).toBeDefined();
  });

  it("Name required error - clear name field", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Supplies.Create.name + " *");
    await userEvent.type(nameInput, "Supply Name");
    await userEvent.clear(nameInput);

    await waitFor(() => {
      expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    });
    expect(screen.getByText(en.Supplies.Create.name + " is required")).toBeDefined();
  });
});
