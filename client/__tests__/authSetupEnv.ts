import { vi } from "vitest";
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(() => Promise.resolve(null)), // default: not logged in
}));

vi.mock("@/lib/serverUrl", () => ({
  SERVER_URL: "http://farm-server-test:8090",
}));
