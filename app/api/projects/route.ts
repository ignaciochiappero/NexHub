
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  

    const data = await request.json(); 





    if (!session) {
        return NextResponse.json(
            
            {message: "No estás logueado ❌"},
            {status: 401}
        )
    }


    const newProject = await prisma.project.create({
        data: {
            title: data.title,
            description: data.description,
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