import { DateSTR } from "@/types/sharedTypes";

export interface Season {
  id: number;
  name: string;
  startSeason: DateSTR;
  finishSeason: DateSTR | undefined;
  boundary: Array<[number, number]>;
  areaInMeters: number;
  createdAt: DateSTR;
  updatedAt: DateSTR;
  landUnit: string;
  fieldId: number;
  crop: number;
  cropName: string;
  fieldName: string;
  fieldAreaInMeters: number;
}
