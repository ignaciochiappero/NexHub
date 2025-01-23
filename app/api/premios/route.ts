//app\api\premios\route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
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
  try {
    const body = await req.json();
    const { titulo, subtitulo, descripcion, imagen } = body;

    // Validaciones básicas
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