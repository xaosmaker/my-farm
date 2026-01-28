const push = jest.fn();
const replace = jest.fn();
const back = jest.fn();
const forward = jest.fn();
const refresh = jest.fn();
const prefetch = jest.fn();
export const useRouter = () => ({
  push,
  replace,
  back,
  forward,
  refresh,
  prefetch,
});
export const usePathname = jest.fn();
export const redirect = jest.fn();
