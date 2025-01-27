
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Mensajes | NexHub",
  description: "Mensajes Page",
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