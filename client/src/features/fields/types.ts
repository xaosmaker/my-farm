export interface FarmFields {
  id: number;
  createdAt: Date;
  editedAt: Date;
  fieldName: string;
  fieldEpsg2100Boundary: Array<[number, number]> | null;
  fieldEpsg4326Boundary: Array<[number, number]> | null;
  fieldLocation: [number, number] | null;
  fieldAreaInMeters: number;
  isOwned: boolean;
  farmFieldID: number;
}
