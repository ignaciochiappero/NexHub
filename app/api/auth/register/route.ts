// app\api\auth\register\route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, birthday, position } = await req.json();

    // Validación básica
    if (!name || !email || !password || !birthday || !position) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("El usuario ya existe", { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        position,
        password: hashedPassword,
        birthday: new Date(birthday),
      },
    });

    // Eliminar la contraseña de la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return new NextResponse("Error Interno", { status: 500 });
  }
}

