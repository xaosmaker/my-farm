export interface Field {
  id: number;
  name: string;
  epsg2100Boundary: Array<[number, number]> | null;
  epsg4326Boundary: Array<[number, number]> | null;
  mapLocation: Array<[number, number]> | null;
  fieldLocation: string;
  areaInMeters: number;
  isOwned: boolean;
  createdAt: Date;
  updatedAt: Date;
  landUnit: string;
}
