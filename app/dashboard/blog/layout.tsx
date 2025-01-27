
import { Metadata } from "next";


//METADATA
export const metadata: Metadata = {
  title: "Blog | NexHub",
  description: "Blog Page",
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