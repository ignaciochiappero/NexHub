import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import ContextProvider from "@/context/GlobalContext";
import WheelNavbar from "@/components/Navbar/WheelNavbar";
import UserDropdown from "@/components/UserDropdown/UserDropdown";

import { getSessionUser } from "@/utils/SessionUserAdmin";

// FUENTES CUSTOM
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

// paquete Blender
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

// METADATA
export const metadata: Metadata = {
  title: "Nex | Hub",
  description: "Made by Nacho Dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await getSessionUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/app/favicon.ico" />

        <meta property="og:title" content="Nex | Hub" />
        <meta property="og:description" content="Made by Nacho Dev" />
        <meta property="og:image" content="/poster-perfil.jpg" />
        <meta property="og:url" content="https://nex-hub-beta.vercel.app/" />
        <meta property="og:type" content="website" />


      </head>
      <body
        className={`${blenderMayus.variable} ${blenderMedium.variable} ${blenderNormal.variable} ${blenderThin.variable} ${blenderBold.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ContextProvider>
          <div className="flex justify-center">
            <UserDropdown />
            <WheelNavbar userData={userData} />
          </div>
        </ContextProvider>
        {children}
      </body>
    </html>
  );
}