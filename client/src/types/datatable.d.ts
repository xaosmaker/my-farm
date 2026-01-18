import { TableMeta as TB } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface TableMeta extends TB {
    formId: string;
  }
}
