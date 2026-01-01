interface InternalJob {
  id: number;
  jobType: string;
  description: null | string;
  fildId: number;
  jobDate: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface Job extends InternalJob {
  totalSupplies: number;
}

export interface JobDetails extends InternalJob {
  jobsSupplies: JobSupplies[];
}

export const JOB_TYPES_WITH_SUPPLIES = [
  "spraying", //Ψεκασμός
  "fertilizing", //Λίπανση
  "sowing", //Σπορά
  "harvesting", //Συγκομιδή
  "planting", //Φύτευση
] as const;

export const JOB_TYPES = [
  "spraying", //Ψεκασμός
  "fertilizing", //Λίπανση
  "planting", //Φύτευση
  "sowing", //Σπορά
  "irrigation", //Άρδευση / Πότισμα
  "transplanting", //Μεταφύτευση
  "harvesting", //Συγκομιδή
  "pruning", //Κλάδεμα
  "weeding", //Ζιζανιοκτονία / Βοτάνισμα
  "soil preparation", //Προετοιμασία εδάφους
  "plowing", //Όργωμα
  "tilling", //Φρεζάρισμα
  "cultivation", //Καλλιέργεια
  "pest control", //Καταπολέμηση εχθρών
  "disease control", //Καταπολέμηση ασθενειών
  "crop monitoring", //Παρακολούθηση καλλιεργειών
  "soil testing", //Εδαφολογικός έλεγχος
  "fertilizer application", //Εφαρμογή λιπασμάτων
  "pesticide application", //Εφαρμογή φυτοφαρμάκων
  "equipment maintenance", //Συντήρηση εξοπλισμού
  "field cleaning", //Καθαρισμός αγρού
  "mulching", //Εδαφοκάλυψη
  "thinning", //Αραίωμα
  "post-harvest handling", //Μετασυλλεκτικοί χειρισμοί
] as const;

export type JobTypes = (typeof JOB_TYPES)[number];
export type JobTypesWithSupplies = (typeof JOB_TYPES_WITH_SUPPLIES)[number];
