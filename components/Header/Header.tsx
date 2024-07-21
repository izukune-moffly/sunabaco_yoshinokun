import React from "react";
import styles from "./Header.module.css";
import { SiGooglegemini } from "react-icons/si";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>よしのくん</h1>
      <nav>
        <SiGooglegemini />
        <p>タスク分解</p>
      </nav>
    </header>
  );
};

export default Header;
