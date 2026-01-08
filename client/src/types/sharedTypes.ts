export interface Supply {
  id: number;
  supplyType: string;
  nickname: string | undefined;
  name: string;
  measurementUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: number;
  userID: number;
  landUnit: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
