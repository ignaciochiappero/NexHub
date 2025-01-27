
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Usuarios | NexHub",
  description: "Usuarios Page",
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