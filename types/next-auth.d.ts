

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            email: string;
            name: ReactNode;
            id: string;
            role: "ADMIN" | "USER";
            
        };
    }
}