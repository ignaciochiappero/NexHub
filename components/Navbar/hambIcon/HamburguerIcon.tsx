"use client";

import React from "react";
import "./HamburgerIcon.css";

const HamburgerIcon = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      id="hamburger-container"
      onClick={() => setIsOpen(!isOpen)}
      className="h-12 w-12 flex items-center justify-center"
    >
      <div id="nav-icon3" className={isOpen ? "open" : ""}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default HamburgerIcon;
