//app\page.tsx


import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      

      
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center mt-20">
        <Image
          className="animate-neon-pulse"
          src="/logo 5.png"
          alt="Nex-hub-logo"
          width={200}
          height={200}
        />

        <div className="w-full flex items-center justify-center">
          <span className="text-3xl font-[family-name:var(--blender-medium)]">
            Bienvenidos a Nex Hub!
          </span>
        </div>
      </main>


      
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-20">
        By NachoDev - 2024
      </footer>
    </div>
  );
}