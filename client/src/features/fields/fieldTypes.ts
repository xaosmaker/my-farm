import { DateSTR } from "@/types/globalTypes";

interface BaseField {
  id: number;
  name: string;
  epsg2100Boundary: undefined | Array<[number, number]>;
  epsg4326Boundary: undefined | Array<[number, number]>;
  mapLocation: undefined | Array<[number, number]>;
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
