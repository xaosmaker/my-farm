export interface Job {
  id: number;
  jobType: string;
  description: null | string;
  jobDate: Date;
  createdAt: Date;
  updatedAt: Date;
  jobsSupplies: JobSupplies[];
}
export interface JobSupplies {
  id: number;
  quantity: number;
  jobId: number;
  supplyId: number;
  createdAt: Date;
  updatedAt: Date;
}
