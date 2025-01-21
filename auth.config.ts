import { AuthOptions } from "next-auth";
import CreadentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prisma";
import bcrypt from "bcrypt";

export const config: AuthOptions = {
    providers: [
        CreadentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Tu Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                const {email, password} = credentials;

                const userFound = await prisma.user.findUnique({
                    where: { email }
                });

                if (!userFound) throw new Error("Usuario Inválido!");

                const validPassword = await bcrypt.compare(
                    password,
                    userFound.password
                );

                if (!validPassword) throw new Error("Contraseña Inválida");

                return {
                    id: userFound.id + '',
                    name: userFound.name,
                    email: userFound.email,
                };
            } 
        })
    ],
    callbacks: {
        async jwt ({token, user}) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session ({session, token}) {
            if (token) {
                session.user.id = token.sub as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/login",
    },
};