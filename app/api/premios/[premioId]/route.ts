// app\api\logros\[logroId]\route.ts

import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";



//Traer el logro dinámico
export async function GET(req: NextRequest, {params} : { params: {premioId : string} } ) {

  const parametroId = await params.premioId;  

  const premios = await prisma.premio.findUnique({
    where: { id: parseInt(parametroId) },
  });

  if (!premios){
    return new NextResponse(JSON.stringify("no se encontró el premio"), {status: 404 });
  }

  return new NextResponse(JSON.stringify(premios), { status: 200 });


}


export async function DELETE(req: NextRequest,
  {params}: {params: {premioId: string}}
) {
  const parametroId = await params.premioId;

  const premioDeleted = await prisma.premio.delete({
    where: {id: parseInt(parametroId)}
  })

  return new NextResponse(JSON.stringify(premioDeleted), { status: 200 });
}





export async function PUT(
  req: NextRequest,
  { params }: { params: { premioId: string } }
) {
  const parametroId = params.premioId; // ID dinámico desde la URL

  try {

    //TODO: Luego agregar la relacion con el logro
    //const { titulo, descripcion, logroId } = await req.json();


    const { titulo, descripcion } = await req.json();

    // Validar que el nuevo nombre no esté vacío
    if (!titulo || !descripcion) {
      return new NextResponse(
        JSON.stringify({ error: "Faltan completar campos" }),
        { status: 400 }
      );
    }

    // Actualizar la categoría en la base de datos
    const premioUpdated = await prisma.premio.update(
      {
      //if que comprueba el id para editar ese dato específico
      where: { id: parseInt(parametroId) },

      //data es el que tiene el nuevo dato
      data: { 
        titulo, 
        descripcion, 
        //logroId: parseInt(logroId) 
    },
      }
    );

    // Responder con la categoría actualizada
    return new NextResponse(JSON.stringify(premioUpdated), { status: 200 });
  } 
  
  catch (error) {
    console.error(error);

    // Manejo de errores, como si no se encuentra la categoría
    return new NextResponse(
      JSON.stringify({ error: "Error al actualizar el premio" }),
      { status: 500 }
    );
  }
}
