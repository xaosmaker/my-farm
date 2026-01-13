import { JOB_TYPES, JOB_TYPES_WITH_SUPPLIES } from "@/types/sharedTypes";

export interface Job {
  id: number;
  jobType: string;
  description: null | string;
  jobDate: Date;
  seasonID: number;
  areaInMeters: number;
  boundary: Array<[number, number]>;
  createdAt: Date;
  updatedAt: Date;
  jobsSupplies: JobSupplies[];
}

export interface JobSupplies {
  id: number;
  quantity: number;
  jobId: number;
  createdAt: Date;
  updatedAt: Date;
  supplyId: number;
  supplyName: string;
  supplyAlias: string;
  supplyMeasurementUnit: string;
}

export type JobTypes = (typeof JOB_TYPES)[number];
export type JobTypesWithSupplies = (typeof JOB_TYPES_WITH_SUPPLIES)[number];
