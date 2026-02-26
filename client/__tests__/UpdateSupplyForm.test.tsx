import { cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, vi } from "vitest";
import CreateSupplyForm from "@/features/supplies/forms/CreateSupplyForm";
import { Supply } from "@/types/globalTypes";

vi.mock("next/navigation");

const mockSupply: Supply = {
  id: 1,
  name: "Test Supply",
  nickname: "My Nickname",
  supplyType: "chemicals",
  measurementUnit: "KG",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

afterEach(() => {
  cleanup();
});

describe("UpdateSupplyForm Tests", () => {
  it("Text Render Correct with Update translations", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm userSupply={mockSupply} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("heading", { name: en.Supplies.Update.title })).toBeDefined();
    expect(screen.getByText(en.Supplies.Update.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Supplies.Update.submitButton })).toBeDefined();
  });

  it("Pre-populated values from userSupply", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm userSupply={mockSupply} />
      </NextIntlClientProvider>,
    );

    expect(screen.getByDisplayValue("Test Supply")).toBeDefined();
    expect(screen.getByDisplayValue("My Nickname")).toBeDefined();
  });

  it("Name field can be updated", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm userSupply={mockSupply} />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByDisplayValue("Test Supply");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Supply");

    expect(screen.getByDisplayValue("Updated Supply")).toBeDefined();
  });

  it("Nickname field can be updated", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateSupplyForm userSupply={mockSupply} />
      </NextIntlClientProvider>,
    );

    const nicknameInput = screen.getByDisplayValue("My Nickname");
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, "New Nickname");

    expect(screen.getByDisplayValue("New Nickname")).toBeDefined();
  });
});
