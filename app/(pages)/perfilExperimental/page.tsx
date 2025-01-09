"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { 
  FaPen, 
   
  FaCalendar,
  FaMapPin,
} from 'react-icons/fa';
import { Swords as SwordsIcon, Trophy as TrophyIcon, Star as StarIcon, Globe as GlobeIcon, Briefcase, Trophy, Edit, Swords,Gauge,  Globe,   Save,   Star,  } from 'lucide-react';

// Types
type Skill = {
  name: string;
  progress: number;
  color: string;
};

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  progress: number;
  requiredProgress: number;
};

export default function ProfilePage() {
  // Skill state
  const [skills, setSkills] = useState<Skill[]>([
    { name: "Frontend", progress: 75, color: "#ff007f" },
    { name: "Backend", progress: 60, color: "#00ff7f" },
    { name: "Design", progress: 85, color: "#7f00ff" },
    { name: "CSS", progress: 26, color: "#dbbe00" },
    { name: "Security", progress: 2, color: "#0056b1" },
    { name: "Data", progress: 100, color: "#ca300f" }
  ]);

  // Frame state
  const [currentFrame, setCurrentFrame] = useState("/marcos/marco1.png");
  const [isFramePanelOpen, setIsFramePanelOpen] = useState(false);
  const frameOptions = [
    "/marcos/marco1.png",
    "/marcos/marco2.png",
    "/marcos/marco3.png"
  ];

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      title: "Velocista",
      description: "Completar 10 proyectos",
      icon: Gauge,
      completed: false,
      progress: 42,
      requiredProgress: 100
    },
    {
      id: 2,
      title: "Global Developer",
      description: "Contribuir con 1 proyecto internacional",
      icon: Globe,
      completed: false,
      progress: 75,
      requiredProgress: 100
    },
    {
      id: 3,
      title: "Berserker",
      description: "Crear 100 proyectos",
      icon: Swords,
      completed: true,
      progress: 100,
      requiredProgress: 100
    },
    {
      id: 4,
      title: "Iniciado",
      description: "Concluir 1 proyecto complejo",
      icon: Star,
      completed: true,
      progress: 100,
      requiredProgress: 100
    }
  ]);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "Nacho Chiappero",
    bio: "Full Stack Developer | Tech Enthusiast",
    location: "Santa Fe, Argentina",
    birthdate: "1997-03-16",
    company: "Crombie Dev"
  });

  // Increment skill progress
  const incrementSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills[index].progress = Math.min(100, newSkills[index].progress + 10);
    setSkills(newSkills);
  };

  // Handle profile edit
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (

    <div className="mt-40 p-4 font-[family-name:var(--blender-medium)] flex justify-center">

      <div className="w-full max-w-6xl bg-[#212121] rounded-3xl p-6 grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile Image and Basic Info */}
        <div className="col-span-1 flex flex-col items-center">

          <div className="relative group mb-6">
            <Image
              src={currentFrame}
              width={250}
              height={250}
              alt="profile frame"
              className="absolute z-10 pointer-events-none animate-pulse"
              style={{ transform: 'scale(1.1)' }}
            />
            <Image
              src="/perfil-n-d.png"
              width={200}
              height={200}
              alt="profile-image"
              className="rounded-full relative z-0"
              style={{ transform: 'scale(0.65)' }}
            />
            <button 
              onClick={() => setIsFramePanelOpen(!isFramePanelOpen)}
              className="absolute bottom-0 right-0 z-20 bg-emerald-800 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaPen />
            </button>
          </div>

          {/* Profile Info */}
          <div className="w-full bg-[#353535] rounded-xl p-4 text-center">
            {isEditing ? (
              <div className="space-y-4">
                <input 
                  name="name"
                  value={profileInfo.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#454545] text-white p-2 rounded-md"
                />
                <textarea 
                  name="bio"
                  value={profileInfo.bio}
                  onChange={handleInputChange}
                  className="w-full bg-[#454545] text-white p-2 rounded-md"
                  rows={3}
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">{profileInfo.name}</h2>
                <p className="text-gray-400 mb-4">{profileInfo.bio}</p>
              </>
            )}
            
            {/* Profile Details */}
            <div className="space-y-2 text-left text-gray-300">
              {isEditing ? (
                <>
                  <div className="flex items-center">
                    <FaMapPin className="mr-2" />
                    <input 
                      name="location"
                      value={profileInfo.location}
                      onChange={handleInputChange}
                      className="w-full bg-[#454545] text-white p-1 rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    <input 
                      type="date"
                      name="birthdate"
                      value={profileInfo.birthdate}
                      onChange={handleInputChange}
                      className="w-full bg-[#454545] text-white p-1 rounded-md"
                    />
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-2" />
                    <input 
                      name="company"
                      value={profileInfo.company}
                      onChange={handleInputChange}
                      className="w-full bg-[#454545] text-white p-1 rounded-md"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <FaMapPin className="mr-2" /> {profileInfo.location}
                  </div>
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" /> {new Date(profileInfo.birthdate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="mr-2" /> {profileInfo.company}
                  </div>
                </>
              )}
            </div>

            {/* Edit Profile Button */}
            <button 
              onClick={handleEditProfile}
              className="mt-4 w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition flex items-center justify-center"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2" /> Guardar
                </>
              ) : (
                <>
                  <Edit className="mr-2" /> Editar Perfil
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="col-span-1 bg-[#353535] rounded-3xl p-6">
          <h2 className="text-2xl text-white mb-6 flex items-center">
            <Trophy className="mr-4 text-yellow-500" /> Habilidades
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => incrementSkill(index)}
              >
                <div 
                  className="w-32 h-32 transition-all duration-300 ease-in-out transform group-hover:scale-110"
                  title={`${skill.name} Skill Progress: ${skill.progress}%`}
                >
                  <CircularProgressbar 
                    value={skill.progress} 
                    text={`${skill.progress}%`}
                    styles={buildStyles({
                      textColor: 'white',
                      pathColor: skill.color,
                      trailColor: 'rgba(255,255,255,0.3)',
                      textSize: '24px',
                      pathTransitionDuration: 0.5
                    })}
                  />
                </div>
                <div className="text-white mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {skill.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="col-span-1 bg-[#353535] rounded-3xl p-6">
          <h2 className="text-2xl text-white mb-6 flex items-center">
            <TrophyIcon className="mr-4 text-yellow-500" /> Logros
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`
                  p-4 rounded-xl transition-all duration-300
                  ${achievement.completed 
                    ? 'bg-green-900/30 border-2 border-green-600' 
                    : 'bg-[#454545] hover:bg-[#555555]'}
                `}
              >
                <div className="flex items-center mb-2">
                  <achievement.icon 
                    className={`
                      mr-4 w-10 h-10
                      ${achievement.completed 
                        ? 'text-green-500' 
                        : 'text-gray-500'}
                    `}
                  />
                  <div>
                    <h3 className={`
                      text-lg font-bold
                      ${achievement.completed ? 'text-green-300' : 'text-white'}
                    `}>
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className={`
                      h-2 rounded-full
                      ${achievement.completed 
                        ? 'bg-green-600' 
                        : 'bg-pink-600'}
                    `}
                    style={{
                      width: `${achievement.progress}%`
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progreso</span>
                  <span>{achievement.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frame Selector Panel */}
        {isFramePanelOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#353535] p-6 rounded-xl">
              <h2 className="text-2xl text-white mb-4">Seleccionar Marco</h2>
              <div className="flex space-x-4 mb-4">
                {frameOptions.map((frame) => (
                  <Image
                    key={frame}
                    src={frame}
                    width={150}
                    height={150}
                    alt="frame option"
                    className={`
                      cursor-pointer hover:scale-110 transition-transform
                      ${currentFrame === frame ? 'border-4 border-pink-500' : ''}
                    `}
                    onClick={() => {
                      setCurrentFrame(frame);
                      setIsFramePanelOpen(false);
                    }}
                  />
                ))}
              </div>
              <button 
                onClick={() => setIsFramePanelOpen(false)}
                className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}