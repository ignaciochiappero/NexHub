/* eslint-disable @typescript-eslint/no-unused-vars */


//app\(pages)\profile\ProfileForm.tsx

'use client';

import { useState, useRef } from 'react';
import { Role, User } from '@prisma/client';
import Image from 'next/image';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfileFormProps {
  initialUser: {
    id: number;
    name: string;
    role: Role;
    image: string | null;
    email: string;
    password: string;
    birthday: string | Date
    location: string | null;
    company: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastActive: Date; 
  };
}

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [user, setUser] = useState<User & { birthday: string | Date }>({ 
    ...initialUser, 
    birthday: new Date(initialUser.birthday) 
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  



  //////////////FUNCIONES PARA EL RECORTE DE IMÁGENES Y SU SUBIDA //////////
  
  // Estados para el recortador de imágenes
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
   // aspect: 1,
    x: 0,
    y: 0,
    height: 100
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgSrc(reader.result?.toString() || '');
      setShowCropper(true);
    });
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) throw new Error('Canvas is empty');
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
      const croppedImageFile = new File([croppedImageBlob], selectedFile?.name || 'cropped.jpg', {
        type: 'image/jpeg'
      });

      await handleImageUpload(croppedImageFile);
      setShowCropper(false);
      setImgSrc('');
    } catch (error) {
      console.error('Error al recortar la imagen:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const data = await response.json();
      
      const updateResponse = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, image: data.url }),
      });

      if (!updateResponse.ok) throw new Error('Error al actualizar el perfil');

      const updatedUser = await updateResponse.json();
      setUser(updatedUser);
    } catch (error) {
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };


  /////////////////////////////////////////////////////////////////////

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      return argDate.toISOString().split('T')[0];
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      birthday: formatDate(formData.get('birthday') as string),
      location: formData.get('location') as string || null,
      company: formData.get('company') as string || null,
      image: user.image,
    };

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error('Error al actualizar el perfil');

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el perfil');
    }
  };

  const displayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      return argDate.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full bg-[#353535] rounded-xl p-4 text-center flex flex-col items-center">
      <div className="mb-4 relative">
        {showCropper ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#353535] p-4 rounded-xl max-w-2xl w-full">
              <h3 className="text-xl mb-4">Recortar imagen</h3>
              <ReactCrop
                crop={crop}
                onChange={c => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <Image
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  className="max-h-[60vh] mx-auto"
                  width={200} // optional
                  height={200} // optional
                />
              </ReactCrop>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setShowCropper(false)}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCropComplete}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600">Sin foto</span>
              </div>
            )}
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full"
                disabled={isUploading}
              >
                {isUploading ? '...' : '📷'}
              </button>
            )}
          </>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
          accept="image/*"
        />
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full p-2 bg-[#212121] rounded"
            placeholder="Nombre"
          />
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            className="w-full p-2 bg-[#212121] rounded"
            placeholder="Email"
          />
          <input
            type="date"
            name="birthday"
            defaultValue={formatDate(user.birthday.toString())}
            className="w-full p-2 bg-[#212121] rounded"
          />
          <input
            type="text"
            name="location"
            defaultValue={user.location || ''}
            className="w-full p-2 bg-[#212121] rounded"
            placeholder="Ubicación"
          />
          <input
            type="text"
            name="company"
            defaultValue={user.company || ''}
            className="w-full p-2 bg-[#212121] rounded"
            placeholder="Empresa"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Guardar
          </button>
        </form>
      ) : (
        <>
          <span className="text-2xl">{user.name}</span>
          <span>{user.role}</span>
          <span className="mt-2 text-stone-500">{user.email}</span>
          <span>Cumpleaños: {displayDate(user.birthday.toString())}</span>
          <span>Ubicación: {user.location || 'No especificada'}</span>
          <span>Empresa: {user.company || 'No especificada'}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Editar Perfil
          </button>
        </>
      )}
    </div>
  );
}