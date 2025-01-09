//app\api\projects\route.ts

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

//Función de next-auth para obtener el id de la sesión de usuario
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {

    const data = await request.json(); 


    //Con esto obtenemos el id de la sesion de usuario, para luego saber a qué usuario pertenece cada tarea creada
    const session = await getServerSession(authOptions);


    //ponemos una validación para evitar
    //errores de crear tareas sin validaciones

    if (!session) {
        return NextResponse.json(
            
            {message: "No estás logueado ❌"},
            {status: 401}
        )
    }


    const newProject = await prisma.project.create({
        //datos requeridos para guardar todo en la BD
        data: {
            title: data.title,
            description: data.description,
            //Creamos la relación foránea
            user: {
                connect: {
                    id: parseInt(session?.user.id)
                }
            }
        }
    });

    return NextResponse.json(
        newProject,
        {status: 201}
    );
}