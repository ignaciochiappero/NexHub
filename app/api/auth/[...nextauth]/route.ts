//app\api\auth\[...nextauth]\route.ts

import NextAuth from "next-auth";
import CreadentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        
        CreadentialsProvider({
            
            name: "credentials",
            
            credentials: {
               
                email: { label: "Email", type: "email", placeholder: "Tu Email" },
               
                password: { label: "Password", type: "password" }
            },
            
            async authorize() {
                return null
            } 

        })
    ],



    /*Acá abajo vamos a indicar qué formulario 
    queremos que use Next Auth para iniciar sesión
    indicándole la ruta donde se encuentra*/
    pages: {
        signIn: "/auth/login",

    },
});


export {handler as GET, handler as POST};
