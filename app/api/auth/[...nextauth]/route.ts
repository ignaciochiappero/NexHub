//app\api\auth\[...nextauth]\route.ts

import NextAuth from "next-auth";
import CreadentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";

import bcrypt from "bcrypt";


const handler = NextAuth({
    providers: [
        
        CreadentialsProvider({
            
            name: "credentials",
            
            credentials: {
               
                email: { label: "Email", type: "email", placeholder: "Tu Email" },
               
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials: any, req) {

                const {email, password} = credentials;

                const userFound = await prisma.user.findUnique({where: {
                    email
                  },
                });

                //Si no encuentra al usuario
                if (!userFound) throw new Error("Usuario Inválido!");


                // //Si la contraseña es válida
                // const validPassword = await userFound.password === password

                //esto reemplaza lo de arriba porque se desencripta la contraseña
                const validPassword = await bcrypt.compare(
                    password,
                    userFound.password
                );

                //Si la contraseña es inválida
                if (!validPassword) throw new Error("Contraseña Inválida");


                //si todo sale bien devuelve esto
                return {
                    id: userFound.id + '',
                    name: userFound.name,
                    email: userFound.email,
                };
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
