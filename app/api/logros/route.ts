
//app\api\logros\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function GET() {
  
    const logros = await prisma.logro.findMany();
  
    return new NextResponse(JSON.stringify(logros), { status: 200 });
  }
  


  export async function POST(req: NextRequest) {
    
    const { title, description } = await req.json();
    const logroCreated = await prisma.logro.create({
      data: {
        
        title,
        description
    }});
  
    return new NextResponse(JSON.stringify(logroCreated), { status: 200 });
  }
  