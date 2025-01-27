
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Unauthorized | NexHub",
  description: "Unauthorized Page",
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