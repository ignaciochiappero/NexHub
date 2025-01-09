"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Users, Search, UserPlus, MessageCircle } from 'lucide-react';

type User = {
  id: number;
  name: string;
  avatar: string;
  role: string;
  projects: number;
  status: 'online' | 'offline';
};

export default function UsersListPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Nacho Chiappero",
      avatar: "/perfil-n-d.png",
      role: "Full Stack Developer",
      projects: 42,
      status: 'online'
    },
    {
      id: 2,
      name: "María Rodríguez",
      avatar: "/perfil.png",
      role: "UX/UI Designer",
      projects: 25,
      status: 'offline'
    },
    {
      id: 3,
      name: "Carlos Gómez",
      avatar: "/perfil.png",
      role: "Backend Engineer",
      projects: 33,
      status: 'online'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1A1A1A] min-h-screen p-6 pt-40">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-white mb-8 flex items-center">
          <Users className="mr-4 text-pink-500" /> Usuarios
        </h1>

        {/* Search and Add User Section */}
        <div className="mb-6 flex space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios por nombre o rol"
              className="w-full bg-[#353535] text-white pl-10 p-3 rounded-xl"
            />
          </div>
          <button className="bg-pink-600 text-white p-3 rounded-xl hover:bg-pink-700 transition">
            <UserPlus />
          </button>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="bg-[#353535] rounded-2xl p-6 hover:bg-[#454545] transition"
            >
              <div className="flex items-center mb-4">
                <div className="relative">
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={60} 
                    height={60} 
                    className="rounded-full mr-4"
                  />
                  <div 
                    className={`
                      absolute bottom-0 right-4 w-3 h-3 rounded-full 
                      ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}
                    `}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.role}</p>
                </div>
              </div>

              <div className="bg-[#454545] rounded-xl p-3 mb-4">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Proyectos Completados</span>
                  <span className="font-bold text-pink-500">{user.projects}</span>
                </div>
              </div>

              <div className="flex justify-between">
                {/* <button className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition flex items-center">
                  <MessageCircle className="mr-2" /> Mensaje
                </button> */}
                <button className="bg-[#454545] text-white px-4 py-2 rounded-full hover:bg-[#555] transition">
                  Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}