import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
    }
}
