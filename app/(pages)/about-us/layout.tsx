
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Sobre Nosotros | NexHub",
  description: "Sobre Nosotros Page",
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