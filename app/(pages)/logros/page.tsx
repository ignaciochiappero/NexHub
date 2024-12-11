//app\(pages)\logros\page.tsx


"use client";

import React, { useState } from 'react';
import {
  Gauge,  
  Trophy, 
  Star, 
  Lock, 
  Unlock, 
  Medal, 
  Rocket, 
  Target, 
  CheckCircle,
  Code,
  Globe,
  Database,
  Shield,
  Swords
} from 'lucide-react';

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  progress: number;
  requiredProgress: number;
  stepsProgress: number;
  stepsFinal: number;
};

export default function LogrosPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Velocista",
      description: "Completar 10 proyectos",
      icon: Gauge ,
      completed: false,
      progress: 42,
      requiredProgress: 100,
      stepsProgress: 10,
      stepsFinal: 10
    },
    {
      id: 2,
      title: "Global Developer",
      description: "Contribuir con 1 proyecto internacional",
      icon: Globe,
      completed: false,
      progress: 75,
      requiredProgress: 100,
      stepsProgress: 1,
      stepsFinal: 1
    },
    {
      id: 3,
      title: "Berserker",
      description: "Crear 100 proyectos",
      icon: Swords,
      completed: true,
      progress: 100,
      requiredProgress: 100,
      stepsProgress: 100,
      stepsFinal: 100
    },
    {
      id: 4,
      title: "Iniciado",
      description: "Concluir 1 proyecto complejo",
      icon: Star,
      completed: true,
      progress: 100,
      requiredProgress: 100,
      stepsProgress: 1,
      stepsFinal: 1
    }
  ]);

// TODO: Hacer cálculo matemático para que coincida el porcentaje de stepsProgress con el de progress

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-8 pt-40 font-[family-name:var(--blender-medium)]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl text-white mb-8 flex items-center">
          <Trophy className="mr-4 text-yellow-500" /> Logros
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`
                p-6 rounded-xl transition-all duration-300
                ${achievement.completed 
                  ? 'bg-green-900/30 border-2 border-green-600' 
                  : 'bg-[#353535] hover:bg-[#454545]'}
              `}
            >
              <div className="flex items-center mb-4">
                <achievement.icon 
                  className={`
                    mr-4 w-12 h-12
                    ${achievement.completed 
                      ? 'text-green-500' 
                      : 'text-gray-500'}
                  `}
                />
                <div>
                  <h2 className={`
                    text-xl font-bold
                    ${achievement.completed ? 'text-green-300' : 'text-white'}
                  `}>
                    {achievement.title}
                  </h2>
                  <p className="text-gray-400">{achievement.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div 
                  className={`
                    h-2.5 rounded-full
                    ${achievement.completed 
                      ? 'bg-green-600' 
                      : 'bg-pink-600'}
                  `}
                  style={{
                    width: `${achievement.progress}%`
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <span>Progreso</span>
                <span>
                  {achievement.stepsProgress}/{achievement.stepsFinal}
                </span>
              </div>

              {achievement.completed ? (
                <div className="flex items-center text-green-500 mt-4">
                  <CheckCircle className="mr-2" /> 
                  Completado
                </div>
              ) : (
                <div className="flex items-center text-yellow-500 mt-4">
                  <Target className="mr-2" /> 
                  En curso
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}