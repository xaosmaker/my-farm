import "@testing-library/jest-dom";
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(() => Promise.resolve(null)), // default: not logged in
}));
