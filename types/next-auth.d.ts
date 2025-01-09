
//types\next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            email: any;
            name: ReactNode;
            id: string;
            role: "ADMIN" | "USER";
            
        };
    }
}