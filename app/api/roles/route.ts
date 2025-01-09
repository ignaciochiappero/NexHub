


import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";


export async function GET() {
  
    const roles = await prisma.role.findMany();
  
    return new NextResponse(JSON.stringify(roles), { status: 200 });
  }
  


  export async function POST(req: NextRequest) {
    
    const { name } = await req.json();
    const roleCreated = await prisma.role.create({
      data: {
        name
    }});
  
    return new NextResponse(JSON.stringify(roleCreated), { status: 200 });
  }
  