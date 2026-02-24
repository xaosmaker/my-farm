import { DateSTR } from "@/types/globalTypes";

interface BaseField {
  id: number;
  name: string;
  epsg2100Boundary: Array<[number, number]> | undefined;
  epsg4326Boundary: Array<[number, number]> | undefined;
  mapLocation: Array<[number, number]> | undefined;
  fieldLocation: string;
  areaInMeters: number;
  createdAt: DateSTR;
  updatedAt: DateSTR;
}

export interface FieldResponse extends BaseField {
  isOwned: boolean;
  landUnit: "m2" | "hectares" | "stremata";
}

export interface Field extends BaseField {
  isOwned: string;
  landUnit: string;
}
