import NextAuth from "next-auth"; // eslint-disable-line
import { JWT } from "next-auth/jwt"; // eslint-disable-line

declare module "next-auth" {
  export interface User {
    id: number;
    email: string;
    isSuperuser: boolean;
    isStaff: boolean;
    access: string;
    validity: number;
    farmId: number;
    farmName: string;
  }

  export interface session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    data: User;
  }
}
