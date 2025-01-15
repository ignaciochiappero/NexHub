
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
      },
      orderBy: {
        createdAt: 'desc' // Opcional: ordena los logros del más reciente al más antiguo
      }
    });

    return NextResponse.json(logros);
  } catch (error) {
    console.error("[LOGROS_GET_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Error al obtener los logros",
        details: error.message 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

//Crear un logro
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

    const { title, description, icon, stepsFinal } = body;

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

    // Crear el logro
    const logro = await prisma.logro.create({
      data: {
        title,
        description,
        icon,
        stepsFinal: Number(stepsFinal),
      },
    });

    return NextResponse.json(logro, { status: 201 });
  } catch (error) {
    console.error("[LOGRO_POST_ERROR]", error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: "Error interno del servidor",
        details: error.message 
      }), 
      { status: 500 }
    );
  }
}