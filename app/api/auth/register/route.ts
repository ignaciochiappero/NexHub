// app\api\auth\register\route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function POST  (request: Request) {
    
    const data = await request.json();
    console.log(data);

    //Crear nuevo usuario
    const newUser = await prisma.user.create({data})

    return NextResponse.json(newUser, {status: 201});
}