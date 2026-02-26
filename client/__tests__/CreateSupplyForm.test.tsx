import { cleanup, render, screen } from "@testing-library/react";
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

  it("Name required error - click empty form", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm />
      </NextIntlClientProvider>,
    );

    const submitButton = screen.getByRole("button", { name: en.Supplies.Create.submitButton });
    await userEvent.click(submitButton);

    expect(screen.queryByText(/is required/)).toBeNull();
  });

  it("Valid form with all fields", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Supplies.Create.name + " *");
    await userEvent.type(nameInput, "Test Supply");

    const nicknameInput = screen.getByLabelText(en.Supplies.Create.nickname);
    await userEvent.type(nicknameInput, "My Supply");

    expect(screen.queryByText(en.Global.Error.invalid_number)).toBeNull();
  });
});
