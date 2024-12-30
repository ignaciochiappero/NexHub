// Esta es la dinámica de category xd
// app\api\logros\[logroId]\route.ts

import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";



//Traer el logro dinámico
export async function GET(req: NextRequest, {params} : { params: {logroId : string} } ) {

  const parametroId = await params.logroId;  

  const logros = await prisma.logro.findUnique({
    where: { id: parseInt(parametroId) },
  });

  if (!logros){
    return new NextResponse(JSON.stringify("no se encontró el logro"), {status: 404 });
  }

  return new NextResponse(JSON.stringify(logros), { status: 200 });


}


export async function DELETE(req: NextRequest,
  {params}: {params: {logroId: string}}
) {
  const parametroId = await params.logroId;

  const logroDeleted = await prisma.logro.delete({
    where: {id: parseInt(parametroId)}
  })

  return new NextResponse(JSON.stringify(logroDeleted), { status: 200 });
}





export async function PUT(
  req: NextRequest,
  { params }: { params: { logroId: string } }
) {
  const parametroId = params.logroId; // ID dinámico desde la URL

  try {
    // Obtener los datos enviados en el cuerpo de la solicitud
    const { title, description } = await req.json();

    // Validar que el nuevo nombre no esté vacío
    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({ error: "Faltan completar campos" }),
        { status: 400 }
      );
    }

    // Actualizar la categoría en la base de datos
    const logroUpdated = await prisma.logro.update(
      {
      //if que comprueba el id para editar ese dato específico
      where: { id: parseInt(parametroId) },

      //data es el que tiene el nuevo dato
      data: { title, description },
      }
    );

    // Responder con la categoría actualizada
    return new NextResponse(JSON.stringify(logroUpdated), { status: 200 });
  } 
  
  catch (error) {
    console.error(error);

    // Manejo de errores, como si no se encuentra la categoría
    return new NextResponse(
      JSON.stringify({ error: "Error al actualizar el logro" }),
      { status: 500 }
    );
  }
}
