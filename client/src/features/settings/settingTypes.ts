import { DateSTR } from "@/types/genetalTypes";

export interface UserSettings {
  id: number;
  userId: number;
  landUnit: string;
  createdAt: DateSTR;
  updatedAt: DateSTR;
}
