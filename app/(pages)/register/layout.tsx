
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Register | NexHub",
  description: "Register Page",
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