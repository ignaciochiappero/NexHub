
//app\api\premios\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function GET() {
  
    const premios = await prisma.premio.findMany();
  
    return new NextResponse(JSON.stringify(premios), { status: 200 });
  }
  


  export async function POST(req: NextRequest) {
    
    //TODO: Luego agregar la relacion con el logro
    //    const { titulo, descripcion, logroId } = await req.json();

    const { titulo, descripcion } = await req.json();
    const premioCreated = await prisma.premio.create({
      data: {
        
        titulo,
        descripcion,
        //logroId: parseInt(logroId)
      },
      // include: {
      //   logro: true,
      // }
    })
    return new NextResponse(JSON.stringify(premioCreated), { status: 200 });
  }
  