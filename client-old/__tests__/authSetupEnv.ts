import "@testing-library/jest-dom";
import fetch from "node-fetch";
global.fetch = fetch as any;
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(() => Promise.resolve(null)), // default: not logged in
}));

jest.mock("@/lib/serverUrl", () => ({
  SERVER_URL: "http://farm-server-test:8090",
}));
