import React, { useState } from "react";
import "./HamburgerIcon.css"; // Importamos el archivo CSS para los estilos

const HamburgerIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIcon = () => {
    setIsOpen(!isOpen);
  };

  return (

    <div 
    onClick={toggleIcon}
    className=" h-10 w-10 rounded-full flex items-center justify-center ">

      <div
        id="nav-icon3"
        className={isOpen ? "open" : ""}
        onClick={toggleIcon}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default HamburgerIcon;
