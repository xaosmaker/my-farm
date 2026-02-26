import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import userEvent from "@testing-library/user-event";
import en from "../messages/en.json";
import { afterEach, describe, expect, it, Mock, vi } from "vitest";
import CreateFarmForm from "@/features/farm/forms/CreateFarmForm";
import { createFarmAction } from "@/features/farm/farmActions";
import { signOut } from "next-auth/react";

vi.mock("@/features/farm/farmActions", () => ({
  createFarmAction: vi.fn(),
}));
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(() => Promise.resolve()),
}));
vi.mock("next/navigation");

afterEach(() => {
  cleanup();
});

describe("CreateFarmForm Tests", () => {
  it("Text Render Correct", () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(en.Farm.Create.title)).toBeDefined();
    expect(screen.getByText(en.Farm.Create.desc)).toBeDefined();
    expect(screen.getByRole("button", { name: en.Farm.Create.submitButton })).toBeDefined();
    expect(screen.getByLabelText(en.Farm.Create.name + " *")).toBeDefined();
  });

  it("Name required error - clear name field", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "Farm Name");
    await userEvent.clear(nameInput);

    await waitFor(() => {
      expect(nameInput.getAttribute("aria-invalid")).toBe("true");
    });
    expect(screen.getByText(en.Global.Error.required_generic)).toBeDefined();
  });

  it("Name invalid characters error", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "Farm@#123");

    expect(screen.getByText("Farm name: should contains char, spaces and numbers")).toBeDefined();
  });

  it("Valid name passes validation", async () => {
    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "My Farm 123");

    expect(screen.queryByText("Farm name: should contains char, spaces and numbers")).toBeNull();
  });

  it("Action is called with correct data", async () => {
    const mock = createFarmAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "My Farm");

    const submitButton = screen.getByRole("button", { name: en.Farm.Create.submitButton });
    await userEvent.click(submitButton);

    expect(createFarmAction).toHaveBeenCalled();
    expect(createFarmAction).toHaveBeenCalledWith(undefined, { name: "My Farm" });
  });

  it("Success - signOut called", async () => {
    const mock = createFarmAction as Mock;
    mock.mockResolvedValue({ success: true, errors: undefined });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "My Farm");

    const submitButton = screen.getByRole("button", { name: en.Farm.Create.submitButton });
    await userEvent.click(submitButton);

    expect(signOut).toHaveBeenCalled();
  });

  it("Server error displayed", async () => {
    const mock = createFarmAction as Mock;
    mock.mockResolvedValue({
      success: false,
      errors: [{ message: "Farm already exists", appCode: "exist_error" }],
    });

    render(
      <NextIntlClientProvider messages={en} locale="en">
        <CreateFarmForm />
      </NextIntlClientProvider>,
    );

    const nameInput = screen.getByLabelText(en.Farm.Create.name + " *");
    await userEvent.type(nameInput, "Existing Farm");

    const submitButton = screen.getByRole("button", { name: en.Farm.Create.submitButton });
    await userEvent.click(submitButton);

    expect(screen.getByText("Farm already exists")).toBeDefined();
  });
});
