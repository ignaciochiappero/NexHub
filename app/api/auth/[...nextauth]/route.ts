//app\api\auth\[...nextauth]\route.ts


import NextAuth from "next-auth";


// Movemos authOptions a un archivo separado
import { config } from "@/auth.config";

const handler = NextAuth(config);

export { handler as GET, handler as POST };