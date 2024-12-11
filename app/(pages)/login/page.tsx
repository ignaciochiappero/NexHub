"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, User, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login/signup logic
    console.log(isLogin ? 'Logging in' : 'Signing up', email);
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen flex items-center justify-center p-6 pt-40 font-[family-name:var(--blender-medium)]">
      <div className="bg-[#353535] rounded-2xl p-8 w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Image 
            src="/perfil-n-d.png" 
            alt="Profile" 
            width={100} 
            height={100} 
            className="mx-auto rounded-full mb-4"
          />
          <h1 className="text-3xl font-bold text-white">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h1>
        </div>

{/* POR SI NO ESTÁ REGISTRADO, SALE ESTA PARTE */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Nombre de Usuario" 
                className="w-full bg-[#454545] text-white pl-10 p-3 rounded-xl"
              />
            </div>
          )} */}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo Electrónico" 
              className="w-full bg-[#454545] text-white pl-10 p-3 rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña" 
              className="w-full bg-[#454545] text-white pl-10 p-3 rounded-xl"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-full hover:bg-pink-700 transition"
          >
            {isLogin ? 'Entrar' : 'Crear Cuenta'}
          </button>

          <div className="text-center text-gray-400 mt-4">
            {/* {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'} */}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-500 ml-2 hover:underline"
            >
              {/* {isLogin ? 'Registrarse' : 'Iniciar Sesión'} */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}