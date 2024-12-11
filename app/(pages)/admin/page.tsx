"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Shield, 
  Edit, 
  Trash2, 
  Plus, 
  UserPlus, 
  Trophy, 
  Settings, 
  Lock, Globe, 
} from 'lucide-react';

// Types for User and Achievement
type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  skills: string[];
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
};

export default function AdminDashboardPage() {
  // State for users and achievements
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Nacho Chiappero",
      email: "nacho@example.com",
      avatar: "/perfil-n-d.png",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "TypeScript"]
    },
    {
      id: 2,
      name: "María Rodríguez",
      email: "maria@example.com",
      avatar: "/perfil-m-d.png",
      role: "UX/UI Designer",
      skills: ["Figma", "Adobe XD", "User Research"]
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Velocista",
      description: "Completar 10 proyectos rápidamente",
      icon: Trophy
    },
    {
      id: 2,
      title: "Global Developer",
      description: "Contribuir con proyectos internacionales",
      icon: Globe
    }
  ]);

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Handler to open user edit/create modal
  const handleEditUser = (user?: User) => {
    setCurrentUser(user || {
      id: users.length + 1,
      name: '',
      email: '',
      avatar: '/default-avatar.png',
      role: '',
      skills: []
    });
    setIsUserModalOpen(true);
  };

  // Handler to open achievement edit/create modal
  const handleEditAchievement = (achievement?: Achievement) => {
    setCurrentAchievement(achievement || {
      id: achievements.length + 1,
      title: '',
      description: '',
      icon: Trophy
    });
    setIsAchievementModalOpen(true);
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen p-6 pt-40">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl text-white mb-8 flex items-center">
          <Shield className="mr-4 text-pink-500" /> Panel de Administración
        </h1>

        {/* Users Management Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white flex items-center">
              <Users className="mr-4 text-pink-500" /> Gestión de Usuarios
            </h2>
            <button 
              onClick={() => handleEditUser()}
              className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition flex items-center"
            >
              <UserPlus className="mr-2" /> Crear Usuario
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="bg-[#353535] rounded-2xl p-6 hover:bg-[#454545] transition"
              >
                <div className="flex items-center mb-4">
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={60} 
                    height={60} 
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.role}</p>
                  </div>
                </div>

                <div className="bg-[#454545] rounded-xl p-3 mb-4">
                  <div className="text-sm text-gray-300 mb-2">Habilidades:</div>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-[#353535] text-white px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    onClick={() => handleEditUser(user)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition flex items-center"
                  >
                    <Edit className="mr-2" /> Editar
                  </button>
                  <button 
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center"
                  >
                    <Trash2 className="mr-2" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Management Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white flex items-center">
              <Trophy className="mr-4 text-yellow-500" /> Gestión de Logros
            </h2>
            <button 
              onClick={() => handleEditAchievement()}
              className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition flex items-center"
            >
              <Plus className="mr-2" /> Crear Logro
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className="bg-[#353535] rounded-2xl p-6 hover:bg-[#454545] transition"
              >
                <div className="flex items-center mb-4">
                  <achievement.icon className="mr-4 w-12 h-12 text-yellow-500" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{achievement.title}</h3>
                    <p className="text-gray-400">{achievement.description}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button 
                    onClick={() => handleEditAchievement(achievement)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition flex items-center"
                  >
                    <Edit className="mr-2" /> Editar
                  </button>
                  <button 
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition flex items-center"
                  >
                    <Trash2 className="mr-2" /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Modal (for creating/editing users) */}
        {isUserModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#353535] rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl text-white mb-6">
                {currentUser?.id ? 'Editar Usuario' : 'Crear Usuario'}
              </h2>
              {/* User form fields would go here */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded-full"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Modal (for creating/editing achievements) */}
        {isAchievementModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#353535] rounded-2xl p-8 w-full max-w-md">
              <h2 className="text-2xl text-white mb-6">
                {currentAchievement?.id ? 'Editar Logro' : 'Crear Logro'}
              </h2>
              {/* Achievement form fields would go here */}
              <div className="flex justify-end space-x-4 mt-6">
                <button 
                  onClick={() => setIsAchievementModalOpen(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button 
                  className="bg-pink-600 text-white px-4 py-2 rounded-full"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}