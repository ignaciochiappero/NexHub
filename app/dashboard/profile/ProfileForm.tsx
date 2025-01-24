/* eslint-disable @typescript-eslint/no-unused-vars */

//app\dashboard\profile\ProfileForm.tsx

"use client";

import { useState, useRef } from "react";
import { Role, User } from "@prisma/client";
import Image from "next/image";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { Camera, Save, Edit2, X, Check } from "lucide-react";

interface ProfileFormProps {
  initialUser: {
    id: number;
    name: string;
    role: Role;
    image: string | null;
    email: string;
    password: string;
    birthday: string | Date;
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
    birthday: new Date(initialUser.birthday),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImageHovered, setIsImageHovered] = useState(false);

  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionsTimer, setInstructionsTimer] =
    useState<NodeJS.Timeout | null>(null);

  // Estados para el recortador de imágenes
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result?.toString() || "");
      // Mostrar instrucciones primero
      setShowInstructions(true);

      // Configurar el timer para mostrar el cropper después de 3 segundos
      const timer = setTimeout(() => {
        setShowInstructions(false);
        setShowCropper(true);
      }, 5000);

      setInstructionsTimer(timer);
    });
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    crop: Crop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

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
          if (!blob) throw new Error("Canvas is empty");
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
      const croppedImageFile = new File(
        [croppedImageBlob],
        selectedFile?.name || "cropped.jpg",
        {
          type: "image/jpeg",
        }
      );

      await handleImageUpload(croppedImageFile);
      setShowCropper(false);
      setImgSrc("");
    } catch (error) {
      console.error("Error al recortar la imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al subir la imagen");

      const data = await response.json();

      const updateResponse = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, image: data.url }),
      });

      if (!updateResponse.ok) throw new Error("Error al actualizar el perfil");

      const updatedUser = await updateResponse.json();
      setUser(updatedUser);

      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-xl font-[family-name:var(--blender-medium)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-pink-600"
              >
                <Check />
              </motion.div>
            </div>
            <div>
              <p className="font-medium">¡Imagen actualizada!</p>
              <p className="text-sm opacity-90">
                Tu foto de perfil ha sido actualizada
              </p>
            </div>
          </div>
        </motion.div>
      ));
    } catch (error) {
      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 rounded-xl shadow-xl font-[family-name:var(--blender-medium)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1">
              <motion.div className="text-red-600">
                <X />
              </motion.div>
            </div>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-90">
                No se pudo actualizar la imagen
              </p>
            </div>
          </div>
        </motion.div>
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return argDate.toISOString().split("T")[0];
    } catch (error) {
      return dateString;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      birthday: formatDate(formData.get("birthday") as string),
      location: (formData.get("location") as string) || null,
      company: (formData.get("company") as string) || null,
      image: user.image,
    };

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Error al actualizar el perfil");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);

      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-xl shadow-xl font-[family-name:var(--blender-medium)]"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-pink-600"
              >
                <Check />
              </motion.div>
            </div>
            <div>
              <p className="font-medium">¡Perfil actualizado!</p>
              <p className="text-sm opacity-90">
                Tus cambios han sido guardados
              </p>
            </div>
          </div>
        </motion.div>
      ));
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    }
  };

  const displayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const argDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000
      );
      return argDate.toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full bg-[#353535]/50 backdrop-blur-sm rounded-xl p-8 text-center font-[family-name:var(--blender-medium)]">
        <div className="mb-8 relative">
          {showInstructions ? (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#353535] p-8 rounded-2xl max-w-md w-full shadow-2xl mx-4 text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Camera size={40} className="text-white" />
                  </div>
                </motion.div>

                <h3 className="text-2xl font-[family-name:var(--blender-medium)] text-white mb-4">
                  ¡Importante!
                </h3>

                <p className="text-gray-300 mb-4">
                  A continuación podrás recortar tu foto de perfil. Asegúrate de
                  ajustar el área circular para obtener el mejor resultado.
                </p>

                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-gray-400"
                >
                  El editor se abrirá automáticamente en unos segundos...
                </motion.div>
              </motion.div>
            </div>
          ) : showCropper ? (
            <div className="fixed mt-20 inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#353535] p-6 rounded-2xl max-w-2xl w-full shadow-2xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-[family-name:var(--blender-medium)] text-white">
                    Recortar imagen
                  </h3>
                  <button
                    onClick={() => setShowCropper(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={1}
                  circularCrop
                  className="rounded-xl overflow-hidden"
                >
                  <Image
                    ref={imgRef}
                    src={imgSrc}
                    alt="Crop preview"
                    className="max-h-[60vh] mx-auto"
                    width={400}
                    height={400}
                  />
                </ReactCrop>

                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCropper(false)}
                    className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCropComplete}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  >
                    Aplicar
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative inline-block group"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              {user.image ? (
                <div className="relative w-32 h-32">
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover border-4 border-pink-500/30 transition-opacity duration-200"
                    style={{ boxShadow: "0 0 30px rgba(236,72,153,0.3)" }}
                  />
                  <div
                    className={`absolute inset-0 bg-black/50 rounded-full transition-opacity duration-200 ${
                      isImageHovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageHovered ? 1 : 0 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all"
                disabled={isUploading}
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⚡
                  </motion.div>
                ) : (
                  <Camera size={20} />
                )}
              </motion.button>
            </motion.div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
            accept="image/*"
          />
        </div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="w-full max-w-md mx-auto space-y-6"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="group"
                >
                  <input
                    type="text"
                    name="name"
                    defaultValue={user.name}
                    className="w-full p-4 bg-[#212121] rounded-xl border border-gray-700 
                             focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                             transition-all outline-none text-white group-hover:border-pink-500/50"
                    placeholder="Nombre"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="group"
                >
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    className="w-full p-4 bg-[#212121] rounded-xl border border-gray-700 
                             focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                             transition-all outline-none text-white group-hover:border-pink-500/50"
                    placeholder="Email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group"
                >
                  <input
                    type="date"
                    name="birthday"
                    defaultValue={formatDate(user.birthday.toString())}
                    className="w-full p-4 bg-[#212121] rounded-xl border border-gray-700 
                    focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                    transition-all outline-none text-white group-hover:border-pink-500/50"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="group"
                >
                  <input
                    type="text"
                    name="location"
                    defaultValue={user.location || ""}
                    className="w-full p-4 bg-[#212121] rounded-xl border border-gray-700 
                    focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                    transition-all outline-none text-white group-hover:border-pink-500/50"
                    placeholder="Ubicación"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="group"
                >
                  <input
                    type="text"
                    name="company"
                    defaultValue={user.company || ""}
                    className="w-full p-4 bg-[#212121] rounded-xl border border-gray-700 
                    focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 
                    transition-all outline-none text-white group-hover:border-pink-500/50"
                    placeholder="Empresa"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 justify-center mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 
                  transition-colors flex items-center gap-2"
                >
                  <X size={20} />
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 
                  text-white hover:from-pink-700 hover:to-purple-700 
                  transition-all flex items-center gap-2 shadow-lg hover:shadow-pink-500/25"
                >
                  <Save size={20} />
                  Guardar Cambios
                </motion.button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                  from-pink-500 to-purple-500 mb-2"
                >
                  {user.name}
                </h2>
                <span
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 
                    text-pink-400 text-sm"
                >
                  {user.role}
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
              >
                <div className="p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#2f2f2f] transition-colors">
                  <p className="text-gray-400 mb-1">Email</p>
                  <p className="text-white">{user.email}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#2f2f2f] transition-colors">
                  <p className="text-gray-400 mb-1">Cumpleaños</p>
                  <p className="text-white">
                    {displayDate(user.birthday.toString())}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#2f2f2f] transition-colors">
                  <p className="text-gray-400 mb-1">Ubicación</p>
                  <p className="text-white">
                    {user.location || "No especificada"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#2f2f2f] transition-colors">
                  <p className="text-gray-400 mb-1">Empresa</p>
                  <p className="text-white">
                    {user.company || "No especificada"}
                  </p>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 
                text-white hover:from-pink-700 hover:to-purple-700 transition-all 
                flex items-center gap-2 mx-auto shadow-lg hover:shadow-pink-500/25"
              >
                <Edit2 size={20} />
                Editar Perfil
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
