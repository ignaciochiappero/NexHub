
//app\api\users\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Obtener todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        location: true,
        company: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// POST: Crear un nuevo usuario
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { name, email, password, birthday, location, company, image } = await req.json();

    // Validaciones básicas
    if (!name || !email || !password || !birthday) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        birthday: new Date(birthday),
        location: location || null,
        company: company || null,
        image: image || null,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_POST_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}