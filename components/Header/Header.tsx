// components/Header.tsx
import React from "react";
import { FiMenu } from "react-icons/fi";
import styles from "./Header.module.css";

interface HeaderProps {
  handleSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleSidebarToggle }) => {
  return (
    <header className={styles.header}>
      <h1>よしのくん</h1>
      <nav onClick={handleSidebarToggle}>
        <FiMenu />
      </nav>
    </header>
  );
};

export default Header;
