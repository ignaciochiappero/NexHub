
//components\Navbar.tsx

"use client";

import React, { useState } from "react";
import NavbarItems from "./NavbarItems";
import { motion, AnimatePresence } from "framer-motion";
import HamburgerIcon from "./hambIcon/HamburguerIcon";

const Navbar = () => {
  const [isToggled, setToggle] = useState(false);

  const navContainer = {
    visible: {
      //x: 0,
      opacity: 1,
      transition: {
        x: { velocity: 100 },
        duration: 0.5
      }
    },
    hidden: {
      //x: -250,
      opacity: 0,
      transition: {
        x: { velocity: 100 },
        duration: 0.3
      }
    }
  };

  return (
    <>
      <button className="flex items-center justify-center btn fixed" onClick={() => setToggle(!isToggled)}>
        <div className="flex items-center justify-center">

           <HamburgerIcon/>
        </div>
      </button>
      <AnimatePresence>
        {isToggled && (
          <motion.div
            className="navbar fixed"
            initial="hidden"
            animate={isToggled ? "visible" : "hidden"}
            exit="hidden"
            variants={navContainer}
          >
            <NavbarItems isToggled={isToggled} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
