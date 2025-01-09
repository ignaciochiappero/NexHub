

import Link from 'next/link';

const AdminPanel = () => {





  return (
    <div className="min-h-screen bg-[#1A1A1A] p-6 pt-20 font-[family-name:var(--blender-bold)]">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl text-white mb-16 text-center font-bold tracking-wider">
          Panel de Administración
        </h1>
        
        <div className="flex justify-center gap-8 px-4">
          
          
          {/* BOTON 1 */}
          <Link
            href="/admin/users" 
            className="font-[family-name:var(--blender-medium)] group relative h-[500px] bg-[#353535] rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-[#454545] hover:scale-105 hover:rotate-1 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] active:scale-95 active:rotate-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-500/50 rounded-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-2" />
            
            <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
              
              <span className="text-3xl text-white font-bold tracking-wider group-hover:scale-110 transition-transform duration-500">
                Gestión de Usuarios
              </span>
              <div className="w-16 h-1 bg-pink-500 transform group-hover:scale-x-150 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          </Link>



          {/* BOTON 2 */}
          <Link
            href="/admin/logros" 
            className="font-[family-name:var(--blender-medium)] group relative h-[500px] bg-[#353535] rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-[#454545] hover:scale-105 hover:-rotate-1 hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] active:scale-95 active:rotate-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-500/50 rounded-2xl transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2" />
            <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
              <span className="text-3xl text-white font-bold tracking-wider group-hover:scale-110 transition-transform duration-500">
                Gestión de Logros
              </span>
              <div className="w-16 h-1 bg-yellow-500 transform group-hover:scale-x-150 transition-transform duration-500" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;