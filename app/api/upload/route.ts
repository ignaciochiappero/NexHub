// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import cloudinary from '@/libs/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Convertir el archivo a un Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un stream desde el buffer
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_images',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Error en Cloudinary:', error);
          return NextResponse.json(
            { error: 'Error al subir la imagen' },
            { status: 500 }
          );
        }
      }
    );

    // Convertir el buffer a base64 y subirlo
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'profile_images',
        },
        (error, result) => {
          if (error) {
            reject(
              NextResponse.json(
                { error: 'Error al subir la imagen' },
                { status: 500 }
              )
            );
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
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}