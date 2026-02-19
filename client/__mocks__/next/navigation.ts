import { vi } from "vitest";
const push = vi.fn();
const replace = vi.fn();
const back = vi.fn();
const forward = vi.fn();
const refresh = vi.fn();
const prefetch = vi.fn();
export const useRouter = () => ({
  push,
  replace,
  back,
  forward,
  refresh,
  prefetch,
});
export const usePathname = vi.fn();
export const redirect = vi.fn();
