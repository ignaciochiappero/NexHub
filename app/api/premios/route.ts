import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function GET() {

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const premios = await prisma.premio.findMany({
      select: {
        id: true,
        titulo: true,
        subtitulo: true,
        descripcion: true,
        imagen: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(premios);
  } catch (error) {
    console.error("[PREMIOS_GET_ERROR]", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string
    },
    select: {
      role: true
    }
  })

  if (user?.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  
  
  
  try {
    const body = await req.json();
    const { titulo, subtitulo, descripcion, imagen } = body;

    if (!titulo || !subtitulo || !descripcion) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" }, 
        { status: 400 }
      );
    }
  
    const premioCreated = await prisma.premio.create({
      data: {
        titulo,
        subtitulo,
        descripcion,
        imagen: imagen || "",
      },
    });

    return NextResponse.json(premioCreated, { status: 201 });
    
  } catch (error) {
    console.error("[PREMIOS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}