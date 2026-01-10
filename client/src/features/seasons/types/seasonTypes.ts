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
  fieldID: number;
  crop: number;
  cropName: string;
}
