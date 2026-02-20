export function getFromLocalStorage(name: string) {
  if (typeof window === "undefined") {
    return {};
  }
  const lsData = localStorage.getItem(name);
  if (lsData === null) {
    return {};
  }
  try {
    const data = JSON.parse(lsData);
    return data;
  } catch (_e) {
    return {};
  }
}
