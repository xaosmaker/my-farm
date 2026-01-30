import { TableMeta as TB } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface TableMeta extends TB {
    formId: string;
  }
}

import { FieldError as FE } from "react-hook-form";

declare module "react-hook-form" {
  export interface FieldError extends FE {
    meta?: { [key: string]: string };
  }
}
