import "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
  
  interface User extends PrismaUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    email?: string | null;
    name?: string | null;
    picture?: string | null;
  }
}