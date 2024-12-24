//app\layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import NavbarCustom from "@/components/navbarCustom/NavbarCustom";

import ContextProvider from "@/context/GlobalContext";




//FUENTES

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

//Paquete Blender
const blenderBold = localFont({
  src: "./fonts/BlenderPro-Bold.woff",
  variable: "--blender-bold",
  weight: "100 900",
});

const blenderNormal = localFont({
  src: "./fonts/BlenderPro-Book.woff",
  variable: "--blender-normal",
  weight: "100 900",
});

const blenderMayus = localFont({
  src: "./fonts/BlenderPro-Heavy.woff",
  variable: "--blender-mayus",
  weight: "100 900",
});

const blenderMedium = localFont({
  src: "./fonts/BlenderPro-Medium.woff",
  variable: "--blender-medium",
  weight: "100 900",
});

const blenderThin = localFont({
  src: "./fonts/BlenderPro-Thin.woff",
  variable: "--blender-thin",
  weight: "100 900",
});


//METADATA
export const metadata: Metadata = {
  title: "Nex | Hub",
  description: "Made by Nacho Dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      



      <body
        className={`${blenderMayus.variable} ${blenderMedium.variable} ${blenderNormal.variable} ${blenderThin.variable} ${blenderBold.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <ContextProvider>
          <div className=" mt-10 flex justify-center -mb-10">

          <NavbarCustom/>
          {/* <Navbar/> */}

          </div>
        </ContextProvider>




        {children}
      </body>
    </html>
  );
}
