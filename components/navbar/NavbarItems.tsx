import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Navbar = ({ isToggled }: { isToggled: boolean }) => {

 const items = [
    {
      id: 1,
      name: "Home",
      url: "/",
    },
    
    {
      id: 2,
      name: "Blog",
      url: "/blog",
    },
    
    {
      id: 3,
      name: "Logros",
      url: "/logros",
    },

    {
      id: 4,
      name: "Perfil",
      url: "/perfil",
    }
  ];

  

  // Variants para los ítems
  const navItem = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: (index: number) => ({
      y: 10,
      opacity: 1,
      transition: {
        delay: index * 0.2, // Escalonamiento basado en el índice
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: {
      y: -20, // Mover hacia arriba
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn", // Cambia el ease si lo prefieres
      },
    },
  };

  return (
    <div className="flex justify-center gap-5 mt-10">
      <AnimatePresence>
        {isToggled &&
          items.map((item, index) => (
            <motion.li
              key={item.id}
              className="flex items-center justify-center nav-item mb-10"
              variants={navItem}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={index}

              
            >
              <Link href={item.url} className="text-2xl font-[family-name:var(--blender-normal)]">
                {item.name}
              </Link>
            </motion.li>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
