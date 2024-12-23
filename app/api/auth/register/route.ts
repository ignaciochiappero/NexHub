// app\api\auth\register\route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

import bcrypt from "bcrypt";


export async function POST  (request: Request) {
    
    const data = await request.json();


    //Crear un string único - para esto se usa npm i @types/bcrypt -D --legacy-peer-deps con 10 caracteres
    const salt = await bcrypt.genSalt(10);

    //Encriptar contraseña con 10 caracteres
    data.password = await bcrypt.hash(data.password, salt);


    //Crear nuevo usuario
    const newUser = await prisma.user.create({data});

    //esto elimina la contraseña cuando queremos que nos devuelvan los datos en el json
    const {password, createdAt, ...user} = newUser;

    return NextResponse.json(user, {status: 201});
}