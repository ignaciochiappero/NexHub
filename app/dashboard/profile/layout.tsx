
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Perfil | NexHub",
  description: "Perfil Page",
};



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
    <div>
      
      {children}
    </div>
  )
}