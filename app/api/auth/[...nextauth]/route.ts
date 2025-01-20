//app\api\auth\[...nextauth]\route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CreadentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";

import bcrypt from "bcrypt";

//Creamos una constante donde guardar todo para 
//exportarla a otros lados de la app
export const authOptions: AuthOptions = {
    providers: [
        
        CreadentialsProvider({
            
            name: "credentials",
            
            credentials: {
               
                email: { label: "Email", type: "email", placeholder: "Tu Email" },
               
                password: { label: "Password", type: "password" }
            },
            

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any) {

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


    /* Con esto sacamos los datos que 
       vienen en el token */
    callbacks: {
        async jwt ({token, user}) {
            

            /* Creamos una nueva propiedad
               en el token que sea id, y 
               guarda el valor de user.id */
            if (user) {
                token.id = user.id;
            }

            return token;
        },


        //creamos el id de la session y lo guardamos como propiedad
        //para luego extraerla
        async session ({session, token}) {
            
            if (token) {
                session.user.id = token.sub as string;
            }


            
            return session;
        }
    },



    /*Acá abajo vamos a indicar qué formulario 
    queremos que use Next Auth para iniciar sesión
    indicándole la ruta donde se encuentra*/
    pages: {
        signIn: "/auth/login",

    },
}

const handler = NextAuth(authOptions);


export {handler as GET, handler as POST};