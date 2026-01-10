export interface Supply {
  id: number;
  supplyType: string;
  nickname: string | undefined;
  name: string;
  measurementUnit: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export type DateSTR = string;

export interface UserSettings {
  id: number;
  userID: number;
  landUnit: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const JOB_TYPES = [
  "spraying", //"Ψεκασμός"
  "drone spraying", //"Ψεκασμός drone"
  "fertilizing", //"Λίπανση"
  "sowing", //"Σπορά"
  "harvesting", //"Συγκομιδή"
  "planting", //"Φύτευση"
  "irrigation", //"πότισμα",
  "pruning", //"κλάδεμα",
  "hoeing", //"τσάπισμα",
  "preparation", //"προετοιμασία",
  "plowing", //"όργωμα",
  "leveling", //"ισοπέδωμα",
  "tilling", //"φρέζα",
  "cultivator", //"σκαλιστήρι",
  "rotary cultivator", //"φρεζοσκαλιστήρι",
  "subsoiler", //"ρίπερ",
  "harrowing", //"δισκοσβάρνα",
];

export const MEASUREMENT_UNITS = [
  "KG", //"Κιλά"
  "L", //"Λίτρα"
  "piece", //"Τεμάχιο"
];
export const SUPPLIES_TYPES = [
  "chemicals", //"Φάρμακά"
  "fertilizers", //"Λιπάσματα"
  "seeds", //"Σπόροι"
  "diesel", //"Πετρέλαιο"
];
