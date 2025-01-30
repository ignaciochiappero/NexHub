

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/libs/cloudinary";
import { getServerSession } from "next-auth/next";
import { config as authOptions } from "@/auth.config";

export async function POST(request: NextRequest): Promise<NextResponse> {
  
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  
  
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<NextResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "premios",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Error en Cloudinary:", error);
            resolve(
              NextResponse.json(
                { error: "Error al subir la imagen" },
                { status: 500 }
              )
            );
            return;
          }
          
          resolve(
            NextResponse.json({
              url: result?.secure_url,
            })
          );
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}