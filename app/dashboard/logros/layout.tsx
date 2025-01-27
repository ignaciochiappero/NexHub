
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Logros | NexHub",
  description: "Logros Page",
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