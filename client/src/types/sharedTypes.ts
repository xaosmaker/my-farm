export interface Supply {
  id: number;
  supplyType: string;
  nickname: string | undefined;
  name: string;
  measurementUnit: string;
  createdAt: Date;
  updatedAt: Date;
}
