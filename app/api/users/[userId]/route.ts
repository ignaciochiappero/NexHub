import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
    const userId = params.userId;

    try {
        await prisma.user.delete({ where: { id: parseInt(userId) } });
        return NextResponse.json({ message: "Usuario y proyectos eliminados" }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar usuario y proyectos:", error);
        return NextResponse.json({ error: "Error al eliminar usuario y proyectos" }, { status: 500 });
    }
}


// TODO: CREAR FUNCION PUT PARA EDITAR USUARIOS
