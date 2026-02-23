import { Messages } from "next-intl";

export type DateSTR = string;

export type MUnit = keyof Messages["Units"];
export type MSupplyType = keyof Messages["SupplyTypes"];

export interface UserSettings {
  id: number;
  userId: number;
  landUnit: string;
  createdAt: DateSTR;
  updatedAt: DateSTR;
}

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

export interface Supply {
  id: number;
  supplyType: string;
  nickname: string | undefined;
  name: string;
  measurementUnit: string;
  createdAt: Date;
  updatedAt: Date;
}
