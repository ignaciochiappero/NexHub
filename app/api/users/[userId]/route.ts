// app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";


type RouteContext = {
  params: Promise<{ userId: string }>;
};

// GET: Obtener un usuario específico
export async function GET(
    req: NextRequest,
      context: RouteContext
) {
  try {
    // Espera la resolución de params
    const { userId } = await context.params; // Usar await aquí si params es asincrónico

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        birthday: true,
        location: true,
        company: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// PUT: Actualizar un usuario
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { userId } = await context.params; // Esperar params de manera asincrónica
    if (parseInt(session.user.id) !== parseInt(userId)) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const { image, birthday, location, company, name } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        image: image || undefined,
        birthday: birthday ? new Date(birthday) : undefined,
        location: location || undefined,
        company: company || undefined,
        name: name || undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_UPDATE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}

// DELETE: Eliminar un usuario
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await context.params; // Usar await para params

    const userDeleted = await prisma.user.delete({
      where: { id: parseInt(userId) }
    });

    return new NextResponse(JSON.stringify(userDeleted), { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE_ERROR]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
