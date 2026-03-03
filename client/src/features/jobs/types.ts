import { DateSTR } from "@/types/globalTypes";

export interface Job {
  id: number;
  jobType: string;
  description: string | null;
  seasonId: number;
  jobDate: DateSTR;
  areaInMeters: number;
  boundary: Array<[number, number]> | null;
  landUnit: string;
  createdAt: DateSTR;
  updatedAt: DateSTR;
  jobsSupplies: JobSupply[];
}

export interface JobSupply {
  id: number;
  quantity: number;
  jobId: number;
  createdAt: DateSTR;
  updatedAt: DateSTR;
  supplyName: string;
  supplyAlias: string | null;
  supplyId: number;
  supplyMeasurementUnit: string;
}
