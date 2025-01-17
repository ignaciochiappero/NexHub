
//app\api\logros\route.ts


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET: Obtener todos los logros
export async function GET() {
  try {
    const logros = await prisma.logro.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
        stepsFinal: true,
        createdAt: true,
        premios: {
          select: {
            premio: {
              select: {
                id: true,
                titulo: true,
                subtitulo: true,
                descripcion: true,
                imagen: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformar la respuesta para que sea más fácil de usar en el cliente
    const formattedLogros = logros.map(logro => ({
      ...logro,
      premios: logro.premios.map(p => p.premio)
    }));

    return NextResponse.json(formattedLogros);
  } catch (error) {
    console.error("[LOGROS_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// Crear un logro
export async function POST(req: NextRequest) {
  try {
    // Asegurarse de que el cuerpo de la solicitud no sea nulo
    const body = await req.json();
    
    console.log('Received request body:', body); // Debug log

    if (!body) {
      return new NextResponse(
        JSON.stringify({ error: "El cuerpo de la solicitud está vacío" }), 
        { status: 400 }
      );
    }

    const { title, description, icon, stepsFinal, premioIds = [] } = body;

    // Validar campos requeridos
    if (!title || !description || !icon || stepsFinal === undefined) {
      return new NextResponse(
        JSON.stringify({ 
          error: "Faltan campos requeridos",
          received: { title, description, icon, stepsFinal }
        }), 
        { status: 400 }
      );
    }

    // Crear el logro con sus relaciones de premios
    const logro = await prisma.logro.create({
      data: {
        title,
        description,
        icon,
        stepsFinal: Number(stepsFinal),
        // Crear las relaciones con los premios si se proporcionaron
        premios: premioIds.length > 0 ? {
          create: premioIds.map((premioId: number) => ({
            premio: {
              connect: { id: premioId }
            }
          }))
        } : undefined
      },
      include: {
        premios: {
          include: {
            premio: true
          }
        }
      }
    });

    return NextResponse.json(logro, { status: 201 });
  } catch (error) {
    console.error("[LOGRO_POST_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: "Error interno del servidor" }), 
      { status: 500 }
    );
  }
}