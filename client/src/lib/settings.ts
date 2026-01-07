export const HECTARES_TO_M2 = 10_000;
export const STREMATA_TO_M2 = 1000;

export function getLandUnit(): { name: string; value: number } {
  if (typeof window === "undefined") {
    return { name: "default", value: 1 };
  }
  const unit = localStorage.getItem("landUnit");
  switch (unit) {
    case "stremata":
      return { name: "stremata", value: STREMATA_TO_M2 };
    case "hectares":
      return { name: "hectares", value: HECTARES_TO_M2 };
    default:
      return { name: "default", value: 1 };
  }
}
export type LandUnit = "stremata" | "hectares" | "default";

export function setLandUnit(value: LandUnit) {
  localStorage.setItem("landUnit", value);
}
