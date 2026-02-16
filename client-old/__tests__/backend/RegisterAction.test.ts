import { toResponseError } from "@/lib/responseError";
import { regErrors } from "../errorMessages/RegisterErrors";
import { createUserAction } from "@/features/auth/actions/authActions";

let error = toResponseError(regErrors);
describe("Test Register Action", () => {
  it("Empty body", async () => {
    const res = await createUserAction(undefined, {
      email: "",
      password: "",
      confirmPassword: "",
    });
    expect(res.success).toBe(false);
    expect(res.errors).toBeDefined();
    for (const err of res.errors!) {
      error = error?.filter(
        (item) =>
          item.message !== err.message &&
          (err.meta !== item.meta || err.meta === null),
      );
    }
    expect(error?.length).toBe(4);
  });
  it("wrong fields error", async () => {
    const res = await createUserAction(undefined, {
      email: "test",
      password: "Some",
      confirmPassword: "some1",
    });
    expect(res.success).toBe(false);
    expect(res.errors).toBeDefined();

    for (const err of res.errors!) {
      error = error?.filter(
        (item) =>
          item.message !== err.message &&
          (err.meta !== item.meta || err.meta === null),
      );
    }

    expect(error?.length).toBe(1);
  });
  it("email already exists", async () => {
    const res = await createUserAction(undefined, {
      email: "test@test.com",
      password: "Test1test",
      confirmPassword: "Test1test",
    });
    expect(res.success).toBe(false);
    expect(res.errors).toBeDefined();

    for (const err of res.errors!) {
      error = error?.filter(
        (item) =>
          item.message !== err.message &&
          (err.meta !== item.meta || err.meta === null),
      );
    }

    expect(error?.length).toBe(0);
  });

  it("email already exists", async () => {
    const res = await createUserAction(undefined, {
      email: "test1@test.com",
      password: "Test1test",
      confirmPassword: "Test1test",
    });
    expect(res.success).toBe(true);
    expect(res.errors).not.toBeDefined();
  });
});
